import { getOrganizationBySlugFn } from "@/features/services/organization/get-by-slug";
import { queryOptions } from "@tanstack/react-query";
import { viewOrganizationBySlugFn } from "../services/organization/view-organization";

export const organizationBySlugQueryOptions = (slug: string, limit?: number) =>
  queryOptions({
    queryKey: ["organization", slug],
    queryFn: () => getOrganizationBySlugFn({ data: { slug, limit } }),
    staleTime: 60 * 60 * 1000,
  });

export const viewOrganizationBySlugQueryOptions = (
  slug: string,
  limit?: number,
) =>
  queryOptions({
    queryKey: ["view-organization", slug],
    queryFn: () => viewOrganizationBySlugFn({ data: { slug, limit } }),
    staleTime: 60 * 60 * 1000,
  });
