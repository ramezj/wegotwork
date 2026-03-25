import { queryOptions } from "@tanstack/react-query";
import { getOfficesFn } from "../services/office/office";

export const officesQueryOptions = (organizationId: string) =>
  queryOptions({
    queryKey: ["offices", organizationId],
    queryFn: () => getOfficesFn({ data: { organizationId } }),
  });
