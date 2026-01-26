import { getAllOrganizationsFn } from "@/server/organization/get-all-organizations";

export const organizationQueryOptions = {
  queryKey: ["organization"],
  queryFn: getAllOrganizationsFn,
};
