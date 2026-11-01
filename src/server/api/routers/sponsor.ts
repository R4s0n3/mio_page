import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { isFixedSponsorBookingActive } from "@/utils/sponsor";

export const sponsorRouter = createTRPCRouter({
  getSlots: publicProcedure.query(async ({ ctx }) => {
    const now = new Date();
    const slots = await ctx.db.sponsorSlot.findMany({
      where: { enabled: true, placement: { not: null } },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      select: {
        id: true,
        placement: true,
        name: true,
        description: true,
        basePrice: true,
        minIncrement: true,
        pricingMode: true,
        durationDays: true,
        currentBid: {
          select: {
            id: true,
            advertiserName: true,
            websiteUrl: true,
            logoUrl: true,
            amount: true,
            status: true,
            expiresAt: true,
          },
        },
      },
    });

    return slots.map((slot) => {
      const bid = slot.currentBid;
      const visible =
        slot.pricingMode === "FIXED"
          ? isFixedSponsorBookingActive(bid, now)
          : Boolean(bid);

      return {
        id: slot.id,
        placement: slot.placement,
        name: slot.name,
        description: slot.description,
        basePrice: slot.basePrice,
        minIncrement: slot.minIncrement,
        pricingMode: slot.pricingMode,
        durationDays: slot.durationDays,
        currentBid:
          visible && bid
            ? {
                id: bid.id,
                advertiserName: bid.advertiserName,
                websiteUrl: bid.websiteUrl,
                logoUrl: bid.logoUrl,
                amount: bid.amount,
                expiresAt: bid.expiresAt,
              }
            : null,
      };
    });
  }),
});
