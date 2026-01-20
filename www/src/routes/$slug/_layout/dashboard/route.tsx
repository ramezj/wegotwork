import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$slug/_layout/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const { session } = Route.useRouteContext();
  return <div>Hello {JSON.stringify(session.user.name)}</div>;
}
