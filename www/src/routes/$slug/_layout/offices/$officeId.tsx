import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Layout } from "@/components/shared/layout";
import { organizationBySlugQueryOptions } from "@/features/queries/organization";
import { officesQueryOptions } from "@/features/queries/offices";
import { OfficeEditorForm } from "@/components/office/office-editor-form";

export const Route = createFileRoute("/$slug/_layout/offices/$officeId")({
  component: EditOfficePage,
});

function EditOfficePage() {
  const { slug, officeId } = Route.useParams();
  const { data: orgData } = useSuspenseQuery(
    organizationBySlugQueryOptions(slug),
  );
  const organizationId = orgData?.organization?.id || "";

  const { data: offices } = useSuspenseQuery(officesQueryOptions(organizationId));
  const office = offices.find((item: any) => item.id === officeId);

  if (!organizationId || !office) {
    return (
      <Layout title="Edit Office">
        <div className="text-sm text-muted-foreground">Office not found.</div>
      </Layout>
    );
  }

  return (
    <Layout title="Edit Office">
      <OfficeEditorForm
        mode="edit"
        slug={slug}
        organizationId={organizationId}
        office={office}
      />
    </Layout>
  );
}
