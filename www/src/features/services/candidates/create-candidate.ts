import { createServerFn } from "@tanstack/react-start";
import prisma from "@/lib/prisma";
import { candidateSchema } from "@/types/candidate";
import { generateDynamicSchema } from "@/lib/dynamic-schema";
import { FormConfig } from "@/types/form-config";
import resend from "@/lib/resend";
import { ApplicationConfirmationEmail } from "@/emails/application-confirmation";
import { render } from "@react-email/render";

export const createCandidateFn = createServerFn()
  .inputValidator(candidateSchema)
  .handler(async ({ data }) => {
    try {
      const doesCandidateExist = await prisma.job.findUnique({
        where: {
          id: data.jobId,
          candidates: {
            some: {
              email: data.email,
            },
          },
        },
      });
      if (doesCandidateExist) {
        return { success: false, error: "Already Applied to Job" };
      }
      const job = await prisma.job.findUnique({
        where: { id: data.jobId },
        include: {
          questions: { orderBy: { order: "asc" } },
          pipeline: {
            include: {
              stages: { orderBy: { order: "asc" } },
            },
          },
          organization: {
            select: { name: true, slug: true },
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
            create: Object.entries(data.responses).map(
              ([questionId, answer]) => ({
                questionId,
                answer: answer as any,
              }),
            ),
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

      // Send confirmation email to the applicant
      try {
        const isDev = process.env.NODE_ENV === "development";
        const orgSlug = job.organization?.slug ?? "";
        const careersUrl = isDev
          ? `http://careers.localhost:3000/${orgSlug}`
          : `https://careers.lunics.co/${orgSlug}`;

        const html = await render(
          ApplicationConfirmationEmail({
            candidateName: data.name,
            jobTitle: job.title,
            organizationName: job.organization?.name ?? "the company",
            careersUrl,
          }),
        );

        await resend.emails.send({
          from: "lunics <no-reply@lunics.co>",
          to: [data.email],
          subject: `Your application for ${job.title} has been received`,
          html,
        });
      } catch (emailError) {
        // Non-fatal — log but don't fail the submission
        console.error("Failed to send confirmation email:", emailError);
      }

      return { success: true, candidate };
    } catch (error) {
      console.error("Error in createCandidateFn:", error);
      throw new Error("Failed to submit application");
    }
  });
