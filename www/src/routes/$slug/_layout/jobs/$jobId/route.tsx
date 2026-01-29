import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { jobByIdQueryOptions } from "@/queries/jobs";

export const Route = createFileRoute("/$slug/_layout/jobs/$jobId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { jobId } = Route.useParams();
  const { data } = useSuspenseQuery(jobByIdQueryOptions(jobId));
  return <div>{data.job?.title}</div>;
}
