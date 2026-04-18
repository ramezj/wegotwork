import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { jobByIdQueryOptions } from "@/features/queries/jobs";
import { EditJobForm } from "@/components/job/edit-job";
import { JobWithCategory } from "@/types/job/job";
import { organizationBySlugQueryOptions } from "@/features/queries/organization";
import { pipelinesQueryOptions } from "@/features/queries/ats";
import { buildSeo } from "@/lib/seo";

export const Route = createFileRoute("/$slug/_layout/jobs/$jobId")({
  component: RouteComponent,
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(jobByIdQueryOptions(params.jobId)),
  head: ({ loaderData }) => {
    const title = loaderData?.job?.title;
    return buildSeo({
      title: title ?? "Edit Job",
      description: "",
      path: "",
      noIndex: true,
    });
  },
});

function RouteComponent() {
  const { jobId, slug } = Route.useParams();
  const { data } = useSuspenseQuery(jobByIdQueryOptions(jobId));
  if (data?.job === null) {
    return <Navigate to="/$slug" params={{ slug }} />;
  }
  const { data: orgData } = useSuspenseQuery(
    organizationBySlugQueryOptions(slug),
  );
  const categories = orgData?.organization?.categories || [];
  const { data: pipelinesData } = useSuspenseQuery(pipelinesQueryOptions(slug));
  const pipelines = pipelinesData.ok ? pipelinesData.pipelines : [];

  return (
    <div>
      <EditJobForm
        job={data.job as JobWithCategory}
        categories={categories}
        offices={[]}
        pipelines={pipelines}
        slug={slug}
      />
    </div>
  );
}
