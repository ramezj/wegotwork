import { createFileRoute, redirect } from "@tanstack/react-router";
import Header from "@/components/shared/header";
import { CreateOrganization } from "@/components/organization/create-organization";
import { getAllOrganizationsFn } from "@/server/organization/get-all-organizations";
import { getSession } from "@/server/auth/server-session";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { OrganizationCard } from "@/components/organization/organization-card";
import { Organization } from "generated/prisma/client";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
  pendingComponent: () => (
    <div className="flex h-full items-center justify-center min-h-[400px]">
      <p>we are loading your organizations</p>
    </div>
  ),
  pendingMinMs: 500,
  pendingMs: 0,
  ssr: true,
  beforeLoad: async ({ context }) => {
    const session = await getSession();
    if (!session?.user) {
      throw redirect({ to: "/" });
    }
    // await context.queryClient.prefetchQuery({
    //   queryFn: getAllOrganizationsFn,
    //   queryKey: ["organizations"],
    // });
    return { session };
  },
});

function RouteComponent() {
  const { session } = Route.useRouteContext();
  const { data } = useSuspenseQuery({
    queryFn: getAllOrganizationsFn,
    queryKey: ["organizations"],
  });
  return (
    <div>
      <Header session={session} />
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
