import { useParams, useRouteContext } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getOrganizationBySlugFn } from "@/server/organization/get-by-slug";
import { StatisticCard } from "@/components/dashboard/statistics";
import { Briefcase, Users } from "lucide-react";
import { JobCard } from "@/components/job/job-card";
import { Button } from "@/components/ui/button";

export function DashboardContent() {
  const { session } = useRouteContext({ strict: false }) as any;
  const { slug } = useParams({ strict: false });

  const { data } = useSuspenseQuery({
    queryKey: ["organization", slug],
    queryFn: () => getOrganizationBySlugFn({ data: { slug: slug! } }),
    staleTime: 60 * 60 * 1000,
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
