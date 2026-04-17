import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/features/auth/middleware";
import { getOrganizationBySlugSchema } from "@/types/organization/schemas";
import prisma from "@/lib/prisma";

export const getOrganizationBySlugFn = createServerFn()
  .middleware([authMiddleware])
  .inputValidator(getOrganizationBySlugSchema)
  .handler(async ({ data, context }) => {
    const { session } = context;
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
        include: {
          members: true,
          categories: true,
          plan: true,
        },
      });
      return { success: true, organization };
    } catch (error) {
      console.error("Error in getOrganizationBySlugFn:", error);
      throw error;
    }
  });
