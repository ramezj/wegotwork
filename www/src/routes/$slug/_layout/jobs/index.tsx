import { createFileRoute } from "@tanstack/react-router";
import { JobsDashboard } from "@/components/job/job-card";

export const Route = createFileRoute("/$slug/_layout/jobs/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { slug } = Route.useParams();
  return <JobsDashboard slug={slug} />;
}
