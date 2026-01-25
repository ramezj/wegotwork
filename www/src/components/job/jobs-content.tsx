import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { getOrganizationBySlugFn } from "@/server/organization/get-by-slug";
import { JobCard } from "@/components/job/job-card";
import { Button } from "@/components/ui/button";

export function JobsContent() {
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
          Job Openings <b>({data?.organization?.jobs?.length || 0})</b>
        </h1>
        <Button>Create</Button>
      </div>
      <div className="flex flex-col space-y-4">
        {data?.organization?.jobs?.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}
