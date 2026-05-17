import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/features/auth/middleware";
import prisma from "@/lib/prisma";
import z from "zod";

export const getCategoriesByOrgSlugFn = createServerFn()
  .middleware([authMiddleware])
  .inputValidator(z.object({ slug: z.string() }))
  .handler(async ({ data, context }) => {
    const { session } = context;
    if (!session?.user) throw new Error("Unauthorized");

    try {
      const organization = await prisma.organization.findFirst({
        where: {
          slug: data.slug,
          members: {
            some: {
              userId: session.user.id,
            },
          },
        },
        select: { id: true }
      });

      if (!organization) {
         throw new Error("Organization not found or access denied");
      }

      const categories = await prisma.jobCategory.findMany({
        where: { organizationId: organization.id },
        orderBy: {
          createdAt: "desc",
        },
      });

      return { success: true, categories };
    } catch (error) {
      console.error("Error in getCategoriesByOrgSlugFn:", error);
      throw error;
    }
  });
