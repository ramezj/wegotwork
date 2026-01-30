import { createFileRoute } from "@tanstack/react-router";
import { JobCard } from "@/components/job/job-card";
import { useSuspenseQuery } from "@tanstack/react-query";
import { organizationBySlugQueryOptions } from "@/queries/organization";
import { Navigate } from "@tanstack/react-router";
import { Layout } from "@/components/shared/layout";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/$slug/_layout/jobs/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(organizationBySlugQueryOptions(slug));
  if (!data.organization) {
    return <Navigate to="/dashboard" />;
  }
  return (
    <>
      <Layout
        title="Job Openings"
        primaryButton={
          <Button asChild>
            <Link to="/$slug/jobs/create" params={{ slug }}>
              Create
            </Link>
          </Button>
        }
        boldText={"(" + (data?.organization?.jobs?.length || 0) + ")"}
      >
        <div className="flex flex-col space-y-4">
          {data?.organization?.jobs?.map((job) => (
            <JobCard slug={slug} key={job.id} job={job} />
          ))}
        </div>
      </Layout>
    </>
  );
}
