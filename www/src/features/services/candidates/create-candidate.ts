import { createServerFn } from "@tanstack/react-start";
import prisma from "@/lib/prisma";
import { candidateSchema } from "@/types/candidate";
import { generateDynamicSchema } from "@/lib/dynamic-schema";
import { FormConfig } from "@/types/form-config";

export const createCandidateFn = createServerFn()
  .inputValidator(candidateSchema)
  .handler(async ({ data }) => {
    try {
      const job = await prisma.job.findUnique({
        where: { id: data.jobId },
        include: {
          questions: { orderBy: { order: "asc" } },
          pipeline: {
            include: {
              stages: { orderBy: { order: "asc" } },
            },
          },
        },
      });

      if (!job) {
        return { success: false, error: "Job no longer exists" };
      }

      // Dynamic Validation
      const formConfig = (job.questions as any as FormConfig) || [];
      const dynamicSchema = generateDynamicSchema(formConfig);

      const validationResult = dynamicSchema.safeParse(data);
      if (!validationResult.success) {
        console.error(
          "Dynamic validation failed:",
          validationResult.error.flatten().fieldErrors,
        );
        return {
          success: false,
          error: "Invalid form data",
          details: validationResult.error.flatten().fieldErrors,
        };
      }

      const firstStageId = job?.pipeline?.stages[0]?.id;

      if (!firstStageId) {
        throw new Error("Job pipeline has no stages");
      }

      const candidate = await prisma.candidate.create({
        data: {
          name: data.name,
          email: data.email,
          resumeKey: data.resumeKey,
          jobId: data.jobId,
          status: "SUBMITTED",
          currentStageId: firstStageId,
          responses: {
            create: Object.entries(data.responses).map(([questionId, answer]) => ({
              questionId,
              answer: answer as any,
            })),
          },
        },
      });

      // Log the application
      await prisma.activityLog.create({
        data: {
          action: "APPLIED",
          candidateId: candidate.id,
          metadata: {
            jobTitle: job.title,
            stage: job?.pipeline?.stages[0]?.name || "Initial",
          },
        },
      });

      return { success: true, candidate };
    } catch (error) {
      console.error("Error in createCandidateFn:", error);
      throw new Error("Failed to submit application");
    }
  });
