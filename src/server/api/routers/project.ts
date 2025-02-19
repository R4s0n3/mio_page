
import {
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";

export const projectRouter = createTRPCRouter({
  getLatest: publicProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.post.findMany({
    where:{
        type:"PROJECT",
        status: "PUBLIC"
    },
    orderBy: { createdAt: "desc" },
    select:{
      id: true,
      name: true,
      image: true,
      url: true,
    }
    });

    return post ?? null;
  }),
});
