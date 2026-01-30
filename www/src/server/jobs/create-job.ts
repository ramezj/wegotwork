import { createServerFn } from "@tanstack/react-start";
import { getSession } from "../auth/server-session";
import prisma from "@/lib/prisma";
import z from "zod";
import { jobSchema } from "@/types/job";

export const createJobFn = createServerFn()
  .inputValidator(z.object({ slug: z.string(), job: jobSchema }))
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
      });
      if (!organization) {
        throw new Error("Organization not found");
      }
      const job = await prisma.job.create({
        data: {
          ...data.job,
          categoryId: data.job.categoryId || undefined,
          organizationId: organization.id,
        },
      });
      return { success: true, job };
    } catch (error) {
      throw new Error("Something Went Wrong");
    }
  });
