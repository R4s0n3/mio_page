import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const productRouter = createTRPCRouter({
  getMerch: publicProcedure.query(async ({ ctx }) => {
    const products = await ctx.db.product.findMany({
      where: { deletedAt: null },
      include: {
        type: true,
      },
    });
    return products ?? [];
  }),
  getView: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      const product = ctx.db.product.findFirst({
        where: {
          id: input.id,
          deletedAt: null,
        },
        include: {
          detailImages: true,
          type: true,
        },
      });

      return product ?? null;
    }),
});
