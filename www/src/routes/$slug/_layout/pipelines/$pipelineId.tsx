import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Layout } from "@/components/shared/layout";
import { PipelineEditorForm } from "@/components/ats/pipeline-editor-form";
import { pipelinesQueryOptions } from "@/features/queries/ats";
import { Pipeline } from "generated/prisma/client";
import { buildSeo } from "@/lib/seo";

export const Route = createFileRoute("/$slug/_layout/pipelines/$pipelineId")({
  component: EditPipelinePage,
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(
      pipelinesQueryOptions(params.slug),
    );
  },
  head: () => {
    return buildSeo({
      title: "Edit Pipeline",
      description: "Edit a pipeline",
    });
  },
});

function EditPipelinePage() {
  const { slug, pipelineId } = Route.useParams();
  const { data } = useSuspenseQuery(pipelinesQueryOptions(slug));
  const pipeline = data.pipelines?.find(
    (item: Pipeline) => item.id === pipelineId,
  );
  if (!data.ok || !pipeline) {
    return (
      <Layout title="Edit Pipeline">
        <div className="text-sm text-muted-foreground">
          {data.error || "Pipeline not found."}
        </div>
      </Layout>
    );
  }

  return (
    <div className="space-y-4">
      <PipelineEditorForm slug={slug} pipeline={pipeline} />
    </div>
  );
}
