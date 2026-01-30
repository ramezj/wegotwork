import { createServerFn } from "@tanstack/react-start";
import { getSession } from "../auth/server-session";
import prisma from "@/lib/prisma";
import z from "zod";
import { jobSchema } from "@/types/job";

export const editJobBySlugFn = createServerFn()
  .inputValidator(z.object({ jobId: z.string(), job: jobSchema }))
  .handler(async ({ data }) => {
    const session = await getSession();
    if (!session) {
      throw new Error("Unauthenticated");
    }
    try {
      const job = await prisma.job.update({
        where: {
          id: data.jobId,
        },
        data: {
          ...data.job,
          categoryId: data.job.categoryId || undefined,
        },
      });
      return { success: true, job };
    } catch (error) {
      throw new Error("Something Went Wrong");
    }
  });
