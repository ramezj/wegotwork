import { createFileRoute } from "@tanstack/react-router";
import { StatisticCard } from "@/components/dashboard/statistics";
import { Button } from "@/components/ui/button";
import { organizationBySlugQueryOptions } from "@/features/queries/organization";
import { Layout } from "@/components/shared/layout";
import { JobCard } from "@/components/job/job-card";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Navigate } from "@tanstack/react-router";
import { Briefcase, Users } from "lucide-react";
import { Job } from "generated/prisma/browser";

export const Route = createFileRoute("/$slug/_layout/")({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    context.queryClient.prefetchQuery(
      organizationBySlugQueryOptions(params.slug),
    );
  },
  head: () => ({
    meta: [{ title: "Dashboard", content: "Dashboard" }, { name: "Dashboard" }],
  }),
});

function RouteComponent() {
  const { session } = Route.useRouteContext();
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(organizationBySlugQueryOptions(slug));
  if (!data?.organization) {
    return <Navigate to="/dashboard" />;
  }
  return (
    <Layout
      title="Welcome back,"
      boldText={session.user.name}
      primaryButton={<Button>Preview</Button>}
    >
      <div className="flex flex-col gap-4">
        <div className="flex lg:flex-row flex-col gap-4">
          <StatisticCard
            title="Organization"
            amount={data?.organization?.name || ""}
            icon={<Briefcase className="size-4" />}
          />
          <StatisticCard
            title="Jobs"
            amount={data?.organization?.jobs?.length || 0}
            icon={<Briefcase className="size-4" />}
          />
          <StatisticCard
            title="Categories"
            amount={data?.organization?.categories?.length || 0}
            icon={<Users className="size-4" />}
          />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col space-y-4">
            <div>
              <h1 className="text-xl">
                Recent Jobs
                <b> ({data?.organization?.jobs?.length || 0})</b>
              </h1>
            </div>
            {data?.organization?.jobs?.map((job: Job) => (
              <JobCard slug={slug} key={job.id} job={job} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
