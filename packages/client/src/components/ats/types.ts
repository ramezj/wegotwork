export type ATSCandidateResponse = {
  id: string;
  questionId: string;
  answer: unknown;
  candidateId?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type ATSCandidate = {
  id: string;
  jobId: string;
  name: string;
  email: string;
  status: unknown;
  createdAt: Date;
  updatedAt?: Date;
  resumeKey: string;
  currentStageId: string | null;
  responses: ATSCandidateResponse[];
};
