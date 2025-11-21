import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const projectRouter = createTRPCRouter({
  getLatest: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.db.post.findMany({
      where: {
        type: "PROJECT",
        status: "PUBLIC",
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
});

// Export a small helper to enable unit testing without tRPC wrappers
export async function fetchProjects(ctx: any) {
  const posts = await ctx.db.post.findMany({
    where: {
      type: "PROJECT",
      status: "PUBLIC",
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      image: true,
      url: true,
    },
  });

  return posts ?? [];
}
