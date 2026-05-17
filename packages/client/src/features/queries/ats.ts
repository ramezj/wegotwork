import { queryOptions } from "@tanstack/react-query";
import { getPipelinesFn } from "../services/ats/pipeline";
import { getCandidateHistoryFn } from "../services/ats/candidate";

export const pipelinesQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["pipelines", slug],
    queryFn: () => getPipelinesFn({ data: { slug } }),
  });

export const candidateHistoryQueryOptions = (candidateId: string) =>
  queryOptions({
    queryKey: ["candidate-history", candidateId],
    queryFn: () => getCandidateHistoryFn({ data: { candidateId } }),
  });
