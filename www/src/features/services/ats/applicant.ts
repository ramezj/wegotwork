import { createServerFn } from "@tanstack/react-start";
import { getSession } from "@/features/auth/server-session";
import prisma from "@/lib/prisma";
import { z } from "zod";

export const moveApplicantStageFn = createServerFn()
  .inputValidator(
    z.object({
      applicantId: z.string(),
      newStageId: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const session = await getSession();
    if (!session?.user) throw new Error("Unauthorized");

    const applicant = await prisma.applicant.findUnique({
      where: { id: data.applicantId },
      include: { currentStage: true },
    });

    if (!applicant) throw new Error("Applicant not found");

    const newStage = await prisma.stage.findUnique({
      where: { id: data.newStageId },
    });

    if (!newStage) throw new Error("New stage not found");

    const updatedApplicant = await prisma.applicant.update({
      where: { id: data.applicantId },
      data: { currentStageId: data.newStageId },
      include: { currentStage: true },
    });

    await prisma.activityLog.create({
      data: {
        action: "MOVED_STAGE",
        actorId: session.user.id,
        applicantId: data.applicantId,
        metadata: {
          from: applicant.currentStage?.name || "Initial Stage",
          to: newStage.name,
        },
      },
    });

    return updatedApplicant;
  });

export const getApplicantHistoryFn = createServerFn()
  .inputValidator(z.object({ applicantId: z.string() }))
  .handler(async ({ data }) => {
    const session = await getSession();
    if (!session?.user) throw new Error("Unauthorized");

    return await prisma.applicant.findUnique({
      where: { id: data.applicantId },
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
      },
    });
  });
