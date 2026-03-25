import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/features/auth/middleware";
import prisma from "@/lib/prisma";
import z from "zod";
import { jobSchema } from "@/types/job/job";
import { moveCandidatesToPipelineFirstStage } from "./utils";

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
      const { questions, officeId, ...jobData } = data.job;

      const pipeline = await prisma.pipeline.findFirst({
        where: {
          id: jobData.pipelineId,
          organizationId: authorizedJob.organizationId,
        },
      });

      if (!pipeline) {
        throw new Error("Pipeline not found");
      }

      const office = officeId
        ? await prisma.office.findFirst({
            where: {
              id: officeId,
              organizationId: authorizedJob.organizationId,
            },
          })
        : null;

      if (officeId && !office) {
        throw new Error("Office not found");
      }

      const shouldMoveCandidates = authorizedJob.pipelineId !== pipeline.id;

      const job = await prisma.job.update({
        where: {
          id: data.jobId,
        },
        data: {
          ...jobData,
          categoryId: data.job.categoryId || null,
          officeId: office?.id || null,
          pipelineId: pipeline.id,
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

      if (shouldMoveCandidates) {
        await moveCandidatesToPipelineFirstStage(
          data.jobId,
          pipeline.id,
          session.user.id,
        );
      }

      return { success: true, job };
    } catch (error) {
      console.error(error);
      throw new Error("Something Went Wrong");
    }
  });
