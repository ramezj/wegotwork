import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/features/auth/middleware";
import prisma from "@/lib/prisma";
import z from "zod";

export const getRecentApplicantsByOrgSlugFn = createServerFn()
  .middleware([authMiddleware])
  .inputValidator(z.object({ slug: z.string(), limit: z.number().int().min(1).max(50).optional() }))
  .handler(async ({ data, context }) => {
    const { session } = context;
    const limit = data.limit ?? 5;

    try {
      const applicants = await prisma.candidate.findMany({
        where: {
          job: {
            organization: {
              slug: data.slug,
              members: {
                some: {
                  userId: session.user.id,
                },
              },
            },
          },
        },
        select: {
          id: true,
          name: true,
          status: true,
          createdAt: true,
          job: {
            select: {
              title: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
      });

      return { success: true, applicants };
    } catch (error) {
      throw new Error("Something Went Wrong");
    }
  });
