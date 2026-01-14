import { createFileRoute, Outlet } from "@tanstack/react-router";
import { getServerSession } from "@/lib/get-server-session";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { AppHeader } from "@/components/sidebar/app-header";

export const Route = createFileRoute("/(core)/_layout")({
  ssr: true,
  component: RouteComponent,
  beforeLoad: async () => {
    const session = await getServerSession();
    return { session };
  },
});

function RouteComponent() {
  const context = Route.useRouteContext();
  return (
    <>
      <SidebarProvider
        defaultOpen={true}
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "3.5rem",
            "--footer-height": "3.5rem",
          } as React.CSSProperties
        }
      >
        <AppSidebar session={context.session} />
        <SidebarInset>
          <AppHeader />
          <div className="flex flex-1 flex-col p-4">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
