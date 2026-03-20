import {
  Organization,
  Job,
  Candidate,
  JobCategory,
  JobQuestion,
  Pipeline,
  Member,
  Invitation,
  User,
} from "generated/prisma/client";

export type OrganizationWithDetails = Organization & {
  jobs: (Job & {
    candidates: Candidate[];
    category: JobCategory | null;
    questions: JobQuestion[];
  })[];
  categories: JobCategory[];
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

export type OrganizationTeamMember = Member & {
  user: User;
};

export type OrganizationTeamResponse = {
  success: boolean;
  organization: Organization | null;
  members: OrganizationTeamMember[];
  invitations: Invitation[];
  currentMemberRole: "owner" | "admin" | "member" | null;
  error?: string;
};
