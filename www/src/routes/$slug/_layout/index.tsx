import { createFileRoute } from "@tanstack/react-router";
import { StatisticsCards } from "@/components/dashboard/statistics";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import { organizationBySlugQueryOptions } from "@/queries/organization";
import { Layout, LoadingLayout } from "@/components/shared/layout";
import { RecentApplicants } from "@/components/dashboard/recent-applicants";

export const Route = createFileRoute("/$slug/_layout/")({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    context.queryClient.prefetchQuery(
      organizationBySlugQueryOptions(params.slug),
    );
  },
  head: () => ({
    meta: [{ title: "Dashboard", content: "Dashboard" }, { name: "Dashboard" }],
  }),
});

function RouteComponent() {
  const { session } = Route.useRouteContext();
  const { slug } = Route.useParams();
  return (
    <Suspense
      fallback={
        <LoadingLayout
          title="Welcome back,"
          boldText={session.user.name}
          primaryButton={<Button disabled>Preview</Button>}
        />
      }
    >
      <Layout
        title="Welcome back,"
        boldText={session.user.name}
        primaryButton={<Button>Preview</Button>}
      >
        <div className="flex flex-col gap-6">
          <div className="flex lg:flex-row flex-col gap-4">
            <StatisticsCards slug={slug} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-12">
              <RecentApplicants slug={slug} />
            </div>
          </div>
        </div>
      </Layout>
    </Suspense>
  );
}
