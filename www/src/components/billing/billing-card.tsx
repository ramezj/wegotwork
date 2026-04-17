import { useSuspenseQuery } from "@tanstack/react-query";
import { organizationBySlugQueryOptions } from "@/features/queries/organization";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ArrowRight, Building2, CreditCard } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function BillingCard({ slug }: { slug: string }) {
  const { data } = useSuspenseQuery(organizationBySlugQueryOptions(slug));
  const organization = data.organization;
  const plan = organization?.plan;
  const planName = plan?.name || "Free";
  const isPaidPlan = plan?.code !== "free";

  return (
    <Card>
      <CardHeader className="flex flex-row items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-secondary">
          <CreditCard className="h-5 w-5 text-secondary-foreground" />
        </div>
        <div className="space-y-1">
          <CardTitle className="text-base">Organization Billing</CardTitle>
          <CardDescription>
            Billing is managed per organization, not per individual user.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="border p-4">
            <p className="text-xs font-semibold text-muted-foreground">
              Current Plan
            </p>
            <div className="mt-3 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <p className="text-lg font-semibold">{planName}</p>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {isPaidPlan
                ? "This organization is on a paid Lunics plan."
                : "Start free, then upgrade when your team needs more."}
            </p>
          </div>

          <div className="border p-4">
            <p className="text-xs font-semibold  text-muted-foreground">
              Plan Status
            </p>
            <div className="mt-3">
              <Badge variant={isPaidPlan ? "default" : "secondary"}>
                {plan?.isActive ? "active" : "inactive"}
              </Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {isPaidPlan
                ? "Your organization is linked to an active paid plan record."
                : "Your organization is currently using the free plan."}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {isPaidPlan
                ? "Need changes to your subscription?"
                : "Ready to upgrade this organization?"}
            </p>
            <p className="text-sm text-muted-foreground">
              {isPaidPlan
                ? "Manage billing and subscription details for this organization."
                : "See the current public pricing options for Lunics plans."}
            </p>
          </div>
          <Button asChild className="w-full sm:w-auto">
            <Link to="/pricing">
              {isPaidPlan ? "View Plans" : "See Pricing"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
