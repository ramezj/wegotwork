import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(application)/_layout/jobs/$jobId")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello from {Route.useParams().jobId}</div>;
}
