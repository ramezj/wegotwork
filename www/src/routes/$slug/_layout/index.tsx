import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { getOrganizationBySlugFn } from "@/server/organization/get-by-slug";
import { StatisticCard } from "@/components/dashboard/statistics";
import { Briefcase, Users } from "lucide-react";
import { JobCard } from "@/components/job/job-card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/$slug/_layout/")({
  component: RouteComponent,
  head: () => ({
    meta: [{ title: "Dashboard", content: "Dashboard" }, { name: "Dashboard" }],
  }),
  pendingComponent: DashboardPending,
  pendingMinMs: 5000,
  pendingMs: 0,
  wrapInSuspense: true,
});

function DashboardPending() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-8 w-64 bg-muted rounded" />
        <div className="h-10 w-24 bg-muted rounded" />
      </div>
      <div className="flex lg:flex-row flex-col gap-4">
        <div className="h-24 flex-1 bg-muted rounded" />
        <div className="h-24 flex-1 bg-muted rounded" />
        <div className="h-24 flex-1 bg-muted rounded" />
      </div>
      <div className="space-y-4">
        <div className="h-8 w-48 bg-muted rounded" />
        <div className="flex flex-col space-y-4">
          <div className="h-32 bg-muted rounded" />
          <div className="h-32 bg-muted rounded" />
        </div>
      </div>
    </div>
  );
}

function RouteComponent() {
  const { session } = Route.useRouteContext();
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery({
    queryKey: ["organization", slug],
    queryFn: () => getOrganizationBySlugFn({ data: { slug } }),
  });
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl">
          Welcome back, <b>{session.user.name}</b>
        </h1>
        <Button>Preview</Button>
      </div>
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
      <div className="space-y-4">
        <h1 className="text-xl">
          Your Job Openings <b>({data?.organization?.jobs?.length || 0})</b>
        </h1>
        <div className="flex flex-col space-y-4">
          {data?.organization?.jobs?.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
}
