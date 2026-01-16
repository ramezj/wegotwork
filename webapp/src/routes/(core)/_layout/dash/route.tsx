import { createFileRoute } from "@tanstack/react-router";
import DisplayCurrentOrganization from "@/components/dash/display-organization";
import { useSuspenseQuery } from "@tanstack/react-query";
import { dashQueryOptions } from "@/features/dash/query-options";

export const Route = createFileRoute("/(core)/_layout/dash")({
  component: RouteComponent,
});

function RouteComponent() {
  const { session } = Route.useRouteContext();
  const { data: organization } = useSuspenseQuery(dashQueryOptions);
  return (
    <>
      <DisplayCurrentOrganization organization={organization?.organization!} />
    </>
  );
}
