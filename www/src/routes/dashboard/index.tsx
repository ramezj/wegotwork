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
  return (
    <div>
      <main className="p-4 items-center content-center justify-center text-center">
        <h1 className="text-2xl">Your Organizations</h1>
      </main>
      <CreateOrganization />

      <div className="flex flex-wrap gap-4">
        {data?.organizations.map((organization) => {
          return (
            <OrganizationCard organization={organization as Organization} />
          );
        })}
      </div>
    </div>
  );
}
