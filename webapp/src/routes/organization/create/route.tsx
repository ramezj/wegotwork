import { createFileRoute } from "@tanstack/react-router";
import CreateOrganizationButton from "@/features/organization/components/create-organization";

export const Route = createFileRoute("/organization/create")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex items-center justify-center h-screen">
      <CreateOrganizationButton />
    </div>
  );
}
