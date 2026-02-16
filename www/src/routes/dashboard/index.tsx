import { createFileRoute } from "@tanstack/react-router";
import { CreateOrganization } from "@/components/organization/create-organization";
import { getAllOrganizationsFn } from "@/features/services/organization/get-all-organizations";
import { useSuspenseQuery } from "@tanstack/react-query";
import { OrganizationCard } from "@/components/organization/organization-card";
import { Organization } from "generated/prisma/client";

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
  ssr: true,
});

function RouteComponent() {
  const { data } = useSuspenseQuery({
    queryFn: getAllOrganizationsFn,
    queryKey: ["organizations"],
  });

  const hasOrganizations = data?.organizations && data.organizations.length > 0;

  return (
    <div className="">
      {/* Hero Section */}
      <div className="border-b w-full bg-linear-to-b from-background to-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-3">
              <h1 className="text-3xl tracking-tight">Your Organizations</h1>
            </div>
            <div className="shrink-0">
              <CreateOrganization />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="space-y-6">
          {/* Stats Bar */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl tracking-tight">All Organizations</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {data.organizations.length}{" "}
                {data.organizations.length === 1
                  ? "organization"
                  : "organizations"}{" "}
                total
              </p>
            </div>
          </div>

          {/* Organizations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.organizations.map((organization) => (
              <OrganizationCard
                key={organization.id}
                organization={organization as Organization}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
