import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Layout } from "@/components/shared/layout";
import { PipelineEditorForm } from "@/components/ats/pipeline-editor-form";
import { pipelinesQueryOptions } from "@/features/queries/ats";
import { organizationBySlugQueryOptions } from "@/features/queries/organization";
import { Pipeline } from "generated/prisma/client";

export const Route = createFileRoute("/$slug/_layout/pipelines/$pipelineId")({
  component: EditPipelinePage,
});

function EditPipelinePage() {
  const { slug, pipelineId } = Route.useParams();
  const { data } = useSuspenseQuery(pipelinesQueryOptions(slug));
  const pipeline = data.pipielines?.find(
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
    <Layout title="Edit Pipeline">
      <div className="space-y-4">
        <PipelineEditorForm slug={slug} pipeline={pipeline} />
      </div>
    </Layout>
  );
}
