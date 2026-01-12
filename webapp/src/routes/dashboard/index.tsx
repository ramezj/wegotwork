import { authMiddleware } from "@/lib/middleware";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
  server: {
    middleware: [authMiddleware],
  },
});

function RouteComponent() {
  return <div>Hello "/dashboard/"!</div>;
}
