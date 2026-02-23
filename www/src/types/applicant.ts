import { z } from "zod";
export { type Applicant } from "generated/prisma/client";
import { Applicant, Job } from "generated/prisma/client";

export type ApplicantWithJob = Applicant & {
  job: Job;
};

export const applicantSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  resumeKey: z.string().min(1, "Resume is required"),
  jobId: z.string().min(1, "Job ID is required"),
  responses: z.record(z.string(), z.any()).default({}), // Dynamic answers
});

export const updateApplicantStatusSchema = z.object({
  id: z.string(),
  status: z.enum([
    "SUBMITTED",
    "UNDERREVIEW",
    "INTERVIEW",
    "OFFER",
    "REJECTED",
    "HIRED",
  ]),
});
