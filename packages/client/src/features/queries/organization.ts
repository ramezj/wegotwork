import { getOrganizationBySlugFn } from "@/features/services/organization/get-by-slug";
import { queryOptions } from "@tanstack/react-query";
import { viewOrganizationBySlugFn } from "../services/organization/view-organization";
import { getAllOrganizationsFn } from "../services/organization/get-all-organizations";
import { getOrganizationTeamFn } from "../services/organization/get-team-by-slug";

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

export const organizationsQueryOptions = () =>
  queryOptions({
    queryKey: ["organizations"],
    queryFn: () => getAllOrganizationsFn(),
    staleTime: 60 * 60 * 1000,
  });

export const organizationTeamQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["organization-team", slug],
    queryFn: () => getOrganizationTeamFn({ data: { slug } }),
    staleTime: 60 * 1000,
  });
