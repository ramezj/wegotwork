import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Suspense } from "react";
import { OrganizationHeader } from "@/components/organization/organization-header";
import { PublicHeader } from "@/components/public-header";

export const Route = createFileRoute("/view/$slug")({
  component: RouteComponent,
});

function RouteComponent() {
  const { slug } = Route.useParams();

  return (
    <div className="flex flex-col min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <div className="lg:w-[70%] w-full mx-auto sticky top-5 z-50 px-4">
          <PublicHeader slug={slug} />
        </div>
        <main className="flex-1 flex flex-col items-center py-12 space-y-4 w-full">
          <div className="w-full lg:w-[70%] px-4 mx-auto space-y-4">
            <OrganizationHeader slug={slug} />
            <Outlet />
          </div>
        </main>
      </Suspense>
    </div>
  );
}
