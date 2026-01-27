import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$slug/_layout/jobs")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
