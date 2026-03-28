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
  const plan = organization?.plan || "FREE";
  const status = organization?.subscriptionStatus || "FREE";
  const isPremium = plan === "PREMIUM";
  const formattedStatus = status.toLowerCase().replace("_", " ");

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
              <p className="text-lg font-semibold">
                {isPremium ? "Premium" : "Free"}
              </p>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {isPremium
                ? "$50 per organization"
                : "Start free, then upgrade when your team needs more."}
            </p>
          </div>

          <div className="border p-4">
            <p className="text-xs font-semibold  text-muted-foreground">
              Subscription Status
            </p>
            <div className="mt-3">
              <Badge variant={isPremium ? "default" : "secondary"}>
                {formattedStatus}
              </Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {isPremium
                ? "Your organization has access to premium billing features."
                : "Your organization is currently using the free plan."}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {isPremium
                ? "Need changes to your subscription?"
                : "Ready to upgrade this organization?"}
            </p>
            <p className="text-sm text-muted-foreground">
              {isPremium
                ? "Manage billing and subscription details for this organization."
                : "Premium is billed at $50 per organization."}
            </p>
          </div>
          <Button asChild className="w-full sm:w-auto">
            <Link to="/pricing">
              {isPremium ? "View Plans" : "See Pricing"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
