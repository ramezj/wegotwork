import { createServerFn } from "@tanstack/react-start";
import prisma from "@/lib/prisma";
import { applicantSchema } from "@/types/applicant";
import { generateDynamicSchema } from "@/lib/dynamic-schema";
import { FormConfig } from "@/types/form-config";

export const createApplicantFn = createServerFn()
  .inputValidator(applicantSchema)
  .handler(async ({ data }) => {
    try {
      const job = await prisma.job.findUnique({
        where: { id: data.jobId },
        include: { questions: { orderBy: { order: "asc" } } },
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

      const applicant = await prisma.applicant.create({
        data: {
          name: data.name,
          email: data.email,
          resumeKey: data.resumeKey,
          responses: data.responses,
          jobId: data.jobId,
          status: "SUBMITTED",
        },
      });

      return { success: true, applicant };
    } catch (error) {
      console.error("Error in createApplicantFn:", error);
      throw new Error("Failed to submit application");
    }
  });
