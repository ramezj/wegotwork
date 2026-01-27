import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { getOrganizationBySlugFn } from "@/server/organization/get-by-slug";
import {
  JobCard,
  JobsDashboardSkeleton,
  JobsDashboard,
} from "@/components/job/job-card";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

export const Route = createFileRoute("/$slug/_layout/jobs")({
  component: RouteComponent,
});

function RouteComponent() {
  const { slug } = Route.useParams();
  return (
    <Suspense fallback={<JobsDashboardSkeleton />}>
      <JobsDashboard slug={slug} />
    </Suspense>
  );
}
