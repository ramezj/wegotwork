import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Layout } from "@/components/shared/layout";
import { organizationBySlugQueryOptions } from "@/features/queries/organization";
import { OfficeEditorForm } from "@/components/office/office-editor-form";

export const Route = createFileRoute("/$slug/_layout/offices/create")({
  component: CreateOfficePage,
});

function CreateOfficePage() {
  const { slug } = Route.useParams();
  const { data: orgData } = useSuspenseQuery(
    organizationBySlugQueryOptions(slug),
  );

  const organizationId = orgData?.organization?.id;

  if (!organizationId) {
    return (
      <Layout title="Create Office">
        <div className="text-sm text-muted-foreground">
          Organization not found.
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Create Office">
      <OfficeEditorForm
        mode="create"
        slug={slug}
        organizationId={organizationId}
      />
    </Layout>
  );
}
