import { createFileRoute } from "@tanstack/react-router";
import { Loader } from "lucide-react";
import { Suspense } from "react";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export const Route = createFileRoute("/$slug/_layout/")({
  component: RouteComponent,
  head: () => ({
    meta: [{ title: "Dashboard", content: "Dashboard" }, { name: "Dashboard" }],
  }),
});

function RouteComponent() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center min-h-[400px]">
          <Loader className="animate-spin size-8 text-muted-foreground" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
