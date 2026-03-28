import { createFileRoute } from "@tanstack/react-router";
import { BillingCard } from "@/components/billing/billing-card";
import { Layout } from "@/components/shared/layout";

export const Route = createFileRoute("/$slug/_layout/billing")({
  component: RouteComponent,
});

function RouteComponent() {
  const { slug } = Route.useParams();

  return (
    <Layout title="Billing">
      <BillingCard slug={slug} />
    </Layout>
  );
}
