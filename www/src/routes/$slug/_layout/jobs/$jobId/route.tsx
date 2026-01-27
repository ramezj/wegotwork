import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$slug/_layout/jobs/$jobId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { session } = Route.useRouteContext();
  return <div>Hello "/$slug/_layout/jobs/$jobId"!</div>;
}
