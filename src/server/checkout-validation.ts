import "server-only";

import { db } from "@/server/db";
import { sendOrderConfirmationEmail } from "@/server/order-email";
import { stripe } from "@/server/stripe";
import type { CheckoutValidationResult } from "@/utils/checkout-validation";
import type Stripe from "stripe";

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
      expand: ["payment_intent.latest_charge"],
    });
    const orderId = session.metadata?.orderId;

    if (!orderId) {
      return invalidResult("This checkout session is missing order metadata.", {
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

      await db.order.update({
        where: { id: order.id },
        data: {
          status: "PROCESSING",
          customerEmail,
        },
      });

      let emailMessage: string | undefined;
      let emailSent = false;

      if (!customerEmail) {
        emailMessage =
          "No customer email was available from Stripe, so no confirmation email was sent.";
      } else if (order.confirmationEmailSentAt) {
        emailSent = true;
        emailMessage = "The order confirmation email was already sent.";
      } else {
        try {
          const result = await sendOrderConfirmationEmail({
            orderId: order.id,
            customerEmail,
            paymentReference: session.id,
            paidAmount: session.amount_total ?? expectedSubtotal,
            currency: session.currency ?? checkoutCurrency,
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

            await db.order.update({
              where: { id: order.id },
              data: { confirmationEmailSentAt: new Date() },
            });
          } else {
            emailMessage = `The order confirmation email was not sent: ${result.reason}.`;
            console.error(emailMessage);
          }
        } catch (emailError) {
          emailMessage = "The order confirmation email could not be sent.";
          console.error("Order confirmation email failed:", emailError);
        }
      }

      return {
        status: "paid",
        orderId: order.id,
        paymentReference: session.id,
        customerEmail,
        emailSent,
        message: emailMessage
          ? `Payment was verified by Stripe and the order is processing. ${emailMessage}`
          : "Payment was verified by Stripe and the order is processing.",
      };
    }

    if (session.status === "expired") {
      await db.order.update({
        where: { id: order.id },
        data: { status: "CANCELLED" },
      });

      return {
        status: "cancelled",
        orderId: order.id,
        paymentReference: session.id,
        message: "This checkout session expired before payment completed.",
      };
    }

    await db.order.update({
      where: { id: order.id },
      data: { status: "PENDING" },
    });

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
