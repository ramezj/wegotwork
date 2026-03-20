import { queryOptions } from "@tanstack/react-query";
import { getPipelinesFn } from "../services/ats/pipeline";
import { getCandidateHistoryFn } from "../services/ats/candidate";

export const pipelinesQueryOptions = (organizationId: string) =>
  queryOptions({
    queryKey: ["pipelines", organizationId],
    queryFn: () => getPipelinesFn({ data: { organizationId } }),
  });

export const candidateHistoryQueryOptions = (candidateId: string) =>
  queryOptions({
    queryKey: ["candidate-history", candidateId],
    queryFn: () => getCandidateHistoryFn({ data: { candidateId } }),
  });
