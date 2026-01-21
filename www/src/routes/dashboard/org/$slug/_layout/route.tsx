import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getSession } from "@/server/auth/server-session";

export const Route = createFileRoute("/dashboard/org/$slug/_layout")({
  component: RouteComponent,
  beforeLoad: async () => {
    const session = await getSession();
    if (!session?.user) {
      throw redirect({ to: "/" });
    }
    return { session };
  },
});

function RouteComponent() {
  return (
    <>
      <SidebarProvider>
        <AppSidebar
          slug={Route.useParams().slug}
          session={Route.useRouteContext().session}
        />
        <SidebarInset>
          <div className="flex flex-1 flex-col p-4">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
