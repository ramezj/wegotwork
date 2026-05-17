import { z } from "zod";
export { type Candidate, type CandidateResponse } from "../../generated/prisma/client";
import { Candidate, Job, CandidateResponse } from "../../generated/prisma/client";

export type CandidateWithJob = Candidate & {
  job: Job;
};

export type CandidateWithResponses = Candidate & {
  responses: CandidateResponse[];
};

export const candidateSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  resumeKey: z.string().min(1, "Resume is required"),
  jobId: z.string().min(1, "Job ID is required"),
  responses: z.record(z.string(), z.any()).default({}), // Dynamic answers from form
});

export const updateCandidateStatusSchema = z.object({
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
