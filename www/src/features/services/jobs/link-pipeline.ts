import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/features/auth/middleware";
import prisma from "@/lib/prisma";
import z from "zod";
import { moveCandidatesToPipelineFirstStage } from "./utils";

export const linkJobToPipelineFn = createServerFn()
  .inputValidator(
    z.object({
      jobId: z.string(),
      pipelineId: z.string(),
    }),
  )
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const { session } = context;
    if (!session?.user) throw new Error("Unauthorized");

    // Security check: ensure job belongs to an organization where user is a member
    const job = await prisma.job.findFirst({
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

    if (!job) throw new Error("Job not found or unauthorized");

    const pipeline = await prisma.pipeline.findFirst({
      where: {
        id: data.pipelineId,
        organizationId: job.organizationId,
      },
    });

    if (!pipeline) {
      throw new Error("Pipeline not found");
    }

    const updatedJob = await prisma.job.update({
      where: { id: data.jobId },
      data: {
        pipelineId: pipeline.id,
      },
    });

    // Move candidates to the first stage of the new pipeline
    await moveCandidatesToPipelineFirstStage(
      data.jobId,
      pipeline.id,
      session.user.id,
    );

    return { success: true, job: updatedJob };
  });
