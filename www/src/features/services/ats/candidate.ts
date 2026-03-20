import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/features/auth/middleware";
import prisma from "@/lib/prisma";
import { z } from "zod";

export const moveCandidateStageFn = createServerFn()
  .inputValidator(
    z.object({
      candidateId: z.string(),
      newStageId: z.string(),
    }),
  )
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const { session } = context;
    if (!session?.user) throw new Error("Unauthorized");

    const candidate = await prisma.candidate.findUnique({
      where: { id: data.candidateId },
      include: { currentStage: true },
    });

    if (!candidate) throw new Error("Candidate not found");

    const newStage = await prisma.stage.findUnique({
      where: { id: data.newStageId },
    });

    if (!newStage) throw new Error("New stage not found");

    const updatedCandidate = await prisma.candidate.update({
      where: { id: data.candidateId },
      data: { currentStageId: data.newStageId },
      include: { currentStage: true },
    });

    await prisma.activityLog.create({
      data: {
        action: "MOVED_STAGE",
        actorId: session.user.id,
        candidateId: data.candidateId,
        metadata: {
          from: candidate.currentStage?.name || "Initial Stage",
          to: newStage.name,
        },
      },
    });

    return updatedCandidate;
  });

export const getCandidateHistoryFn = createServerFn()
  .inputValidator(z.object({ candidateId: z.string() }))
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const { session } = context;
    if (!session?.user) throw new Error("Unauthorized");

    return await prisma.candidate.findUnique({
      where: { id: data.candidateId },
      include: {
        activityLogs: {
          include: { actor: true },
          orderBy: { createdAt: "desc" },
        },
        communications: {
          orderBy: { createdAt: "desc" },
        },
        evaluations: {
          include: { stage: true, interviewer: true },
          orderBy: { createdAt: "desc" },
        },
        responses: {
          include: { question: true },
        },
      },
    });
  });
