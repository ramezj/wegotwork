import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { jobByIdQueryOptions } from "@/features/queries/jobs";

export const Route = createFileRoute("/$slug/_layout/candidates/$jobId")({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(
      jobByIdQueryOptions(params.jobId),
    );
  },
});

function RouteComponent() {
  const { jobId } = Route.useParams();

  const { data } = useSuspenseQuery(jobByIdQueryOptions(jobId));

  if (!data?.success || !data?.job) {
    return <div>Job not found</div>;
  }

  return (
    <div className="flex flex-col flex-1">
      <Outlet />
    </div>
  );
}
