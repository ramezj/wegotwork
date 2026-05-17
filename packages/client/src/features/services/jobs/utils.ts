import prisma from "@/lib/prisma";

export async function moveCandidatesToPipelineFirstStage(
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

  // Find candidates needing migration (none or wrong pipeline)
  const candidatesToUpdate = await prisma.candidate.findMany({
    where: {
      jobId,
      NOT: { currentStageId: { in: stageIds } },
    },
  });

  if (candidatesToUpdate.length === 0) return;

  // Update candidates in a transaction for safety
  await prisma.$transaction(async (tx) => {
    for (const candidate of candidatesToUpdate) {
      await tx.candidate.update({
        where: { id: candidate.id },
        data: { currentStageId: firstStageId },
      });

      await tx.activityLog.create({
        data: {
          action: "MOVED_STAGE",
          candidateId: candidate.id,
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
