import { createServerFn } from "@tanstack/react-start";
import { getSession } from "../../auth/server-session";
import prisma from "@/lib/prisma";
import z from "zod";
import { jobSchema } from "@/types/job/job";
import { moveApplicantsToPipelineFirstStage } from "./utils";

export const editJobBySlugFn = createServerFn()
  .inputValidator(z.object({ jobId: z.string(), job: jobSchema }))
  .handler(async ({ data }) => {
    const session = await getSession();
    if (!session) {
      throw new Error("Unauthenticated");
    }

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

      // Check if pipeline has changed to trigger migration
      const pipelineChanged =
        data.job.pipelineId && data.job.pipelineId !== authorizedJob.pipelineId;

      const job = await prisma.job.update({
        where: {
          id: data.jobId,
        },
        data: {
          ...jobData,
          categoryId: data.job.categoryId || null,
          pipelineId: data.job.pipelineId || null,
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

      if (pipelineChanged && data.job.pipelineId) {
        await moveApplicantsToPipelineFirstStage(
          data.jobId,
          data.job.pipelineId,
          session.user.id,
        );
      }

      return { success: true, job };
    } catch (error) {
      console.error(error);
      throw new Error("Something Went Wrong");
    }
  });
