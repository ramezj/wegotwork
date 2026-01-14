import { createFileRoute, Outlet } from "@tanstack/react-router";
import { getServerSession } from "@/lib/get-server-session";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";

export const Route = createFileRoute("/(core)/_layout")({
  ssr: true,
  component: RouteComponent,
  beforeLoad: async () => {
    const session = await getServerSession();
    return { session };
  },
});

function RouteComponent() {
  const ctx = Route.useRouteContext();
  return (
    <>
      <SidebarProvider>
        <AppSidebar session={ctx.session} />
        <main className="">
          <Outlet />
        </main>
      </SidebarProvider>
    </>
  );
}
