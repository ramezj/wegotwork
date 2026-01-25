import { createFileRoute } from "@tanstack/react-router";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export const Route = createFileRoute("/$slug/_layout/")({
  component: RouteComponent,
  head: () => ({
    meta: [{ title: "Dashboard", content: "Dashboard" }, { name: "Dashboard" }],
  }),
});

function RouteComponent() {
  return <DashboardContent />;
}
