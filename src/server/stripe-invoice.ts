import "server-only";

import type Stripe from "stripe";

import { stripe } from "@/server/stripe";

export const KLEINUNTERNEHMER_INVOICE_FOOTER =
  "Für diese Leistung gilt die Steuerbefreiung für Kleinunternehmer gemäß § 19 UStG. Es wird keine Umsatzsteuer ausgewiesen.";

export type StripeInvoiceSummary = {
  id: string;
  number?: string;
  hostedUrl?: string;
  pdfUrl?: string;
};

export function stripeObjectId(
  value: string | { id: string } | null | undefined,
) {
  if (!value) return undefined;
  return typeof value === "string" ? value : value.id;
}

export async function getStripeInvoiceSummary(
  value: string | Stripe.Invoice | null,
): Promise<StripeInvoiceSummary | undefined> {
  if (!value) return undefined;

  const invoice =
    typeof value === "string" ? await stripe.invoices.retrieve(value) : value;

  return {
    id: invoice.id,
    number: invoice.number ?? undefined,
    hostedUrl: invoice.hosted_invoice_url ?? undefined,
    pdfUrl: invoice.invoice_pdf ?? undefined,
  };
}
