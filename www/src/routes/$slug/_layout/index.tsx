import { useSuspenseQuery } from "@tanstack/react-query";
import { AnimatePresence } from "motion/react";
import { createFileRoute } from "@tanstack/react-router";
import { getOrganizationBySlugFn } from "@/server/organization/get-by-slug";
import {
  StatisticCard,
  StatisticsCards,
} from "@/components/dashboard/statistics";
import { Briefcase, Users } from "lucide-react";
import { JobCard } from "@/components/job/job-card";
import { Button } from "@/components/ui/button";
import { organizationQueryOptions } from "@/queries/organization";
import { Suspense } from "react";

export const Route = createFileRoute("/$slug/_layout/")({
  component: RouteComponent,
  loader: async ({ context }) => {
    context.queryClient.prefetchQuery(organizationQueryOptions);
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
