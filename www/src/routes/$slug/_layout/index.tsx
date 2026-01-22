import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { getOrganizationBySlugFn } from "@/server/organization/get-by-slug";

export const Route = createFileRoute("/$slug/_layout/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isLoading } = useQuery({
    queryKey: ["organization", Route.useParams().slug],
    queryFn: () =>
      getOrganizationBySlugFn({ data: { slug: Route.useParams().slug } }),
    staleTime: 60 * 60 * 1000,
  });
  return <div>{isLoading ? "Loading..." : data?.organization?.name}</div>;
}
