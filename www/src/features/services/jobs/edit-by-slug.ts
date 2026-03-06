import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/features/auth/middleware";
import prisma from "@/lib/prisma";
import z from "zod";
import { jobSchema } from "@/types/job/job";

export const editJobBySlugFn = createServerFn()
  .middleware([authMiddleware])
  .inputValidator(z.object({ jobId: z.string(), job: jobSchema }))
  .handler(async ({ data, context }) => {
    const { session } = context;

    // Security Check: Verify user is a member of the organization that owns this job
    const authorizedJob = await prisma.job.findFirst({
      where: {
        id: data.jobId,
        organization: {
          members: {
            some: {
              userId: session.user.id,
            },
          },
        },
      },
    });

    if (!authorizedJob) {
      throw new Error("You are not authorized to edit this job");
    }

    try {
      const { questions, ...jobData } = data.job;

      const job = await prisma.job.update({
        where: {
          id: data.jobId,
        },
        data: {
          ...jobData,
          categoryId: data.job.categoryId || null,
          questions: {
            deleteMany: {},
            create: (questions || []).map((q) => ({
              type: q.type,
              label: q.label,
              placeholder: q.placeholder,
              required: q.required,
              options: q.options,
              order: q.order,
            })),
          },
        },
      });

      return { success: true, job };
    } catch (error) {
      console.error(error);
      throw new Error("Something Went Wrong");
    }
  });
