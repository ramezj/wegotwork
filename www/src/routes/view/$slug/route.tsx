import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { viewOrganizationBySlugQueryOptions } from "@/features/queries/organization";
import { Suspense } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { OrganizationHeader } from "@/components/organization/organization-header";

export const Route = createFileRoute("/view/$slug")({
  component: RouteComponent,
});

function RouteComponent() {
  const { slug } = Route.useParams();
  return (
    <Suspense fallback={<>loading...</>}>
      <main className="flex flex-col items-center justify-center py-12 px-4 space-y-4 w-full max-w-6xl mx-auto">
        <OrganizationHeader slug={Route.useParams().slug} />
        <Outlet />
      </main>
    </Suspense>
  );
}
