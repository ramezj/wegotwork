import { createFileRoute } from "@tanstack/react-router";
import ManageOrganizations from "@/components/create-manage/manage-organizations";

export const Route = createFileRoute("/organization/manage")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex items-center justify-center h-screen">
      <ManageOrganizations />
    </div>
  );
}
