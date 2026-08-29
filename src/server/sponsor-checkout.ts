import "server-only";

import type Stripe from "stripe";

import { db } from "@/server/db";
import { stripe } from "@/server/stripe";

export type SponsorCheckoutResult = {
  status: "active" | "outbid" | "pending" | "cancelled" | "invalid";
  message: string;
  advertiserName?: string;
  slotName?: string;
  amount?: number;
  paymentReference?: string;
};

function invalid(
  message: string,
  paymentReference?: string,
): SponsorCheckoutResult {
  return { status: "invalid", message, paymentReference };
}

function getPaymentIntentId(session: Stripe.Checkout.Session) {
  if (!session.payment_intent) return undefined;
  return typeof session.payment_intent === "string"
    ? session.payment_intent
    : session.payment_intent.id;
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

  if (["OUTBID", "REMOVED", "REFUNDED"].includes(bid.status)) {
    return {
      status: "outbid",
      message:
        bid.status === "OUTBID"
          ? "Payment succeeded, but a higher sponsor bid is already live."
          : "Payment succeeded, but this placement is no longer active.",
      advertiserName: bid.advertiserName,
      slotName: bid.slot.name,
      amount: bid.amount,
      paymentReference: session.id,
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

    const paidAt = bid.paidAt ?? new Date();
    const paymentIntentId = getPaymentIntentId(session);

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
          paidAt,
          stripePaymentIntentId: paymentIntentId,
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
        paidAt,
        stripePaymentIntentId: paymentIntentId,
      },
    });

    return isAlreadyActive ? ("active" as const) : ("outbid" as const);
  });

  return {
    status: result,
    message:
      result === "active"
        ? "Your logo is live. It stays here until somebody places a higher bid."
        : "Payment succeeded, but a higher sponsor bid is already live.",
    advertiserName: bid.advertiserName,
    slotName: bid.slot.name,
    amount: bid.amount,
    paymentReference: session.id,
  };
}

export async function validateSponsorCheckout(
  sessionId: string,
): Promise<SponsorCheckoutResult> {
  if (!sessionId.startsWith("cs_")) {
    return invalid("That is not a valid Stripe checkout reference.");
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return await finalizeSponsorCheckout(session);
  } catch (error) {
    console.error("Sponsor checkout validation failed:", error);
    return invalid("We could not verify this sponsor payment with Stripe.");
  }
}
