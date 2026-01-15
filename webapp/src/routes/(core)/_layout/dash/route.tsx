import { createFileRoute } from "@tanstack/react-router";
import DisplayCurrentOrganization from "@/components/dash/display-current-organization";

export const Route = createFileRoute("/(core)/_layout/dash")({
  component: RouteComponent,
});

function RouteComponent() {
  const { session } = Route.useRouteContext();
  return (
    <>
      <DisplayCurrentOrganization />
    </>
  );
}
