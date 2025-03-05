
import {
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";

export const projectRouter = createTRPCRouter({
  getLatest: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.db.post.findMany({
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

    return posts ?? [];
  }),
});
