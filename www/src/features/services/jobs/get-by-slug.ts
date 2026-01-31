import { createServerFn } from "@tanstack/react-start";
import { getSession } from "../../auth/server-session";
import prisma from "@/lib/prisma";
import z from "zod";

export const getJobsBySlugFn = createServerFn()
  .inputValidator(z.object({ slug: z.string() }))
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
            },
          },
        },
      });
      return { success: true, jobs: organization?.jobs || [] };
    } catch (error) {
      throw new Error("Something Went Wrong");
    }
  });
