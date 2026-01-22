import { createFileRoute, redirect } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";
import Header from "@/components/shared/header";
import { CreateOrganization } from "@/components/organization/create-organization";

export const Route = createFileRoute("/dashboard/organizations")({
  component: RouteComponent,
  ssr: true,
});

function RouteComponent() {
  const { data: session, isPending } = authClient.useSession();
  if (session?.user === null) {
    throw redirect({ to: "/" });
  }
  return (
    <div>
      <Header session={session} isPending={isPending} />
      <main className="p-4 items-center content-center justify-center text-center">
        <h1 className="text-2xl">Your Organizations</h1>
      </main>
      <CreateOrganization />
    </div>
  );
}
