import { z } from "zod";
export { type Job, type JobCategory } from "generated/prisma/client";
import { Job, JobCategory } from "generated/prisma/client";

export type JobWithCategory = Job & {
  category: JobCategory | null;
};

export type CategoryWithJob = JobCategory & {
  jobs: JobWithCategory[];
};

export const jobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "CLOSED", "ARCHIVED"]).default("DRAFT"),
  type: z
    .enum(["FULLTIME", "PARTTIME", "INTERNSHIP", "CONTRACT"])
    .default("FULLTIME"),
  locationMode: z.enum(["REMOTE", "ONSITE", "HYBRID"]).default("ONSITE"),
  country: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  currency: z.string().min(1, "Currency is required").default("USD"),
  salaryInterval: z
    .enum(["HOURLY", "DAILY", "WEEKLY", "MONTHLY", "QUARTERLY", "YEARLY"])
    .default("MONTHLY"),
  experienceLevel: z
    .enum(["ENTRY", "MID", "SENIOR", "LEAD", "EXECUTIVE"])
    .default("ENTRY"),
  categoryId: z.string().optional(),
});
