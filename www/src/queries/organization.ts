import { getOrganizationBySlugFn } from "@/server/organization/get-by-slug";
import { queryOptions } from "@tanstack/react-query";

export const organizationBySlugQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["organization", slug],
    queryFn: () => getOrganizationBySlugFn({ data: { slug } }),
  });
