import { createFileRoute } from "@tanstack/react-router";
import DisplayCurrentOrganization from "@/components/dash/display-organization";
import { Suspense } from "react";

export const Route = createFileRoute("/(core)/_layout/dash")({
  component: RouteComponent,
});

function RouteComponent() {
  const { session } = Route.useRouteContext();
  return (
    <>
      <Suspense fallback={<>Loading</>}>
        <DisplayCurrentOrganization />
      </Suspense>
    </>
  );
}
