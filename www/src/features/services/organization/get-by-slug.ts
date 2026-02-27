import { createServerFn } from "@tanstack/react-start";
import { getSession } from "@/features/auth/server-session";
import { getOrganizationBySlugSchema } from "@/types/organization/schemas";
import prisma from "@/lib/prisma";

export const getOrganizationBySlugFn = createServerFn()
  .inputValidator(getOrganizationBySlugSchema)
  .handler(async ({ data }) => {
    const session = await getSession();
    if (!session) {
      throw new Error("Unauthenticated");
    }
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
          jobs: {
            include: {
              applicants: true,
              category: true,
              questions: true,
            },
            orderBy: {
              createdAt: "desc",
            },
            ...(data.limit ? { take: data.limit } : {}),
          },
          categories: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });
      return { success: true, organization };
    } catch (error) {
      console.error("Error in getOrganizationBySlugFn:", error);
      throw error;
    }
  });
