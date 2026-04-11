import { createFileRoute, Outlet } from "@tanstack/react-router";
import { OrganizationHeader } from "@/components/organization/organization-header";
import { PublicHeader } from "@/components/public-header";

export const Route = createFileRoute("/view/$slug")({
  component: RouteComponent,
});

function RouteComponent() {
  const { slug } = Route.useParams();

  return (
    <div className="min-h-screen pb-8 pt-6">
      {/* Sticky nav — pt-6 on outer matches the top-6 initial offset visually */}
      <div className="lg:w-[80%] w-full mx-auto sticky top-6 z-50 px-4">
        <PublicHeader slug={slug} />
      </div>

      {/* Explicit mt-8 ensures a reliable space-y-8 gap below the header */}
      <div className="w-full lg:w-[80%] px-4 mx-auto space-y-8 mt-8">
        <OrganizationHeader slug={slug} />
        <Outlet />
      </div>
    </div>
  );
}
