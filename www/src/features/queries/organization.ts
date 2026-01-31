import { getOrganizationBySlugFn } from "@/features/services/organization/get-by-slug";
import { queryOptions } from "@tanstack/react-query";

export const organizationBySlugQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["organization", slug],
    queryFn: () => getOrganizationBySlugFn({ data: { slug } }),
    staleTime: 60 * 60 * 1000,
  });
