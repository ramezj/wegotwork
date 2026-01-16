import { queryOptions } from "@tanstack/react-query";
import { getDashFn } from "./get-dash";

export const dashQueryOptions = queryOptions({
  queryKey: ["dash"],
  queryFn: () => getDashFn(),
});
