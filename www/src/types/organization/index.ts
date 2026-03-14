import { Organization, Job, Applicant, JobCategory, JobQuestion, Pipeline } from "generated/prisma/client";

export type OrganizationWithDetails = Organization & {
  jobs: (Job & {
    applicants: Applicant[];
    category: JobCategory | null;
    questions: JobQuestion[];
  })[];
  categories: JobCategory[];
  pipelines: Pipeline[];
};

export type OrganizationResponse = {
  success: boolean;
  organization: OrganizationWithDetails | null;
  applicantCount: number;
  error?: string;
};

export type ViewOrganizationWithDetails = Organization & {
  jobs: (Job & {
    category: JobCategory | null;
  })[];
  categories: (JobCategory & {
    jobs: (Job & {
      questions: JobQuestion[];
      category: JobCategory | null;
    })[];
  })[];
};

export type ViewOrganizationResponse = {
  success: boolean;
  organization: ViewOrganizationWithDetails | null;
  error?: string;
};
