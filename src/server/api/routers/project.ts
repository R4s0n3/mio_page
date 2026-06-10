import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const projectRouter = createTRPCRouter({
  getFeatured: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.db.post.findMany({
      where: {
        type: "PROJECT",
        status: "FEATURED",
      },
      take: 8,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        image: true,
        url: true,
      },
    });
    return posts ?? [];
  }),
  getAllPublic: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.db.post.findMany({
      where: {
        type: "PROJECT",
        status: { in: ["PUBLIC", "FEATURED"] },
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        image: true,
        url: true,
        content: true,
      },
    });
    return posts ?? [];
  }),
});
