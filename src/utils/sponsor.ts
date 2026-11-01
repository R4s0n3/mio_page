export const DEFAULT_SPONSOR_TERM_DAYS = 30;
export const SPONSOR_TERMS_VERSION = "2026-11-01";

export function formatSponsorPrice(amount: number) {
  return new Intl.NumberFormat("en-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  }).format(amount / 100);
}

export function formatSponsorDate(value: Date | string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Europe/Berlin",
  }).format(new Date(value));
}

export function sponsorTermDays(durationDays: number | null | undefined) {
  return durationDays && durationDays > 0
    ? durationDays
    : DEFAULT_SPONSOR_TERM_DAYS;
}

export function fixedTermExpiresAt(from: Date, durationDays: number) {
  return new Date(from.getTime() + durationDays * 24 * 60 * 60 * 1000);
}

export function isFixedSponsorBookingActive(
  bid:
    | {
        status?: string;
        expiresAt: Date | string | null;
      }
    | null
    | undefined,
  now = new Date(),
) {
  if (!bid?.expiresAt) return false;
  if (bid.status && bid.status !== "ACTIVE") return false;
  return new Date(bid.expiresAt).getTime() > now.getTime();
}

export function fixedSlotOfferLabel(
  amountCents: number,
  durationDays: number | null | undefined,
) {
  const price = formatSponsorPrice(amountCents);
  const days = sponsorTermDays(durationDays);
  if (days === 30) return `Book ${price} / month`;
  return `Book ${price} / ${days} days`;
}

export function fixedSlotBookedLabel(expiresAt: Date | string) {
  return `Booked until ${formatSponsorDate(expiresAt)}`;
}
