import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/view/$slug")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/view/$slug"!</div>;
}
