import prisma from "@/lib/prisma";

export async function moveApplicantsToPipelineFirstStage(
  jobId: string,
  pipelineId: string,
  actorId: string,
) {
  const pipelineWithStages = await prisma.pipeline.findUnique({
    where: { id: pipelineId },
    include: { stages: { orderBy: { order: "asc" } } },
  });

  const firstStageId = pipelineWithStages?.stages[0]?.id;
  if (!firstStageId) return;

  const stageIds = pipelineWithStages.stages.map((s) => s.id);

  // Find applicants needing migration (none or wrong pipeline)
  const applicantsToUpdate = await prisma.applicant.findMany({
    where: {
      jobId,
      OR: [
        { currentStageId: null },
        { NOT: { currentStageId: { in: stageIds } } },
      ],
    },
  });

  if (applicantsToUpdate.length === 0) return;

  // Update applicants in a transaction for safety
  await prisma.$transaction(async (tx) => {
    for (const applicant of applicantsToUpdate) {
      await tx.applicant.update({
        where: { id: applicant.id },
        data: { currentStageId: firstStageId },
      });

      await tx.activityLog.create({
        data: {
          action: "MOVED_STAGE",
          applicantId: applicant.id,
          actorId,
          metadata: {
            from: "Unassigned / Previous Pipeline",
            to: pipelineWithStages.stages[0].name,
            reason: "Pipeline linked to job",
          },
        },
      });
    }
  });
}
