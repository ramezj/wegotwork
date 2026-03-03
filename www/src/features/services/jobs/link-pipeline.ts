import { createServerFn } from "@tanstack/react-start";
import { getSession } from "../../auth/server-session";
import prisma from "@/lib/prisma";
import z from "zod";
import { moveApplicantsToPipelineFirstStage } from "./utils";

export const linkJobToPipelineFn = createServerFn()
  .inputValidator(
    z.object({
      jobId: z.string(),
      pipelineId: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const session = await getSession();
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

    const updatedJob = await prisma.job.update({
      where: { id: data.jobId },
      data: {
        pipelineId: data.pipelineId,
      },
    });

    // Move applicants to the first stage of the new pipeline
    await moveApplicantsToPipelineFirstStage(
      data.jobId,
      data.pipelineId,
      session.user.id,
    );

    return { success: true, job: updatedJob };
  });
