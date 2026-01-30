import { createFileRoute, Navigate } from "@tanstack/react-router";
import { CreateJobForm } from "@/components/job/create-job";
import { useSuspenseQuery } from "@tanstack/react-query";
import { organizationBySlugQueryOptions } from "@/queries/organization";

export const Route = createFileRoute("/$slug/_layout/jobs/create/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(organizationBySlugQueryOptions(slug));
  if (!data.organization) {
    return <Navigate to="/dashboard" />;
  }
  return (
    <div>
      <CreateJobForm categories={data.organization.categories} slug={slug} />
    </div>
  );
}
