"use client";

import { CloudArrowUpIcon, XMarkIcon } from "@heroicons/react/24/solid";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
} from "react";
import Link from "next/link";

import { type RouterOutputs } from "@/trpc/react";
import { formatSponsorPrice, sponsorTermDays } from "@/utils/sponsor";

type SponsorSlot = RouterOutputs["sponsor"]["getSlots"][number];

type SponsorCheckoutDialogProps = {
  slot: SponsorSlot;
  initialAmount: number;
  onClose: () => void;
};

function validLogo(file: File) {
  return (
    ["image/png", "image/gif", "image/svg+xml"].includes(file.type) &&
    file.size <= 2 * 1024 * 1024
  );
}

export default function SponsorCheckoutDialog({
  slot,
  initialAmount,
  onClose,
}: SponsorCheckoutDialogProps) {
  const isFixed = slot.pricingMode === "FIXED";
  const termDays = sponsorTermDays(slot.durationDays);
  const uploadRef = useRef<HTMLInputElement>(null);
  const [logo, setLogo] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [amount, setAmount] = useState(initialAmount);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSubmitting, onClose]);

  useEffect(() => {
    if (!logo) {
      setPreviewUrl(null);
      return;
    }

    const nextPreviewUrl = URL.createObjectURL(logo);
    setPreviewUrl(nextPreviewUrl);
    return () => URL.revokeObjectURL(nextPreviewUrl);
  }, [logo]);

  function pickLogo(file: File | undefined) {
    if (!file) return;
    if (!validLogo(file)) {
      setLogo(null);
      setError("Choose a .png, .gif, or .svg logo up to 2 MB.");
      return;
    }
    setError(null);
    setLogo(file);
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    pickLogo(event.currentTarget.files?.[0]);
  }

  function handleDrop(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    pickLogo(event.dataTransfer.files[0]);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!logo) {
      setError("Add your logo before continuing to checkout.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData(event.currentTarget);
      formData.set("slotId", slot.id);
      formData.set("expectedAmount", String(amount));
      formData.set("logo", logo);

      const response = await fetch("/api/sponsors/checkout", {
        method: "POST",
        body: formData,
      });
      const payload = (await response.json()) as {
        checkoutUrl?: string;
        error?: string;
        nextAmount?: number;
      };

      if (!response.ok || !payload.checkoutUrl) {
        if (payload.nextAmount) setAmount(payload.nextAmount);
        throw new Error(payload.error ?? "Could not start checkout.");
      }

      window.location.assign(payload.checkoutUrl);
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Could not start checkout.",
      );
      setIsSubmitting(false);
    }
  }

  return (
    <div
      aria-labelledby="sponsor-checkout-title"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-primary-900/85 p-4 backdrop-blur-sm"
      role="dialog"
    >
      <button
        aria-label="Close sponsor checkout"
        className="absolute inset-0 cursor-default"
        disabled={isSubmitting}
        onClick={onClose}
        type="button"
      />
      <form
        className="relative my-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-highlight-cyan/30 bg-surface shadow-2xl shadow-highlight-cyan/15"
        onSubmit={handleSubmit}
      >
        <div className="h-1 bg-gradient-to-r from-highlight-magenta via-highlight-cyan to-highlight-green" />
        <div className="flex items-start justify-between gap-5 border-b border-body/10 p-5 sm:p-7">
          <div>
            <p className="font-subhead text-xs uppercase tracking-[0.22em] text-highlight-cyan">
              Sponsor · {slot.name}
            </p>
            <h2
              className="mt-1 font-headline text-4xl text-headings sm:text-5xl"
              id="sponsor-checkout-title"
            >
              MAKE THE SPOT YOURS.
            </h2>
            {isFixed && (
              <p className="mt-2 max-w-md font-text text-sm normal-case tracking-normal text-body/70">
                {formatSponsorPrice(slot.basePrice)} once for {termDays} days.
                The spot stays yours until then and cannot be outbid.
              </p>
            )}
          </div>
          <button
            aria-label="Close"
            className="rounded-full border border-body/15 p-2 text-body/60 transition hover:border-highlight-magenta hover:text-highlight-magenta"
            disabled={isSubmitting}
            onClick={onClose}
            type="button"
          >
            <XMarkIcon className="size-5" />
          </button>
        </div>

        <div className="grid gap-6 p-5 sm:p-7 md:grid-cols-[0.85fr_1.15fr]">
          <div className="flex flex-col gap-3">
            <button
              className="flex min-h-60 flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-highlight-cyan/35 bg-primary-900/60 p-5 text-center transition hover:border-highlight-cyan hover:bg-primary-900"
              onClick={() => uploadRef.current?.click()}
              onDragOver={(event) => event.preventDefault()}
              onDrop={handleDrop}
              type="button"
            >
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  alt="Logo preview"
                  className="max-h-32 max-w-full object-contain"
                  src={previewUrl}
                />
              ) : (
                <>
                  <CloudArrowUpIcon className="size-10 text-highlight-cyan" />
                  <span className="font-subhead text-headings">
                    Drop your logo here
                  </span>
                  <span className="font-text text-xs text-body/45">
                    PNG, animated GIF, or safe SVG · 2 MB max
                  </span>
                </>
              )}
            </button>
            <input
              accept=".png,.gif,.svg,image/png,image/gif,image/svg+xml"
              className="hidden"
              onChange={handleFileChange}
              ref={uploadRef}
              type="file"
            />
            {logo && (
              <p className="truncate font-text text-xs text-body/50">
                {logo.name}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5 font-text text-sm text-body/70">
              Brand / company name
              <input
                className="rounded-lg border border-body/15 bg-primary-900/70 px-3 py-2.5 text-headings outline-none transition focus:border-highlight-cyan"
                maxLength={80}
                name="advertiserName"
                placeholder="Very Cool Company"
                required
              />
            </label>
            <label className="flex flex-col gap-1.5 font-text text-sm text-body/70">
              Website
              <input
                className="rounded-lg border border-body/15 bg-primary-900/70 px-3 py-2.5 text-headings outline-none transition focus:border-highlight-cyan"
                name="websiteUrl"
                placeholder="https://verycool.example"
                required
                type="url"
              />
            </label>
            <label className="flex flex-col gap-1.5 font-text text-sm text-body/70">
              Receipt &amp; goodie contact email
              <input
                autoComplete="email"
                className="rounded-lg border border-body/15 bg-primary-900/70 px-3 py-2.5 text-headings outline-none transition focus:border-highlight-cyan"
                name="advertiserEmail"
                placeholder="hello@verycool.example"
                required
                type="email"
              />
            </label>
            <div className="mt-1 rounded-xl border border-highlight-green/20 bg-highlight-green/5 p-3 font-text text-xs leading-relaxed text-body/60">
              {isFixed ? (
                <>
                  Once Stripe confirms payment, your logo stays on this spot for{" "}
                  {termDays} days. This is a one-time payment, not a
                  subscription, and nobody can outbid you during that term. When
                  it ends, the spot opens again. Uploads are checked before
                  checkout.
                </>
              ) : (
                <>
                  Once Stripe confirms payment, your logo replaces the current
                  sponsor. It stays live until somebody outbids you. Uploads are
                  checked before checkout.
                </>
              )}
              <span className="mt-2 block text-headings/75">
                ✦ Sponsor perk: You&apos;ll also get a little Mio mystery care
                package. We&apos;ll use this email to arrange delivery after
                checkout — no newsletter.
              </span>
            </div>
            <div className="space-y-2 rounded-xl border border-body/10 bg-primary-900/35 p-3 font-text text-xs leading-relaxed text-body/65">
              <label className="flex items-start gap-2.5">
                <input
                  className="mt-0.5 size-4 shrink-0 accent-highlight-cyan"
                  name="businessConfirmation"
                  required
                  type="checkbox"
                  value="true"
                />
                <span>
                  Ich buche als Unternehmer im Sinne von § 14 BGB, nicht als
                  Verbraucher.
                </span>
              </label>
              <label className="flex items-start gap-2.5">
                <input
                  className="mt-0.5 size-4 shrink-0 accent-highlight-cyan"
                  name="termsAccepted"
                  required
                  type="checkbox"
                  value="true"
                />
                <span>
                  Ich akzeptiere die{" "}
                  <Link
                    className="text-highlight-cyan underline underline-offset-2"
                    href="/terms-and-conditions"
                    target="_blank"
                  >
                    Sponsor-AGB
                  </Link>{" "}
                  und habe den{" "}
                  <Link
                    className="text-highlight-cyan underline underline-offset-2"
                    href="/privacy-policy"
                    target="_blank"
                  >
                    Datenschutz
                  </Link>{" "}
                  zur Kenntnis genommen.
                </span>
              </label>
              <label className="flex items-start gap-2.5">
                <input
                  className="mt-0.5 size-4 shrink-0 accent-highlight-cyan"
                  name={
                    isFixed ? "fixedTermConfirmation" : "outbidConfirmation"
                  }
                  required
                  type="checkbox"
                  value="true"
                />
                <span>
                  {isFixed ? (
                    <>
                      Mir ist klar: Der Platz wird einmalig für {termDays} Tage
                      zum Festpreis gebucht. Während der Laufzeit ist kein
                      Überbieten möglich. Allein der Ablauf der Laufzeit
                      begründet keinen Erstattungsanspruch.
                    </>
                  ) : (
                    <>
                      Mir ist klar: Es gibt keine Mindestlaufzeit und keine
                      Erstattung allein deshalb, weil der Platz später überboten
                      wird.
                    </>
                  )}
                </span>
              </label>
            </div>
            {error && (
              <p className="rounded-lg border border-highlight-magenta/30 bg-highlight-magenta/10 px-3 py-2 font-text text-sm text-highlight-magenta">
                {error}
              </p>
            )}
            <button
              className="mt-auto rounded-lg bg-highlight-cyan px-5 py-3.5 font-subhead text-lg uppercase text-primary-900 transition hover:bg-highlight-green disabled:cursor-wait disabled:opacity-60"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting
                ? "Preparing checkout…"
                : isFixed
                  ? `Book for ${formatSponsorPrice(amount)}`
                  : `Outbid for ${formatSponsorPrice(amount)}`}
            </button>
            <p className="text-center font-text text-[11px] text-body/35">
              Verbindliche Zahlung im nächsten Schritt über Stripe
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
