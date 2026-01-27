import { createFileRoute } from "@tanstack/react-router";
import { JobsDashboard } from "@/components/job/job-card";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import { LoadingLayout } from "@/components/shared/layout";

export const Route = createFileRoute("/$slug/_layout/jobs")({
  component: RouteComponent,
});

function RouteComponent() {
  const { slug } = Route.useParams();
  return (
    <Suspense
      fallback={
        <LoadingLayout
          title="Job Openings"
          boldText="(0)"
          primaryButton={<Button disabled>Create</Button>}
        />
      }
    >
      <JobsDashboard slug={slug} />
    </Suspense>
  );
}
