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

    // Update pipeline name if provided
    if (data.name) {
      await prisma.pipeline.update({
        where: { id: data.id },
        data: { name: data.name },
      });
    }

    // Update stages if provided
    if (data.stages) {
      // For simplicity in this implementation, we'll delete and recreate stages
      // A more robust way would be to sync them (update existing, create new, delete removed)
      await prisma.stage.deleteMany({
        where: { pipelineId: data.id },
      });

      await prisma.stage.createMany({
        data: data.stages.map((stage) => ({
          name: stage.name,
          order: stage.order,
          pipelineId: data.id,
        })),
      });
    }

    return await prisma.pipeline.findUnique({
      where: { id: data.id },
      include: { stages: { orderBy: { order: "asc" } } },
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
