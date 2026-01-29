import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { jobByIdQueryOptions } from "@/queries/jobs";
import { EditJobForm } from "@/components/job/edit-job";
import { Job } from "generated/prisma/client";

export const Route = createFileRoute("/$slug/_layout/jobs/$jobId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { jobId } = Route.useParams();
  const { data } = useSuspenseQuery(jobByIdQueryOptions(jobId));
  return (
    <div>
      <EditJobForm job={data.job as Job} />
    </div>
  );
}
