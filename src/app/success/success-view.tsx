"use client";

import type { CheckoutValidationResult } from "@/utils/checkout-validation";
import { cartUtils } from "@/utils/cart";
import Link from "next/link";
import { useEffect } from "react";

type SuccessViewProps = {
  validation: CheckoutValidationResult;
};

const copy = {
  paid: {
    icon: "✓",
    title: "Payment Verified",
    heading: "Thank you for your order!",
    body: "Stripe confirmed the payment and your order is now processing.",
  },
  pending: {
    icon: "...",
    title: "Payment Pending",
    heading: "We are still waiting for payment confirmation.",
    body: "Stripe has not marked this payment as paid yet. Please check again shortly.",
  },
  cancelled: {
    icon: "!",
    title: "Checkout Not Completed",
    heading: "This checkout session is no longer active.",
    body: "The session expired or was cancelled before payment completed.",
  },
  invalid: {
    icon: "!",
    title: "Payment Not Verified",
    heading: "We could not verify this payment.",
    body: "The payment reference did not match a valid paid order.",
  },
} satisfies Record<
  CheckoutValidationResult["status"],
  {
    icon: string;
    title: string;
    heading: string;
    body: string;
  }
>;

export default function SuccessView({ validation }: SuccessViewProps) {
  const content = copy[validation.status];

  useEffect(() => {
    if (validation.status === "paid") {
      cartUtils.clearCart();
      window.dispatchEvent(new Event("cartUpdated"));
    }
  }, [validation.status]);

  return (
    <main className="flex size-full items-center justify-center bg-primary-900">
      <section className="container px-4 py-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-6 text-6xl">{content.icon}</div>
          <h1 className="gradient-text mb-6 font-headline text-4xl lg:text-5xl">
            {content.title}
          </h1>

          <div className="mb-8 rounded-lg border border-secondary-800/20 bg-surface-100 p-6">
            <h2 className="mb-4 font-subhead text-2xl text-headings">
              {content.heading}
            </h2>
            <p className="mb-4 text-body">{content.body}</p>
            <p className="mb-4 text-sm text-body/70">{validation.message}</p>
            {validation.paymentReference && (
              <p className="text-sm text-body/60">
                Payment reference: {validation.paymentReference.slice(0, 8)}...
              </p>
            )}
          </div>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/#merch"
              className="rounded-lg bg-accent px-6 py-3 font-subhead text-primary-900 transition-colors duration-200 hover:bg-accent/80"
            >
              Continue Shopping
            </Link>
            <Link
              href="/"
              className="rounded-lg border border-secondary-800/20 bg-surface px-6 py-3 font-subhead text-headings transition-colors duration-200 hover:bg-surface-100"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
