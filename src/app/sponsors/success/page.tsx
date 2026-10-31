import Link from "next/link";

import { validateSponsorCheckout } from "@/server/sponsor-checkout";
import { pageMetadata } from "@/utils/site-metadata";

export const metadata = pageMetadata({
  title: "Sponsor checkout",
  description: "Payment status for your Mio Mideal sponsor placement.",
  path: "/sponsors/success",
  index: false,
});

export const dynamic = "force-dynamic";

type SponsorSuccessPageProps = {
  searchParams: Promise<{ session_id?: string | string[] }>;
};

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-DE", {
    style: "currency",
    currency: "EUR",
  }).format(amount / 100);
}

export default async function SponsorSuccessPage({
  searchParams,
}: SponsorSuccessPageProps) {
  const params = await searchParams;
  const sessionId = Array.isArray(params.session_id)
    ? params.session_id[0]
    : params.session_id;
  const result = sessionId
    ? await validateSponsorCheckout(sessionId)
    : {
        status: "invalid" as const,
        message: "No checkout session was provided.",
      };
  const successful = result.status === "active";

  return (
    <main className="flex min-h-screen items-center justify-center bg-primary-900 px-4 py-28 text-headings">
      <section className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-highlight-cyan/30 bg-surface p-8 text-center shadow-2xl shadow-highlight-cyan/10 sm:p-12">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-highlight-magenta via-highlight-cyan to-highlight-green" />
        <p className="mb-3 font-subhead text-sm uppercase tracking-[0.25em] text-highlight-cyan">
          {successful ? "You own the spot" : "Sponsor checkout"}
        </p>
        <h1 className="font-headline text-5xl sm:text-6xl">
          {successful ? "LOOK AT YOU GO." : result.status.toUpperCase()}
        </h1>
        <p className="mx-auto mt-5 max-w-lg font-text text-body/80">
          {result.message}
        </p>
        {result.slotName && (
          <div className="mx-auto mt-8 grid max-w-md grid-cols-2 gap-3 rounded-xl bg-primary-900/70 p-4 text-left text-sm">
            <span className="text-body/50">Placement</span>
            <span className="text-right font-subhead">{result.slotName}</span>
            <span className="text-body/50">Paid</span>
            <span className="text-right font-subhead">
              {result.amount ? formatPrice(result.amount) : "—"}
            </span>
          </div>
        )}
        {result.invoiceUrl && (
          <a
            className="mt-5 inline-flex rounded-lg border border-highlight-cyan/35 px-5 py-2.5 font-subhead text-highlight-cyan transition hover:bg-highlight-cyan/10"
            href={result.invoiceUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            Rechnung{result.invoiceNumber ? ` ${result.invoiceNumber}` : ""}{" "}
            öffnen
          </a>
        )}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            className="rounded-lg bg-highlight-cyan px-6 py-3 font-subhead text-primary-900 transition hover:bg-highlight-green"
            href="/#sponsors"
          >
            View sponsor wall
          </Link>
          <Link
            className="rounded-lg border border-body/20 px-6 py-3 font-subhead transition hover:border-highlight-magenta hover:text-highlight-magenta"
            href="/"
          >
            Back home
          </Link>
        </div>
      </section>
    </main>
  );
}
