import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/features/auth/middleware";
import prisma from "@/lib/prisma";
import { z } from "zod";

export const createPipelineFn = createServerFn()
  .inputValidator(
    z.object({
      organizationId: z.string(),
      stages: z.array(z.string()).optional(),
    }),
  )
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const { session } = context;
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
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const { session } = context;
    if (!session?.user) throw new Error("Unauthorized");

    return await prisma.pipeline.findMany({
      where: { organizationId: data.organizationId },
      include: {
        stages: {
          orderBy: { order: "asc" },
        },
        jobs: true,
      },
    });
  });
export const updatePipelineFn = createServerFn()
  .inputValidator(
    z.object({
      id: z.string(),
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
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const { session } = context;
    if (!session?.user) throw new Error("Unauthorized");

    const pipelineId = data.id;

    return await prisma.$transaction(async (tx) => {
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
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const { session } = context;
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
