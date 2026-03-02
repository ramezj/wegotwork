import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getJobByIdFn } from "@/features/services/jobs/get-job";
import { Button } from "@/components/ui/button";
import { Briefcase, ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/$slug/_layout/applicants/$jobId")({
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
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between shrink-0">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-1">
            <Button variant="ghost" size="icon" asChild className="size-8">
              <Link to="/$slug/applicants" params={{ slug }}>
                <ChevronLeft className="size-4" />
              </Link>
            </Button>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Back to Jobs
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{job.title}</h1>
          <p className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
            <Briefcase className="size-3.5" />
            {job.locationMode.toLowerCase()} •{" "}
            {job.type.toLowerCase().replace("_", "-")}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}
