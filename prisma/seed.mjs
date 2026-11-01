import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const slots = [
  {
    id: "sponsor_home_hero",
    placement: "HERO_BILLBOARD",
    name: "Above the fold",
    description: "The loudest logo spot on the page.",
    basePrice: 10000,
    minIncrement: 5000,
    pricingMode: "AUCTION",
    durationDays: null,
    enabled: true,
    sortOrder: 10,
  },
  {
    id: "sponsor_home_signal",
    placement: "PROJECTS_CORNER",
    name: "Signal boost",
    description: "A crisp spot for a brand worth noticing.",
    basePrice: 3000,
    minIncrement: 1500,
    pricingMode: "FIXED",
    durationDays: 30,
    enabled: true,
    sortOrder: 20,
  },
  {
    id: "sponsor_home_indie",
    placement: "ABOUT_SIDECAR",
    name: "About-side supporter",
    description: "Small spot, big supporter energy.",
    basePrice: 2000,
    minIncrement: 1000,
    pricingMode: "FIXED",
    durationDays: 30,
    enabled: true,
    sortOrder: 30,
  },
  {
    id: "sponsor_projects_strip",
    placement: "PROJECTS_STRIP",
    name: "Between the work",
    description: "A wide interruption between project discoveries.",
    basePrice: 4000,
    minIncrement: 2000,
    pricingMode: "FIXED",
    durationDays: 30,
    enabled: true,
    sortOrder: 25,
  },
  {
    id: "sponsor_merch_banner",
    placement: "MERCH_BANNER",
    name: "Merch intermission",
    description: "A generous banner alongside the things we make.",
    basePrice: 5000,
    minIncrement: 2500,
    pricingMode: "FIXED",
    durationDays: 30,
    enabled: true,
    sortOrder: 40,
  },
  {
    id: "sponsor_footer_stamp",
    placement: "FOOTER_STAMP",
    name: "One last thing",
    description: "A small persistent wink before the footer.",
    basePrice: 1500,
    minIncrement: 750,
    pricingMode: "FIXED",
    durationDays: 30,
    enabled: true,
    sortOrder: 50,
  },
];

const bids = [
  {
    id: "seed_sponsor_main_active",
    slotId: "sponsor_home_hero",
    advertiserName: "Keyboard Cat Consulting",
    advertiserEmail: "sponsor@example.com",
    websiteUrl: "https://giphy.com/gifs/JIX9t2j0ZTN9S",
    logoUrl: "/assets/sponsors/giphy-cat-typing.gif",
    amount: 12500,
    status: "ACTIVE",
    paidAt: new Date("2026-08-26T12:00:00.000Z"),
  },
  {
    id: "seed_sponsor_indie_outbid",
    slotId: "sponsor_home_indie",
    advertiserName: "Previously Cool Ltd.",
    advertiserEmail: "previous@example.com",
    websiteUrl: "https://example.com/previous",
    logoUrl: "/assets/social-media/reddit.svg",
    amount: 2500,
    status: "OUTBID",
    paidAt: new Date("2026-08-24T12:00:00.000Z"),
  },
  {
    id: "seed_sponsor_indie_active",
    slotId: "sponsor_home_indie",
    advertiserName: "Tiny Internet Club",
    advertiserEmail: "tiny@example.com",
    websiteUrl: "https://example.com/tiny-internet-club",
    logoUrl: "/assets/social-media/discord.svg",
    amount: 4000,
    status: "ACTIVE",
    paidAt: new Date("2026-08-27T12:00:00.000Z"),
    activatedAt: new Date("2026-11-01T09:00:00.000Z"),
    expiresAt: new Date("2026-12-01T09:00:00.000Z"),
  },
  {
    id: "seed_sponsor_signal_pending",
    slotId: "sponsor_home_signal",
    advertiserName: "Checkout Window Closer GmbH",
    advertiserEmail: "pending@example.com",
    websiteUrl: "https://example.com/pending",
    logoUrl: "/assets/social-media/twitch.svg",
    amount: 3000,
    status: "PENDING",
    paidAt: null,
  },
  {
    id: "seed_sponsor_signal_cancelled",
    slotId: "sponsor_home_signal",
    advertiserName: "Changed My Mind Inc.",
    advertiserEmail: "cancelled@example.com",
    websiteUrl: "https://example.com/cancelled",
    logoUrl: "/assets/social-media/youtube.svg",
    amount: 3000,
    status: "CANCELLED",
    paidAt: null,
  },
  {
    id: "seed_sponsor_strip_active",
    slotId: "sponsor_projects_strip",
    advertiserName: "Bleppy Cat Unlimited",
    advertiserEmail: "wide@example.com",
    websiteUrl: "https://giphy.com/gifs/In0Lpu4FVivjISX9HT",
    logoUrl: "/assets/sponsors/giphy-cat-reaction.gif",
    amount: 6000,
    status: "ACTIVE",
    paidAt: new Date("2026-08-27T16:00:00.000Z"),
    activatedAt: new Date("2026-11-01T09:00:00.000Z"),
    expiresAt: new Date("2026-12-01T09:00:00.000Z"),
  },
  {
    id: "seed_sponsor_footer_active",
    slotId: "sponsor_footer_stamp",
    advertiserName: "Footer Enjoyers Club",
    advertiserEmail: "footer@example.com",
    websiteUrl: "https://example.com/footer-enjoyers",
    logoUrl: "/assets/social-media/instagram.svg",
    amount: 2250,
    status: "ACTIVE",
    paidAt: new Date("2026-08-28T09:00:00.000Z"),
    activatedAt: new Date("2026-11-01T09:00:00.000Z"),
    expiresAt: new Date("2026-12-01T09:00:00.000Z"),
  },
];

