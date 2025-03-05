
import {
    createTRPCRouter,
    publicProcedure,
  } from "@/server/api/trpc";
  
  export const productRouter = createTRPCRouter({
    getMerch: publicProcedure.query(async ({ ctx }) => {
      const products = await ctx.db.product.findMany({
        where:{
          deletedAt:undefined
        },
        include:{
          type:true
        }
      });
  
      return products ?? [];
    }),
  });
  