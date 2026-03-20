import { queryOptions } from "@tanstack/react-query";
import { getCandidatesForOrganizationFn } from "../services/candidates/get-candidates";

export const candidatesQueryOptions = (slug: string, jobId?: string) =>
  queryOptions({
    queryKey: ["candidates", slug, jobId],
    queryFn: () => getCandidatesForOrganizationFn({ data: { slug, jobId } }),
  });
