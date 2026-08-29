import "server-only";

import { NextResponse, type NextRequest } from "next/server";

import { env } from "@/env";
import { validateCheckoutSession } from "@/server/checkout-validation";
import { validateSponsorCheckout } from "@/server/sponsor-checkout";
import { stripe } from "@/server/stripe";

export async function handleStripeWebhook(request: NextRequest) {
  if (!env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Stripe webhook is not configured." },
      { status: 503 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature." },
      { status: 400 },
    );
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      await request.text(),
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    console.error("Stripe webhook signature validation failed:", error);
    return NextResponse.json(
      { error: "Invalid webhook signature." },
      { status: 400 },
    );
  }

  try {
    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded" ||
      event.type === "checkout.session.expired"
    ) {
      const session = event.data.object;
      const checkoutType = session.metadata?.checkoutType;

      if (checkoutType === "shop") {
        const result = await validateCheckoutSession(session.id);
        if (result.status === "invalid") throw new Error(result.message);
      }

      if (checkoutType === "sponsor") {
        const result = await validateSponsorCheckout(session.id);
        if (result.status === "invalid") throw new Error(result.message);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(`Stripe webhook ${event.id} failed:`, error);
    return NextResponse.json(
      { error: "Stripe event processing failed." },
      { status: 500 },
    );
  }
}
