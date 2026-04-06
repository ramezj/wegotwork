import { queryOptions } from "@tanstack/react-query";
import { getCategoriesByOrgSlugFn } from "../services/organization/get-categories";

export const categoriesByOrgSlugQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["categories", slug],
    queryFn: () => getCategoriesByOrgSlugFn({ data: { slug } }),
  });
