import { queryOptions } from "@tanstack/react-query";
import { getApplicantsForOrganizationFn } from "../services/applicants/get-applicants";

export const applicantsQueryOptions = (slug: string, jobId?: string) =>
  queryOptions({
    queryKey: ["applicants", slug, jobId],
    queryFn: () => getApplicantsForOrganizationFn({ data: { slug, jobId } }),
  });
