import { queryOptions } from "@tanstack/react-query";
import { getOrganizationCategoriesFn } from "@/features/services/category/get-organization-categories";

export const getOrganizationCategoriesQuery = (slug: string) =>
  queryOptions({
    queryKey: ["getOrganizationCategories", slug],
    queryFn: () => getOrganizationCategoriesFn({ data: { slug } }),
  });
