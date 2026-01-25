import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getOrganizationBySlugFn } from "@/server/organization/get-by-slug";
import { JobCard } from "@/components/job/job-card";

export const Route = createFileRoute("/$slug/_layout/jobs")({
  component: RouteComponent,
});

function RouteComponent() {
  const { session } = Route.useRouteContext();
  const { data } = useQuery({
    queryKey: ["organization", Route.useParams().slug],
    queryFn: () =>
      getOrganizationBySlugFn({ data: { slug: Route.useParams().slug } }),
    staleTime: 60 * 60 * 1000,
  });
  return (
    <div className="space-y-4">
      <h1 className="text-xl">
        Job Openings <b>({data?.organization?.jobs?.length || 0})</b>
      </h1>
      <div className="flex flex-col space-y-4">
        {data?.organization?.jobs?.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}
