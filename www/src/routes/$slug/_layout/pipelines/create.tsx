import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Layout } from "@/components/shared/layout";
import { organizationBySlugQueryOptions } from "@/features/queries/organization";
import { PipelineEditorForm } from "@/components/ats/pipeline-editor-form";

export const Route = createFileRoute("/$slug/_layout/pipelines/create")({
  component: CreatePipelinePage,
});

function CreatePipelinePage() {
  const { slug } = Route.useParams();
  const { data: orgData } = useSuspenseQuery(
    organizationBySlugQueryOptions(slug),
  );

  const organizationId = orgData?.organization?.id;

  if (!organizationId) {
    return (
      <Layout title="Create Pipeline">
        <div className="text-sm text-muted-foreground">
          Organization not found.
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Create Pipeline">
      <PipelineEditorForm
        mode="create"
        slug={slug}
        organizationId={organizationId}
      />
    </Layout>
  );
}
