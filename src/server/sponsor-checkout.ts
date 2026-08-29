import "server-only";

import type Stripe from "stripe";

import { db } from "@/server/db";
import {
  getStripeInvoiceSummary,
  stripeObjectId,
  type StripeInvoiceSummary,
} from "@/server/stripe-invoice";
import { stripe } from "@/server/stripe";

export type SponsorCheckoutResult = {
  status:
    | "active"
    | "outbid"
    | "refunded"
    | "pending"
    | "cancelled"
    | "invalid";
  message: string;
  advertiserName?: string;
  slotName?: string;
  amount?: number;
  paymentReference?: string;
  invoiceNumber?: string;
  invoiceUrl?: string;
  invoicePdfUrl?: string;
};

function invalid(
  message: string,
  paymentReference?: string,
): SponsorCheckoutResult {
  return { status: "invalid", message, paymentReference };
}

function invoiceResult(invoice: StripeInvoiceSummary | undefined) {
  return {
    invoiceNumber: invoice?.number,
    invoiceUrl: invoice?.hostedUrl,
    invoicePdfUrl: invoice?.pdfUrl,
  };
}

async function createSponsorCreditNote({
  bidId,
  amount,
  invoiceId,
  refundId,
}: {
  bidId: string;
  amount: number;
  invoiceId: string;
  refundId?: string;
}) {
  return stripe.creditNotes.create(
    {
      invoice: invoiceId,
      amount,
      email_type: "credit_note",
      memo: "Automatische Erstattung: Sponsorplatz war bei Zahlungsbestätigung nicht mehr verfügbar.",
      metadata: {
        checkoutType: "sponsor",
        sponsorBidId: bidId,
      },
      reason: "order_change",
      ...(refundId
        ? {
            refunds: [{ refund: refundId, amount_refunded: amount }],
          }
        : { refund_amount: amount }),
    },
    { idempotencyKey: `sponsor-credit-${bidId}` },
  );
}

async function refundUnactivatedSponsorBid({
  bidId,
  amount,
  paymentIntentId,
  invoice,
  existingRefundId,
  existingCreditNoteId,
}: {
  bidId: string;
  amount: number;
  paymentIntentId?: string;
  invoice?: StripeInvoiceSummary;
  existingRefundId?: string | null;
  existingCreditNoteId?: string | null;
}) {
  let refundId = existingRefundId ?? undefined;
  let creditNoteId = existingCreditNoteId ?? undefined;

  if (!creditNoteId && invoice) {
    try {
      const creditNote = await createSponsorCreditNote({
        bidId,
        amount,
        invoiceId: invoice.id,
        refundId,
      });
      creditNoteId = creditNote.id;
      refundId ??= stripeObjectId(
        creditNote.refunds.find((entry) => entry.type === "refund")?.refund,
      );
    } catch (creditNoteError) {
      console.error("Sponsor credit note creation failed:", creditNoteError);
    }
  }

  if (!refundId) {
    if (!paymentIntentId) {
      throw new Error(
        "The unavailable sponsor payment could not be refunded automatically.",
      );
    }

    const refund = await stripe.refunds.create(
      {
        payment_intent: paymentIntentId,
        metadata: {
          checkoutType: "sponsor",
          sponsorBidId: bidId,
          reason: "placement_unavailable",
        },
      },
      { idempotencyKey: `sponsor-refund-${bidId}` },
    );
    refundId = refund.id;

    if (!creditNoteId && invoice) {
      try {
        const creditNote = await createSponsorCreditNote({
          bidId,
          amount,
          invoiceId: invoice.id,
          refundId,
        });
        creditNoteId = creditNote.id;
      } catch (creditNoteError) {
        console.error(
          "Sponsor refund credit note linking failed:",
          creditNoteError,
        );
      }
    }
  }

  await db.sponsorBid.update({
    where: { id: bidId },
    data: {
      status: "REFUNDED",
      stripeRefundId: refundId,
      stripeCreditNoteId: creditNoteId,
      refundedAt: new Date(),
    },
  });
}

