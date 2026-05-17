import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/features/auth/middleware";
import prisma from "@/lib/prisma";
import { z } from "zod";

export const createEvaluationFn = createServerFn()
  .inputValidator(
    z.object({
      candidateId: z.string(),
      stageId: z.string(),
      score: z.number().min(1).max(5),
      feedback: z.string().optional(),
    }),
  )
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const { session } = context;
    if (!session?.user) throw new Error("Unauthorized");

    const evaluation = await prisma.evaluation.create({
      data: {
        score: data.score,
        feedback: data.feedback,
        interviewerId: session.user.id,
        candidateId: data.candidateId,
        stageId: data.stageId,
      },
      include: {
        stage: true,
        interviewer: true,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "ADDED_EVALUATION",
        actorId: session.user.id,
        candidateId: data.candidateId,
        metadata: {
          stage: evaluation.stage.name,
          score: data.score,
        },
      },
    });

    return evaluation;
  });
