import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(core)/_layout/dash")({
  component: RouteComponent,
});

function RouteComponent() {
  const { session } = Route.useRouteContext();
  return <>{JSON.stringify(session.session.activeOrganizationId)}</>;
}
