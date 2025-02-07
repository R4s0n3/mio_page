import {
    createTRPCRouter,
    publicProcedure,
  } from "@/server/api/trpc";
  
  export const contactRouter = createTRPCRouter({
    getCreators: publicProcedure.query(async ({ ctx }) => {
      const contacts = await ctx.db.contactLinks.findMany({
        where:{
          user:{
            email: {
              in: ["pascal@miomideal.com", "achim@miomideal.com"],
            }
          }
        },
        include:{
          user:{
             select:{
              sig:true,
              name:true,
              title:true,
             }
          }
        }
      });
      return contacts ?? null;
    }),
  });
  