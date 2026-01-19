import { createFileRoute } from "@tanstack/react-router";
import JobsSkeleton from "@/components/jobs/jobs-skeleton";

export const Route = createFileRoute("/$slug/_layout/jobs")({
  component: RouteComponent,
  pendingComponent: JobsSkeleton,
});

function RouteComponent() {
  return <div>Hello "/(core)/_layout/jobs"!</div>;
}
