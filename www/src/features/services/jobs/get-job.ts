import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/features/auth/middleware";
import prisma from "@/lib/prisma";
import z from "zod";

export const getJobByIdFn = createServerFn()
  .middleware([authMiddleware])
  .inputValidator(z.object({ jobId: z.string() }))
  .handler(async ({ data, context }) => {
    const { session } = context;
    try {
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
        include: {
          organization: true,
          category: true,
          office: true,
          questions: { orderBy: { order: "asc" } },
          pipeline: {
            include: {
              stages: { orderBy: { order: "asc" } },
            },
          },
          candidates: {
            select: {
              id: true,
              jobId: true,
              name: true,
              email: true,
              status: true,
              createdAt: true,
              updatedAt: true,
              resumeKey: true,
              currentStageId: true,
              responses: {
                select: {
                  id: true,
                  candidateId: true,
                  questionId: true,
                  answer: true,
                  createdAt: true,
                  updatedAt: true,
                },
              },
            },
          },
          _count: {
            select: {
              candidates: true,
            },
          },
        },
      });
      return { success: true, job };
    } catch (error) {
      console.error(error);
      throw new Error("Something Went Wrongaaa");
    }
  });
