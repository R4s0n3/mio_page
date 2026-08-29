import "server-only";

import type Stripe from "stripe";

import { db } from "@/server/db";
import { sendOrderConfirmationEmail } from "@/server/order-email";
import {
  getStripeInvoiceSummary,
  stripeObjectId,
} from "@/server/stripe-invoice";
import { stripe } from "@/server/stripe";
import type { CheckoutValidationResult } from "@/utils/checkout-validation";

const checkoutCurrency = "eur";

function invalidResult(
  message: string,
  context?: { orderId?: string; paymentReference?: string },
): CheckoutValidationResult {
  return {
    status: "invalid",
    message,
    ...context,
  };
}

function getStripeReceiptUrl(session: Stripe.Checkout.Session) {
  const paymentIntent = session.payment_intent;
  if (!paymentIntent || typeof paymentIntent === "string") return undefined;

  const latestCharge = paymentIntent.latest_charge;
  if (!latestCharge || typeof latestCharge === "string") return undefined;

  return latestCharge.receipt_url ?? undefined;
}

function getShippingData(
  session: Stripe.Checkout.Session,
  customerEmail: string,
) {
  const shipping = session.collected_information?.shipping_details;
  const address = shipping?.address;

  if (
    !shipping?.name ||
    !address?.line1 ||
    !address.postal_code ||
    !address.country
  ) {
    return undefined;
  }

  return {
    name: shipping.name,
    lastName: "",
    street: address.line1,
    number: "",
    optional: address.line2,
    zip: address.postal_code,
    city: address.city,
    state: address.state,
    country: address.country,
    phone: session.customer_details?.phone,
    email: customerEmail,
    cost: session.shipping_cost?.amount_total ?? 0,
  };
}

export async function validateCheckoutSession(
  sessionId: string,
): Promise<CheckoutValidationResult> {
  if (!sessionId.startsWith("cs_")) {
    return invalidResult(
      "This payment reference is not a Stripe checkout session.",
    );
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["invoice", "payment_intent.latest_charge"],
    });
    const orderId = session.metadata?.orderId;

    if (session.metadata?.checkoutType !== "shop" || !orderId) {
      return invalidResult("This is not a valid shop checkout session.", {
        paymentReference: session.id,
      });
    }

    const order = await db.order.findFirst({
      where: {
        id: orderId,
        shopId: session.id,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return invalidResult("No matching order was found for this payment.", {
        orderId,
        paymentReference: session.id,
      });
    }

    if (session.client_reference_id !== order.cartRef) {
      return invalidResult("This payment does not match the stored order.", {
        orderId: order.id,
        paymentReference: session.id,
      });
    }

    const expectedSubtotal = order.items.reduce(
      (total, item) => total + item.product.price * item.qty,
      0,
    );

    if (
      session.currency !== checkoutCurrency ||
      session.amount_subtotal !== expectedSubtotal
    ) {
      return invalidResult("The payment amount does not match the order.", {
        orderId: order.id,
        paymentReference: session.id,
      });
    }

    if (session.payment_status === "paid") {
      const customerEmail =
        session.customer_details?.email ??
        session.customer_email ??
        order.customerEmail;

      if (!customerEmail) {
        return invalidResult(
          "Stripe confirmed payment, but no customer email was available.",
          { orderId: order.id, paymentReference: session.id },
        );
      }

      const invoice = await getStripeInvoiceSummary(session.invoice);
      const shippingData = getShippingData(session, customerEmail);

      await db.order.update({
        where: { id: order.id },
        data: {
          status: "PROCESSING",
          customerEmail,
          paidAt: order.paidAt ?? new Date(),
          stripeCustomerId: stripeObjectId(session.customer),
          stripeInvoiceId: invoice?.id,
          invoiceNumber: invoice?.number,
          invoiceUrl: invoice?.hostedUrl,
          invoicePdfUrl: invoice?.pdfUrl,
          shipping: shippingData
            ? {
                upsert: {
                  create: shippingData,
                  update: shippingData,
                },
              }
            : undefined,
        },
      });

      let emailMessage: string;
      let emailSent = Boolean(order.confirmationEmailSentAt);

      if (emailSent) {
        emailMessage = "The order confirmation email was already sent.";
      } else {
        const emailClaimed = await db.order.updateMany({
          where: {
            id: order.id,
            confirmationEmailSentAt: null,
          },
          data: { confirmationEmailSentAt: new Date() },
        });

        if (emailClaimed.count === 0) {
          emailSent = true;
          emailMessage = "The order confirmation email is already processing.";
        } else {
          try {
            const result = await sendOrderConfirmationEmail({
              orderId: order.id,
              customerEmail,
              paymentReference: session.id,
              paidAmount: session.amount_total ?? expectedSubtotal,
              currency: session.currency ?? checkoutCurrency,
              invoiceNumber: invoice?.number,
              invoiceUrl: invoice?.hostedUrl,
              invoicePdfUrl: invoice?.pdfUrl,
              receiptUrl: getStripeReceiptUrl(session),
              items: order.items.map((item) => ({
                name: item.product.name,
                quantity: item.qty,
                unitAmount: item.product.price,
                size: item.size,
              })),
            });

            if (result.sent) {
              emailSent = true;
              emailMessage = "The order confirmation email was sent.";
            } else {
              emailMessage = `The order confirmation email was not sent: ${result.reason}.`;
              await db.order.update({
                where: { id: order.id },
                data: { confirmationEmailSentAt: null },
              });
              console.error(emailMessage);
            }
          } catch (emailError) {
            emailMessage = "The order confirmation email could not be sent.";
            await db.order.update({
              where: { id: order.id },
              data: { confirmationEmailSentAt: null },
            });
            console.error("Order confirmation email failed:", emailError);
          }
        }
      }

      return {
        status: "paid",
        orderId: order.id,
        paymentReference: session.id,
        customerEmail,
        emailSent,
        invoiceNumber: invoice?.number,
        invoiceUrl: invoice?.hostedUrl,
        invoicePdfUrl: invoice?.pdfUrl,
        message: `Payment was verified by Stripe and the order is processing. ${emailMessage}`,
      };
    }

    if (session.status === "expired") {
      await db.order.updateMany({
        where: { id: order.id, status: "PENDING" },
        data: { status: "CANCELLED" },
      });

      return {
        status: "cancelled",
        orderId: order.id,
        paymentReference: session.id,
        message: "This checkout session expired before payment completed.",
      };
    }

    return {
      status: "pending",
      orderId: order.id,
      paymentReference: session.id,
      message: "Stripe has not marked this payment as paid yet.",
    };
  } catch (error) {
    console.error("Checkout validation failed:", error);

    return invalidResult("This payment could not be verified with Stripe.");
  }
}
