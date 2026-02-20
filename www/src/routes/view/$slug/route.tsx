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
      <PublicHeader slug={slug} />
      <Suspense fallback={<div>Loading...</div>}>
        <main className="flex-1 flex flex-col items-center py-12 px-4 space-y-4 w-full">
          <div className="w-full max-w-6xl mx-auto flex flex-col items-center space-y-4">
            <OrganizationHeader slug={slug} />
            <Outlet />
          </div>
        </main>
      </Suspense>
    </div>
  );
}
