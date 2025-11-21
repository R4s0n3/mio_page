import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { notDeleted } from "@/server/util/softDelete";

export const orderRouter = createTRPCRouter({
  getLatest: publicProcedure.query(async ({ ctx }) => {
    const orders = await ctx.db.order.findMany({
      where: notDeleted,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        userId: true,
        status: true,
      },
    });

    return orders ?? [];
  }),
});
