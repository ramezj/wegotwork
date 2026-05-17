import { LoadingLayout } from "@/components/shared/layout";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute("/$slug/_layout/jobs")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Suspense fallback={<LoadingLayout title="" />}>
      <Outlet />
    </Suspense>
  );
}
