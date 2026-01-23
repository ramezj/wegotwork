import { createFileRoute, redirect } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";
import Header from "@/components/shared/header";
import { CreateOrganization } from "@/components/organization/create-organization";
import { getAllOrganizationsFn } from "@/server/organization/get-all-organizations";
import { getSession } from "@/server/auth/server-session";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { OrganizationCard } from "@/components/organization/organization-card";
import { Organization } from "generated/prisma/client";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
  ssr: true,
  beforeLoad: async ({ context }) => {
    const session = await getSession();
    if (!session?.user) {
      throw redirect({ to: "/" });
    }
    await context.queryClient.prefetchQuery({
      queryFn: getAllOrganizationsFn,
      queryKey: ["organizations"],
    });
  },
});

function RouteComponent() {
  const { data: session, isPending } = authClient.useSession();
  const { data, isLoading } = useQuery({
    queryFn: getAllOrganizationsFn,
    queryKey: ["organizations"],
  });
  return (
    <div>
      <Header session={session} isPending={isPending} />
      <main className="p-4 items-center content-center justify-center text-center">
        <h1 className="text-2xl">Your Organizations</h1>
      </main>
      <CreateOrganization />
      {isLoading && <Loader className="animate-spin" />}
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
