import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/features/auth/middleware";
import prisma from "@/lib/prisma";
import z from "zod";

export const getJobsBySlugFn = createServerFn()
  .middleware([authMiddleware])
  .inputValidator(z.object({ slug: z.string() }))
  .handler(async ({ data, context }) => {
    const { session } = context;
    try {
      const jobs = await prisma.job.findMany({
        where: {
          organization: {
            slug: data.slug,
            members: {
              some: {
                userId: session.user.id,
              },
            },
          },
        },
        include: {
          candidates: true,
          category: true,
          office: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return { success: true, jobs };
    } catch (error) {
      throw new Error("Something Went Wrong");
    }
  });