export async function finalizeSponsorCheckout(
  session: Stripe.Checkout.Session,
): Promise<SponsorCheckoutResult> {
  const bidId = session.metadata?.sponsorBidId;

  if (session.metadata?.checkoutType !== "sponsor" || !bidId) {
    return invalid("This is not a sponsor checkout session.", session.id);
  }

  const bid = await db.sponsorBid.findFirst({
    where: { id: bidId, stripeSessionId: session.id },
    include: { slot: true },
  });

  if (!bid || session.client_reference_id !== `sponsor_${bid.id}`) {
    return invalid("No matching sponsor bid was found.", session.id);
  }

  if (session.currency !== "eur" || session.amount_total !== bid.amount) {
    return invalid(
      "The paid amount does not match this sponsor bid.",
      session.id,
    );
  }

  if (session.payment_status !== "paid") {
    if (session.status === "expired") {
      await db.sponsorBid.updateMany({
        where: { id: bid.id, status: "PENDING" },
        data: { status: "CANCELLED" },
      });
      return {
        status: "cancelled",
        message: "This checkout expired before payment was completed.",
        advertiserName: bid.advertiserName,
        slotName: bid.slot.name,
        amount: bid.amount,
        paymentReference: session.id,
      };
    }

    return {
      status: "pending",
      message: "Stripe is still confirming this payment.",
      advertiserName: bid.advertiserName,
      slotName: bid.slot.name,
      amount: bid.amount,
      paymentReference: session.id,
    };
  }

  const invoice = await getStripeInvoiceSummary(session.invoice);
  const paymentIntentId = stripeObjectId(session.payment_intent);
  const paidAt = bid.paidAt ?? new Date();

  await db.sponsorBid.update({
    where: { id: bid.id },
    data: {
      paidAt,
      stripePaymentIntentId: paymentIntentId,
      stripeCustomerId: stripeObjectId(session.customer),
      stripeInvoiceId: invoice?.id,
      invoiceNumber: invoice?.number,
      invoiceUrl: invoice?.hostedUrl,
      invoicePdfUrl: invoice?.pdfUrl,
    },
  });

  if (bid.status === "REFUNDED") {
    await refundUnactivatedSponsorBid({
      bidId: bid.id,
      amount: bid.amount,
      paymentIntentId,
      invoice,
      existingRefundId: bid.stripeRefundId,
      existingCreditNoteId: bid.stripeCreditNoteId,
    });
    return {
      status: "refunded",
      message:
        "Payment succeeded, but the placement was no longer available. Stripe refunded the payment.",
      advertiserName: bid.advertiserName,
      slotName: bid.slot.name,
      amount: bid.amount,
      paymentReference: session.id,
      ...invoiceResult(invoice),
    };
  }

  if (bid.status === "OUTBID" && !bid.activatedAt) {
    await refundUnactivatedSponsorBid({
      bidId: bid.id,
      amount: bid.amount,
      paymentIntentId,
      invoice,
      existingRefundId: bid.stripeRefundId,
      existingCreditNoteId: bid.stripeCreditNoteId,
    });
    return {
      status: "refunded",
      message:
        "Payment succeeded, but the placement was no longer available. Stripe refunded the payment.",
      advertiserName: bid.advertiserName,
      slotName: bid.slot.name,
      amount: bid.amount,
      paymentReference: session.id,
      ...invoiceResult(invoice),
    };
  }

  if (["OUTBID", "REMOVED"].includes(bid.status)) {
    return {
      status: "outbid",
      message:
        bid.status === "OUTBID"
          ? "This sponsor was live and has since been outbid."
          : "This sponsor placement is no longer active.",
      advertiserName: bid.advertiserName,
      slotName: bid.slot.name,
      amount: bid.amount,
      paymentReference: session.id,
      ...invoiceResult(invoice),
    };
  }

  const result = await db.$transaction(async (tx) => {
    const promoted = await tx.sponsorSlot.updateMany({
      where: {
        id: bid.slotId,
        OR: [
          { currentBidId: null },
          { currentBid: { is: { amount: { lt: bid.amount } } } },
        ],
      },
      data: { currentBidId: bid.id },
    });

    if (promoted.count > 0) {
      await tx.sponsorBid.updateMany({
        where: {
          slotId: bid.slotId,
          id: { not: bid.id },
          status: "ACTIVE",
        },
        data: { status: "OUTBID" },
      });
      await tx.sponsorBid.update({
        where: { id: bid.id },
        data: {
          status: "ACTIVE",
          activatedAt: bid.activatedAt ?? paidAt,
        },
      });
      return "active" as const;
    }

    const slot = await tx.sponsorSlot.findUnique({
      where: { id: bid.slotId },
      select: { currentBidId: true },
    });
    const isAlreadyActive = slot?.currentBidId === bid.id;

    await tx.sponsorBid.update({
      where: { id: bid.id },
      data: {
        status: isAlreadyActive ? "ACTIVE" : "OUTBID",
        activatedAt: isAlreadyActive
          ? (bid.activatedAt ?? paidAt)
          : bid.activatedAt,
      },
    });

    return isAlreadyActive ? ("active" as const) : ("outbid" as const);
  });

  if (result === "outbid") {
    const refreshedBid = await db.sponsorBid.findUnique({
      where: { id: bid.id },
      select: {
        activatedAt: true,
        stripeRefundId: true,
        stripeCreditNoteId: true,
      },
    });

    if (!refreshedBid?.activatedAt) {
      await refundUnactivatedSponsorBid({
        bidId: bid.id,
        amount: bid.amount,
        paymentIntentId,
        invoice,
        existingRefundId: refreshedBid?.stripeRefundId,
        existingCreditNoteId: refreshedBid?.stripeCreditNoteId,
      });
      return {
        status: "refunded",
        message:
          "Payment succeeded, but a competing checkout claimed this placement first. Stripe refunded the payment.",
        advertiserName: bid.advertiserName,
        slotName: bid.slot.name,
        amount: bid.amount,
        paymentReference: session.id,
        ...invoiceResult(invoice),
      };
    }
  }

  return {
    status: result,
    message:
      result === "active"
        ? "Your logo is live. It stays here until somebody places a higher bid."
        : "This sponsor was live and has since been outbid.",
    advertiserName: bid.advertiserName,
    slotName: bid.slot.name,
    amount: bid.amount,
    paymentReference: session.id,
    ...invoiceResult(invoice),
  };
}

export async function validateSponsorCheckout(
  sessionId: string,
): Promise<SponsorCheckoutResult> {
  if (!sessionId.startsWith("cs_")) {
    return invalid("That is not a valid Stripe checkout reference.");
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["invoice"],
    });
    return await finalizeSponsorCheckout(session);
  } catch (error) {
    console.error("Sponsor checkout validation failed:", error);
    return invalid("We could not verify this sponsor payment with Stripe.");
  }
}
