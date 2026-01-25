import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { getOrganizationBySlugFn } from "@/server/organization/get-by-slug";
import { JobCard } from "@/components/job/job-card";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

export const Route = createFileRoute("/$slug/_layout/jobs")({
  component: RouteComponent,
});

function RouteComponent() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery({
    queryKey: ["organization", slug],
    queryFn: () => getOrganizationBySlugFn({ data: { slug } }),
    staleTime: 60 * 60 * 1000,
  });
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="space-y-4"
    >
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
    </motion.div>
  );
}
