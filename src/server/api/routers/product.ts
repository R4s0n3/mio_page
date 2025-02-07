
import {
    createTRPCRouter,
    publicProcedure,
  } from "@/server/api/trpc";
  
  export const productRouter = createTRPCRouter({
    getMerch: publicProcedure.query(async ({ ctx }) => {
      const product = await ctx.db.product.findMany({});
  
      return product ?? null;
    }),
  });
  