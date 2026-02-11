import { createFileRoute } from "@tanstack/react-router";
import { EditOrganizationForm } from "@/components/organization/edit-organization";
import { useSuspenseQuery } from "@tanstack/react-query";
import { organizationBySlugQueryOptions } from "@/features/queries/organization";
import { Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/$slug/_layout/organization")({
  component: RouteComponent,
});

function RouteComponent() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(organizationBySlugQueryOptions(slug));
  if (!data?.organization) {
    return <Navigate to="/dashboard" />;
  }
  return (
    <div className="space-y-4">
      <EditOrganizationForm organization={data.organization} />
    </div>
  );
}
