import { createFileRoute } from "@tanstack/react-router";
import { EditOrganizationForm } from "@/components/organization/edit-organization";
import { useSuspenseQuery } from "@tanstack/react-query";
import { organizationBySlugQueryOptions } from "@/features/queries/organization";
import { Navigate } from "@tanstack/react-router";
import { buildSeo } from "@/lib/seo";

export const Route = createFileRoute("/$slug/_layout/organization")({
  component: RouteComponent,
  head: () => {
    return buildSeo({
      title: "Organization",
      description: "Organization",
    });
  },
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(
      organizationBySlugQueryOptions(params.slug),
    );
  },
});

function RouteComponent() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(organizationBySlugQueryOptions(slug));
  if (!data?.organization) {
    return <Navigate to="/dashboard" />;
  }
  return (
    <>
      <EditOrganizationForm organization={data.organization} />
    </>
  );
}
