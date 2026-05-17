import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/features/auth/middleware";
import prisma from "@/lib/prisma";
import z from "zod";
import { isRedirect, redirect } from "@tanstack/react-router";

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
        select: {
          jobs: {
            orderBy: { createdAt: "desc" },
            select: {
              id: true,
              title: true,
              type: true,
              status: true,
              locationMode: true,
              createdAt: true,
              category: true,
              office: true,
              _count: { select: { candidates: true } },
            },
          },
        },
      });
      if (!organization) {
        console.error("Not a member or org doesnt exist");
        throw redirect({ to: "/dashboard" });
      }
      console.log("organization found");
      return { success: true, jobs: organization.jobs };
    } catch (error) {
      console.error(error);
      if (isRedirect(error)) {
        throw error;
      }
      return {
        success: false,
        jobs: [],
        error: "Couldn't load jobs, please try again later.",
      };
    }
  });
