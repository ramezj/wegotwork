import { getAllOrganizationsFn } from "@/features/organization/actions/get-all-organizations";
import { getServerSession } from "@/lib/get-server-session";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/organization")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const session = await getServerSession();
    if (!session.user) {
      return {
        redirect: "/login",
      };
    }
    await context.queryClient.prefetchQuery({
      queryKey: ["organizations"],
      queryFn: getAllOrganizationsFn,
    });
    return {
      session,
    };
  },
});

function RouteComponent() {
  return (
    <>
      <main>
        <Outlet />
      </main>
    </>
  );
}
