"use client";

import { ArrowTopRightOnSquareIcon, PlusIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

import { api, type RouterOutputs } from "@/trpc/react";
import { formatSponsorPrice } from "@/utils/sponsor";
import SponsorCheckoutDialog from "./sponsor-checkout-dialog";

export const sponsorPlacements = [
  "HERO_BILLBOARD",
  "PROJECTS_CORNER",
  "PROJECTS_STRIP",
  "ABOUT_SIDECAR",
  "MERCH_BANNER",
  "FOOTER_STAMP",
] as const;

export type SponsorPlacement = (typeof sponsorPlacements)[number];
type SponsorSlot = RouterOutputs["sponsor"]["getSlots"][number];
type SponsorVariant =
  | "billboard"
  | "corner"
  | "strip"
  | "sidecar"
  | "banner"
  | "stamp";

type SponsorSpotProps = {
  placement: SponsorPlacement;
  variant: SponsorVariant;
};

const variantStyles: Record<
  SponsorVariant,
  { shell: string; logo: string; accent: string }
> = {
  billboard: {
    shell: "mx-auto h-44 w-full max-w-4xl rounded-2xl sm:h-48",
    logo: "max-h-28 max-w-[72%] sm:max-h-32",
    accent: "bg-highlight-magenta",
  },
  corner: {
    shell: "h-40 w-full rounded-xl sm:h-44",
    logo: "max-h-24 max-w-[72%]",
    accent: "bg-highlight-cyan",
  },
  strip: {
    shell: "mx-auto h-24 w-full max-w-5xl rounded-xl sm:h-28",
    logo: "max-h-14 max-w-[62%] sm:max-h-16",
    accent: "bg-highlight-green",
  },
  sidecar: {
    shell: "h-44 w-full rounded-xl sm:h-48",
    logo: "max-h-28 max-w-[74%]",
    accent: "bg-highlight-magenta",
  },
  banner: {
    shell: "mx-auto h-28 w-full max-w-4xl rounded-2xl sm:h-32",
    logo: "max-h-20 max-w-[68%] sm:max-h-24",
    accent: "bg-highlight-cyan",
  },
  stamp: {
    shell: "h-32 w-full rounded-lg sm:h-36",
    logo: "max-h-20 max-w-[68%]",
    accent: "bg-highlight-green",
  },
};

function nextBidAmount(slot: SponsorSlot) {
  return slot.currentBid
    ? slot.currentBid.amount + slot.minIncrement
    : slot.basePrice;
}

export default function SponsorSpot({ placement, variant }: SponsorSpotProps) {
  const { data: slots, isLoading } = api.sponsor.getSlots.useQuery();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const slot = slots?.find((candidate) => candidate.placement === placement);
  const logoUrl = slot?.currentBid?.logoUrl ?? "";
  const styles = variantStyles[variant];

  useEffect(() => {
    setLogoFailed(false);
  }, [logoUrl]);

  if (isLoading) {
    return (
      <div
        aria-hidden="true"
        className={`animate-pulse border border-body/[0.06] bg-white/[0.015] ${styles.shell}`}
      />
    );
  }
  if (!slot) return null;

  const nextAmount = nextBidAmount(slot);

  return (
    <>
      <article
        className={`group relative overflow-hidden border bg-white/[0.015] transition duration-300 hover:border-body/20 hover:bg-white/[0.025] ${slot.currentBid ? "border-body/[0.08]" : "border-dashed border-body/[0.12]"} ${styles.shell}`}
      >
        <div className="absolute left-3 top-2.5 z-10 flex items-center gap-1.5 opacity-40 transition group-hover:opacity-70">
          <span className={`size-1 rounded-full ${styles.accent}`} />
          <span className="font-text text-[8px] uppercase tracking-[0.2em] text-body/50">
            Ad
          </span>
        </div>

        {slot.currentBid ? (
          <a
            aria-label={`Visit ${slot.currentBid.advertiserName}`}
            className="absolute inset-0 flex items-center justify-center px-8 py-7"
            href={slot.currentBid.websiteUrl}
            rel="noopener noreferrer sponsored"
            target="_blank"
          >
            {/* The upload endpoint restricts this source to validated PNG/GIF/SVG logos. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={`${slot.currentBid.advertiserName} logo`}
              className={`object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.55)] transition duration-300 group-hover:scale-[1.04] ${styles.logo}`}
              src={logoFailed ? "/SVG/logo.svg" : slot.currentBid.logoUrl}
              onError={() => setLogoFailed(true)}
            />
            <ArrowTopRightOnSquareIcon className="absolute right-3 top-3 size-3.5 text-body/0 transition group-hover:text-body/35" />
          </a>
        ) : (
          <button
            aria-label={`Claim ${slot.name} sponsor placement`}
            className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-body/25 transition hover:text-body/45"
            onClick={() => setCheckoutOpen(true)}
            type="button"
          >
            <PlusIcon className="size-5" />
            <span className="font-text text-[9px] uppercase tracking-[0.16em]">
              Your logo
            </span>
          </button>
        )}

        <button
          className="absolute bottom-2 right-2 z-20 rounded-full border border-body/10 bg-primary-900/80 px-2.5 py-1.5 font-text text-[9px] uppercase tracking-wide text-body/55 opacity-70 backdrop-blur transition hover:border-body/25 hover:text-headings focus:opacity-100 sm:translate-y-0.5 sm:opacity-35 sm:group-hover:translate-y-0 sm:group-hover:opacity-100"
          onClick={() => setCheckoutOpen(true)}
          type="button"
        >
          {slot.currentBid ? "Outbid" : "Claim"}{" "}
          {formatSponsorPrice(nextAmount)}
        </button>
      </article>

      {checkoutOpen && (
        <SponsorCheckoutDialog
          initialAmount={nextAmount}
          onClose={() => setCheckoutOpen(false)}
          slot={slot}
        />
      )}
    </>
  );
}
