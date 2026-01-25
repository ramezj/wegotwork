import { createFileRoute } from "@tanstack/react-router";
import { Loader } from "lucide-react";

import { Suspense } from "react";
import { JobsContent } from "@/components/job/jobs-content";

export const Route = createFileRoute("/$slug/_layout/jobs")({
  component: RouteComponent,
});

function RouteComponent() {
  return <JobsContent />;
}
