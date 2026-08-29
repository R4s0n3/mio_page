import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const sponsorRouter = createTRPCRouter({
  getSlots: publicProcedure.query(({ ctx }) => {
    return ctx.db.sponsorSlot.findMany({
      where: { enabled: true, placement: { not: null } },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      select: {
        id: true,
        placement: true,
        name: true,
        description: true,
        basePrice: true,
        minIncrement: true,
        currentBid: {
          select: {
            id: true,
            advertiserName: true,
            websiteUrl: true,
            logoUrl: true,
            amount: true,
          },
        },
      },
    });
  }),
});
