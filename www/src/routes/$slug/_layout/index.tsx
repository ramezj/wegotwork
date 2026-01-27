import { createFileRoute } from "@tanstack/react-router";
import { StatisticsCards } from "@/components/dashboard/statistics";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import { organizationBySlugQueryOptions } from "@/queries/organization";

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
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl">
          Welcome back, <b>{session.user.name}</b>
        </h1>
        <Button>Preview</Button>
      </div>
      <div className="flex lg:flex-row flex-col gap-4">
        <Suspense fallback={<>loading your statistics...</>}>
          <StatisticsCards slug={slug} />
        </Suspense>
      </div>
      {/* <div className="space-y-4">
        <h1 className="text-xl">
          Your Job Openings <b>({data?.organization?.jobs?.length || 0})</b>
        </h1>
        <div className="flex flex-col space-y-4">
          {data?.organization?.jobs?.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div> */}
    </div>
  );
}
