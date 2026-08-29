import { NextResponse, type NextRequest } from "next/server";

import { env } from "@/env";
import { finalizeSponsorCheckout } from "@/server/sponsor-checkout";
import { stripe } from "@/server/stripe";

export async function POST(request: NextRequest) {
  if (!env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Sponsor webhook is not configured." },
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

  try {
    const event = stripe.webhooks.constructEvent(
      await request.text(),
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );

    if (event.type === "checkout.session.completed") {
      await finalizeSponsorCheckout(event.data.object);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Sponsor webhook failed:", error);
    return NextResponse.json(
      { error: "Invalid webhook event." },
      { status: 400 },
    );
  }
}
