import { createFileRoute } from "@tanstack/react-router";
import DisplayCurrentOrganization from "@/components/dash/display-organization";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getDashFn } from "@/features/dash/get-dash";
import DashSkeleton from "@/components/dash/dash-skeleton";

export const Route = createFileRoute("/$slug/_layout/dash")({
  component: RouteComponent,
  pendingComponent: DashSkeleton,
});

function RouteComponent() {
  const { data: organization } = useSuspenseQuery({
    queryKey: ["dash", Route.useParams().slug],
    queryFn: () =>
      getDashFn({
        data: { slug: Route.useParams().slug },
      }),
  });
  return (
    <>
      <DisplayCurrentOrganization
        organization={organization?.organization!}
        // slug={params.slug}
      />
    </>
  );
}
