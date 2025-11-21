import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const contactRouter = createTRPCRouter({
  getCreators: publicProcedure.query(async ({ ctx }) => {
    const contacts = await ctx.db.contactLinks.findMany({
      where: {
        OR: [
          { user: { email: "pascal@miomideal.com", role: "ADMIO" } },
          { user: { email: "heinachim@gmx.de", role: "ADMIO" } },
        ],
        user: { deletedAt: null },
      },
      include: {
        user: {
          select: {
            sig: true,
            name: true,
            title: true,
          },
        },
      },
    });
    return contacts ?? [];
  }),
});
