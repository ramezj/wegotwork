import { isRedirect, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/features/auth/middleware";
import prisma from "@/lib/prisma";
import { z } from "zod";

export const createPipelineFn = createServerFn()
  .inputValidator(
    z.object({
      slug: z.string(),
      name: z.string().min(1, "Pipeline name is required"),
      stages: z.array(z.string()).optional(),
    }),
  )
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const { session } = context;
    const defaultStages = data.stages || [
      "Screening",
      "Phone Interview",
      "Technical Test",
      "Onsite Interview",
      "Offer",
    ];
    try {
      const organization = await prisma.organization.findUnique({
        where: {
          slug: data.slug,
          members: {
            some: {
              userId: context.session.user.id,
            },
          },
        },
        select: {
          id: true,
        },
      });
      if (!organization) {
        throw redirect({ to: "/dashboard" });
      }
      const pipeline = await prisma.pipeline.create({
        data: {
          name: data.name,
          organizationId: organization.id,
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
      return {
        ok: true,
        pipeline,
      };
    } catch (error) {
      return {
        ok: false,
        error: "Failed to create pipeline",
      };
    }
  });

export const getPipelinesFn = createServerFn()
  .inputValidator(z.object({ slug: z.string() }))
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const { session } = context;
    try {
      const organization = await prisma.organization.findFirst({
        where: {
          slug: data.slug,
          members: {
            some: {
              userId: session.user.id,
            },
          },
        },
        select: {
          pipelines: {
            include: {
              jobs: true,
              stages: {
                orderBy: {
                  order: "asc",
                },
              },
            },
          },
        },
      });
      if (!organization) {
        console.error("organization not found, from pipelinesFn");
        throw redirect({ to: "/dashboard" });
      }
      console.log("organization found, from pipelines");
      return { ok: true, pipelines: organization.pipelines };
    } catch (error) {
      if (isRedirect(error)) {
        throw error;
      }
      console.error("Error loading pipelines:", error);
      return {
        ok: false,
        error: "Couldn't load pipelines, please try again later.",
      };
    }
  });
export const updatePipelineFn = createServerFn()
  .inputValidator(
    z.object({
      id: z.string(),
      name: z.string().min(1, "Pipeline name is required"),
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
      await tx.pipeline.update({
        where: { id: pipelineId },
        data: {
          name: data.name,
        },
      });

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
          const applicantsCount = await tx.candidate.count({
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

    return await prisma.$transaction(async (tx) => {
      const pipeline = await tx.pipeline.findFirst({
        where: {
          id: data.id,
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
        },
      });

      if (!pipeline) {
        throw new Error("Pipeline not found");
      }

      const pipelinesCount = await tx.pipeline.count({
        where: { organizationId: pipeline.organizationId },
      });

      if (pipelinesCount <= 1) {
        throw new Error(
          "You must keep at least one pipeline in the organization.",
        );
      }

      const jobsCount = await tx.job.count({
        where: { pipelineId: data.id },
      });

      if (jobsCount > 0) {
        throw new Error("Cannot delete pipeline that is being used by jobs");
      }

      if (pipeline.organization.defaultPipelineId === pipeline.id) {
        const replacementPipeline = await tx.pipeline.findFirst({
          where: {
            organizationId: pipeline.organizationId,
            id: {
              not: pipeline.id,
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        });

        if (!replacementPipeline) {
          throw new Error("A default pipeline must always exist.");
        }

        await tx.organization.update({
          where: { id: pipeline.organizationId },
          data: {
            defaultPipelineId: replacementPipeline.id,
          },
        });
      }

      return tx.pipeline.delete({
        where: { id: data.id },
      });
    });
  });
