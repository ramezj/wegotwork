import { queryOptions } from "@tanstack/react-query";
import { getPipelinesFn } from "../services/ats/pipeline";
import { getApplicantHistoryFn } from "../services/ats/applicant";

export const pipelinesQueryOptions = (organizationId: string) =>
  queryOptions({
    queryKey: ["pipelines", organizationId],
    queryFn: () => getPipelinesFn({ data: { organizationId } }),
  });

export const applicantHistoryQueryOptions = (applicantId: string) =>
  queryOptions({
    queryKey: ["applicant-history", applicantId],
    queryFn: () => getApplicantHistoryFn({ data: { applicantId } }),
  });
