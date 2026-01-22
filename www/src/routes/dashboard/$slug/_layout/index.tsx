import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { getOrganizationBySlugFn } from "@/server/organization/get-by-slug";

export const Route = createFileRoute("/dashboard/$slug/_layout/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isLoading } = useQuery({
    queryKey: ["organization", Route.useParams().slug],
    queryFn: () =>
      getOrganizationBySlugFn({ data: { slug: Route.useParams().slug } }),
  });
  return <div>{isLoading ? "Loading..." : data?.organization?.name}</div>;
}
