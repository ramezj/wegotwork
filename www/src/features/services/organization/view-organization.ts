import { createServerFn } from "@tanstack/react-start";
import { getOrganizationBySlugSchema } from "@/features/types/organization/schemas";
import prisma from "@/lib/prisma";

export const viewOrganizationBySlugFn = createServerFn()
  .inputValidator(getOrganizationBySlugSchema)
  .handler(async ({ data }) => {
    try {
      const organization = await prisma.organization.findFirst({
        where: {
          slug: data.slug,
        },
        include: {
          jobs: {
            where: {
              status: "PUBLISHED",
            },
            include: {
              category: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
          categories: {
            orderBy: {
              order: "asc",
            },
            include: {
              jobs: {
                where: {
                  status: "PUBLISHED",
                },
                orderBy: {
                  createdAt: "desc",
                },
              },
            },
          },
        },
      });
      return { success: true, organization };
    } catch (error) {
      throw new Error("Something Went Wrong");
    }
  });
