import { createServerFn } from "@tanstack/react-start";
import prisma from "@/lib/prisma";
import { applicantSchema } from "@/types/applicant";

export const createApplicantFn = createServerFn()
  .inputValidator(applicantSchema)
  .handler(async ({ data }) => {
    try {
      const job = await prisma.job.findUnique({
        where: { id: data.jobId },
      });

      if (!job) {
        return { success: false, error: "Job no longer exists" };
      }

      const applicant = await prisma.applicant.create({
        data: {
          name: data.name,
          email: data.email,
          motivation: data.motivation,
          linkedIn: data.linkedIn,
          twitter: data.twitter,
          github: data.github,
          resumeKey: data.resumeKey,
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
