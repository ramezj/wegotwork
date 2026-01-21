import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$slug/_layout/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello from the main page!</div>;
}
