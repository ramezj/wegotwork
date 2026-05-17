import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/features/auth/middleware";
import prisma from "@/lib/prisma";
import z from "zod";

export const deleteJobFn = createServerFn()
  .middleware([authMiddleware])
  .inputValidator(z.object({ jobId: z.string() }))
  .handler(async ({ data, context }) => {
    const { session } = context;

    const existingJob = await prisma.job.findFirst({
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
      include: {
        _count: {
          select: {
            candidates: true,
          },
        },
      },
    });

    if (!existingJob) {
      throw new Error("Job not found");
    }

    await prisma.job.delete({
      where: {
        id: data.jobId,
      },
    });

    return {
      success: true,
      deletedCandidates: existingJob._count.candidates,
    };
  });
