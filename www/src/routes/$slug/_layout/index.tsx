import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { getOrganizationBySlugFn } from "@/server/organization/get-by-slug";
import { StatisticCard } from "@/components/dashboard/statistics";
import { Briefcase, Users } from "lucide-react";
import { JobCard } from "@/components/job/job-card";

export const Route = createFileRoute("/$slug/_layout/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { session } = Route.useRouteContext();
  const { data, isLoading } = useQuery({
    queryKey: ["organization", Route.useParams().slug],
    queryFn: () =>
      getOrganizationBySlugFn({ data: { slug: Route.useParams().slug } }),
    staleTime: 60 * 60 * 1000,
  });
  return (
    <div className="space-y-4">
      {isLoading && "Loading..."}
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
      <div className="space-y-2">
        <h1 className="text-base font-medium">Jobs</h1>
        {data?.organization?.jobs?.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}
