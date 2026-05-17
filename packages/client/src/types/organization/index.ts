import {
  Organization,
  Job,
  Candidate,
  JobCategory,
  JobQuestion,
  Pipeline,
  Office,
  Member,
  Invitation,
  User,
  Plan,
} from "generated/prisma/client";

export type OrganizationWithPlan = Organization & {
  plan: Plan;
};

export type OrganizationWithDetails = Organization & {
  plan: Plan;
  jobs: (Job & {
    candidates: Candidate[];
    category: JobCategory | null;
    office: Office | null;
    questions: JobQuestion[];
  })[];
  categories: JobCategory[];
  offices: Office[];
  pipelines: Pipeline[];
};

export type OrganizationResponse = {
  success: boolean;
  organization: OrganizationWithDetails | null;
  candidateCount: number;
  error?: string;
};

export type ViewOrganizationWithDetails = Organization & {
  jobs: (Job & {
    category: JobCategory | null;
    office: Office | null;
  })[];
  categories: (JobCategory & {
    jobs: (Job & {
      questions: JobQuestion[];
      category: JobCategory | null;
      office: Office | null;
    })[];
  })[];
};

export type ViewOrganizationResponse = {
  success: boolean;
  organization: ViewOrganizationWithDetails | null;
  error?: string;
};

export type OrganizationTeamMember = Member & {
  user: User;
};

export type OrganizationTeamResponse = {
  success: boolean;
  organization: OrganizationWithPlan | null;
  members: OrganizationTeamMember[];
  invitations: Invitation[];
  currentMemberRole: "owner" | "admin" | "member" | null;
  error?: string;
};