async function main() {
  await prisma.$transaction(async (tx) => {
    for (const slot of slots) {
      await tx.sponsorSlot.upsert({
        where: { id: slot.id },
        create: slot,
        update: slot,
      });
    }

    for (const bid of bids) {
      await tx.sponsorBid.upsert({
        where: { id: bid.id },
        create: bid,
        update: bid,
      });
    }

    await tx.sponsorBid.updateMany({
      where: {
        slotId: "sponsor_home_hero",
        id: { not: "seed_sponsor_main_active" },
        status: "ACTIVE",
      },
      data: { status: "OUTBID" },
    });
    await tx.sponsorBid.updateMany({
      where: {
        slotId: "sponsor_home_indie",
        id: { not: "seed_sponsor_indie_active" },
        status: "ACTIVE",
      },
      data: { status: "OUTBID" },
    });
    await tx.sponsorBid.updateMany({
      where: { slotId: "sponsor_home_signal", status: "ACTIVE" },
      data: { status: "OUTBID" },
    });
    await tx.sponsorBid.updateMany({
      where: {
        slotId: "sponsor_projects_strip",
        id: { not: "seed_sponsor_strip_active" },
        status: "ACTIVE",
      },
      data: { status: "OUTBID" },
    });
    await tx.sponsorBid.updateMany({
      where: {
        slotId: "sponsor_footer_stamp",
        id: { not: "seed_sponsor_footer_active" },
        status: "ACTIVE",
      },
      data: { status: "OUTBID" },
    });
    await tx.sponsorBid.updateMany({
      where: { slotId: "sponsor_merch_banner", status: "ACTIVE" },
      data: { status: "OUTBID" },
    });

    await tx.sponsorSlot.update({
      where: { id: "sponsor_home_hero" },
      data: { currentBidId: "seed_sponsor_main_active" },
    });
    await tx.sponsorSlot.update({
      where: { id: "sponsor_home_signal" },
      data: { currentBidId: null },
    });
    await tx.sponsorSlot.update({
      where: { id: "sponsor_home_indie" },
      data: { currentBidId: "seed_sponsor_indie_active" },
    });
    await tx.sponsorSlot.update({
      where: { id: "sponsor_projects_strip" },
      data: { currentBidId: "seed_sponsor_strip_active" },
    });
    await tx.sponsorSlot.update({
      where: { id: "sponsor_merch_banner" },
      data: { currentBidId: null },
    });
    await tx.sponsorSlot.update({
      where: { id: "sponsor_footer_stamp" },
      data: { currentBidId: "seed_sponsor_footer_active" },
    });
  });

  const [slotCount, bidCount] = await Promise.all([
    prisma.sponsorSlot.count(),
    prisma.sponsorBid.count({ where: { id: { startsWith: "seed_sponsor_" } } }),
  ]);

  console.log(
    `Sponsor seed complete: ${slotCount} spots, ${bidCount} test bids.`,
  );
  console.log(
    "Fixtures: four occupied spots, two empty spots, plus pending/outbid/cancelled history.",
  );
}

main()
  .catch((error) => {
    console.error("Sponsor seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
