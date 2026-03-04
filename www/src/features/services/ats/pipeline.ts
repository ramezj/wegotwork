import { createServerFn } from "@tanstack/react-start";
import { getSession } from "@/features/auth/server-session";
import prisma from "@/lib/prisma";
import { z } from "zod";

export const createPipelineFn = createServerFn()
  .inputValidator(
    z.object({
      name: z.string(),
      organizationId: z.string(),
      stages: z.array(z.string()).optional(),
    }),
  )
  .handler(async ({ data }) => {
    const session = await getSession();
    if (!session?.user) throw new Error("Unauthorized");

    const defaultStages = data.stages || [
      "Screening",
      "Phone Interview",
      "Technical Test",
      "Onsite Interview",
      "Offer",
    ];

    const pipeline = await prisma.pipeline.create({
      data: {
        name: data.name,
        organizationId: data.organizationId,
        stages: {
          create: defaultStages.map((name, index) => ({
            name,
            order: index,
          })),
        },
      },
      include: {
        stages: true,
      },
    });

    return pipeline;
  });

export const getPipelinesFn = createServerFn()
  .inputValidator(z.object({ organizationId: z.string() }))
  .handler(async ({ data }) => {
    const session = await getSession();
    if (!session?.user) throw new Error("Unauthorized");

    return await prisma.pipeline.findMany({
      where: { organizationId: data.organizationId },
      include: {
        stages: {
          orderBy: { order: "asc" },
        },
      },
    });
  });
export const updatePipelineFn = createServerFn()
  .inputValidator(
    z.object({
      id: z.string(),
      name: z.string().optional(),
      stages: z
        .array(
          z.object({
            id: z.string().optional(),
            name: z.string(),
            order: z.number(),
          }),
        )
        .optional(),
    }),
  )
  .handler(async ({ data }) => {
    const session = await getSession();
    if (!session?.user) throw new Error("Unauthorized");

    const pipelineId = data.id;

    return await prisma.$transaction(async (tx) => {
      // Update pipeline name if provided
      if (data.name) {
        await tx.pipeline.update({
          where: { id: pipelineId },
          data: { name: data.name },
        });
      }

      // Update stages if provided
      if (data.stages) {
        const existingStages = await tx.stage.findMany({
          where: { pipelineId },
        });

        const providedStageIds = data.stages
          .map((s) => s.id)
          .filter(Boolean) as string[];

        // 1. Delete stages that are not in the provided list
        const stagesToDelete = existingStages.filter(
          (s) => !providedStageIds.includes(s.id),
        );

        for (const stage of stagesToDelete) {
          // Check if stage has applicants or evaluations
          const applicantsCount = await tx.applicant.count({
            where: { currentStageId: stage.id },
          });
          const evaluationsCount = await tx.evaluation.count({
            where: { stageId: stage.id },
          });

          if (applicantsCount > 0 || evaluationsCount > 0) {
            throw new Error(
              `Cannot delete stage "${stage.name}" because it contains applicants or evaluations.`,
            );
          }

          await tx.stage.delete({
            where: { id: stage.id },
          });
        }

        // 2. Update existing stages and create new ones
        for (const stageData of data.stages) {
          if (stageData.id) {
            // Update existing
            await tx.stage.update({
              where: { id: stageData.id },
              data: {
                name: stageData.name,
                order: stageData.order,
              },
            });
          } else {
            // Create new
            await tx.stage.create({
              data: {
                name: stageData.name,
                order: stageData.order,
                pipelineId: pipelineId,
              },
            });
          }
        }
      }

      return await tx.pipeline.findUnique({
        where: { id: pipelineId },
        include: { stages: { orderBy: { order: "asc" } } },
      });
    });
  });

export const deletePipelineFn = createServerFn()
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const session = await getSession();
    if (!session?.user) throw new Error("Unauthorized");

    // Check if it's used by any jobs
    const jobsCount = await prisma.job.count({
      where: { pipelineId: data.id },
    });

    if (jobsCount > 0) {
      throw new Error("Cannot delete pipeline that is being used by jobs");
    }

    return await prisma.pipeline.delete({
      where: { id: data.id },
    });
  });
