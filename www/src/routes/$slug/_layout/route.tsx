import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getSession } from "@/server/auth/server-session";
import { getAllOrganizationsFn } from "@/server/organization/get-all-organizations";
import { AppHeader } from "@/components/sidebar/app-header";

export const Route = createFileRoute("/$slug/_layout")({
  component: RouteComponent,

  beforeLoad: async ({ context }) => {
    const session = await getSession();
    if (!session?.user) {
      throw redirect({ to: "/" });
    }
    await context.queryClient.prefetchQuery({
      queryKey: ["organizations"],
      queryFn: getAllOrganizationsFn,
    });
    return { session };
  },
});

function RouteComponent() {
  const { slug } = Route.useParams();
  return (
    <>
      <SidebarProvider>
        <AppSidebar slug={slug} session={Route.useRouteContext().session} />
        <SidebarInset>
          <AppHeader />
          <main className="flex flex-1 flex-col p-4">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
