import { createFileRoute } from "@tanstack/react-router";
import { BillingCard } from "@/components/billing/billing-card";
import { Layout } from "@/components/shared/layout";
import { organizationTeamQueryOptions } from "@/features/queries/organization";
import { useSuspenseQuery } from "@tanstack/react-query";
import { buildSeo } from "@/lib/seo";

export const Route = createFileRoute("/$slug/_layout/billing")({
  component: RouteComponent,
  head: () => {
    return buildSeo({
      title: "Billing",
      description: "Manage billing",
    });
  },
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(
      organizationTeamQueryOptions(params.slug),
    );
  },
});

function RouteComponent() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(organizationTeamQueryOptions(slug));

  if (data.currentMemberRole !== "owner") {
    return (
      <Layout variant="header" title="Billing">
        <div className="flex min-h-[360px] items-center justify-center border p-6">
          <div className="max-w-md space-y-2 text-center">
            <p className="text-sm font-medium text-muted-foreground">
              Owner Access Only
            </p>
            <h2 className="text-2xl font-semibold tracking-tight">
              Only organization owners can access billing.
            </h2>
            <p className="text-sm text-muted-foreground">
              Please contact your organization owner if you need help with plan
              changes or subscription management.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout variant="header" title="Billing">
      <BillingCard slug={slug} />
    </Layout>
  );
}
