import { queryOptions } from "@tanstack/react-query";
import { getCandidatesForOrganizationFn } from "../services/candidates/get-candidates";
import { getRecentApplicantsByOrgSlugFn } from "../services/candidates/get-recent-applicants";

export const candidatesQueryOptions = (slug: string, jobId?: string) =>
  queryOptions({
    queryKey: ["candidates", slug, jobId],
    queryFn: () => getCandidatesForOrganizationFn({ data: { slug, jobId } }),
  });

export const recentApplicantsByOrgSlugQueryOptions = (
  slug: string,
  limit?: number,
) =>
  queryOptions({
    queryKey: ["recent-applicants", slug, limit],
    queryFn: () => getRecentApplicantsByOrgSlugFn({ data: { slug, limit } }),
    staleTime: 30 * 1000,
  });
