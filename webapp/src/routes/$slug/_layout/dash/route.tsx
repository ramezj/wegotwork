import { createFileRoute } from "@tanstack/react-router";
import DisplayCurrentOrganization from "@/components/dash/display-organization";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getDashFn } from "@/features/dash/get-dash";

export const Route = createFileRoute("/$slug/_layout/dash")({
  component: RouteComponent,
});

function RouteComponent() {
  const { session } = Route.useRouteContext();
  // const params = Route.useParams();
  const { data: organization } = useSuspenseQuery({
    queryKey: ["dash"],
    queryFn: () =>
      getDashFn({
        data: { slug: Route.useParams().slug },
      }),
  });
  return (
    <>
      <DisplayCurrentOrganization
        organization={organization?.organization!}
        // slug={params.slug}
      />
    </>
  );
}
