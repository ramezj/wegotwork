import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { jobByIdQueryOptions } from "@/queries/jobs";
import { EditJobForm } from "@/components/job/edit-job";
import { JobWithCategory } from "@/types/job";
import { organizationBySlugQueryOptions } from "@/queries/organization";

export const Route = createFileRoute("/$slug/_layout/jobs/$jobId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { jobId, slug } = Route.useParams();
  const { data } = useSuspenseQuery(jobByIdQueryOptions(jobId));
  if (data?.job === null) {
    return <Navigate to="/$slug" params={{ slug }} />;
  }
  const { data: orgData } = useSuspenseQuery(
    organizationBySlugQueryOptions(slug),
  );
  const categories = orgData?.organization?.categories || [];
  return (
    <div className="space-y-4">
      <EditJobForm job={data.job as JobWithCategory} categories={categories} />
    </div>
  );
}
