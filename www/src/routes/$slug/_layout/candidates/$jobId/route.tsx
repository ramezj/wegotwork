import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getJobByIdFn } from "@/features/services/jobs/get-job";
import { Button } from "@/components/ui/button";
import { Briefcase, ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/$slug/_layout/candidates/$jobId")({
  component: RouteComponent,
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData({
      queryKey: ["job", params.jobId],
      queryFn: () => getJobByIdFn({ data: { jobId: params.jobId } }),
    }),
});

function RouteComponent() {
  const { slug, jobId } = Route.useParams();

  const { data } = useSuspenseQuery({
    queryKey: ["job", jobId],
    queryFn: () => getJobByIdFn({ data: { jobId } }),
  });

  if (!data?.success || !data?.job) {
    return <div>Job not found</div>;
  }

  const job = data.job;

  return (
    <div className="flex flex-col flex-1">
      <Outlet />
    </div>
  );
}
