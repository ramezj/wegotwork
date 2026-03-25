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
            },
          },
        },
      });
      return { success: true, jobs: organization?.jobs || [] };
    } catch (error) {
      throw new Error("Something Went Wrong");
    }
  });
