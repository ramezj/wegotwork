import { createFileRoute } from "@tanstack/react-router";
import { JobCard } from "@/components/job/job-card";
import { useSuspenseQuery } from "@tanstack/react-query";
import { organizationBySlugQueryOptions } from "@/features/queries/organization";
import { Navigate } from "@tanstack/react-router";
import { Layout } from "@/components/shared/layout";
import { CreateJobDialog } from "@/components/job/create-job-dialog";

export const Route = createFileRoute("/$slug/_layout/jobs/")({
  component: RouteComponent,
  head: () => ({
    meta: [{ title: "Jobs", content: "Jobs" }, { name: "Jobs" }],
  }),
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
        title={"Job Openings (" + (data?.organization?.jobs?.length || 0) + ")"}
        primaryButton={<CreateJobDialog slug={slug} />}
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
