import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Layout } from "@/components/shared/layout";
import { PipelineEditorForm } from "@/components/ats/pipeline-editor-form";
import { pipelinesQueryOptions } from "@/features/queries/ats";
import { organizationBySlugQueryOptions } from "@/features/queries/organization";

export const Route = createFileRoute("/$slug/_layout/pipelines/$pipelineId")({
  component: EditPipelinePage,
});

function EditPipelinePage() {
  const { slug, pipelineId } = Route.useParams();

  const { data: orgData } = useSuspenseQuery(
    organizationBySlugQueryOptions(slug),
  );
  const organizationId = orgData?.organization?.id;

  const { data: pipelines } = useSuspenseQuery(
    pipelinesQueryOptions(organizationId || ""),
  );

  const pipeline = pipelines?.find((item: any) => item.id === pipelineId);

  if (!organizationId || !pipeline) {
    return (
      <Layout title="Edit Pipeline">
        <div className="text-sm text-muted-foreground">Pipeline not found.</div>
      </Layout>
    );
  }

  return (
    <Layout title="Edit Pipeline">
      <div className="space-y-4">
        <PipelineEditorForm
          mode="edit"
          slug={slug}
          organizationId={organizationId}
          pipeline={pipeline}
        />
      </div>
    </Layout>
  );
}
