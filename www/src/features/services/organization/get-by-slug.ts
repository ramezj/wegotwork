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
          jobs: {
            include: {
              candidates: true,
              category: true,
              office: true,
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
          offices: {
            orderBy: {
              createdAt: "desc",
            },
          },
          pipelines: {
            include: {
              stages: {
                orderBy: {
                  order: "asc",
                },
              },
              jobs: true,
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
