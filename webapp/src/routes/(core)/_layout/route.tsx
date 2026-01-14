import { createFileRoute, Outlet } from "@tanstack/react-router";
import { getServerSession } from "@/lib/get-server-session";
import { ModeToggle } from "@/components/theme-toggle";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";

export const Route = createFileRoute("/(core)/_layout")({
  component: RouteComponent,
  beforeLoad: async () => {
    const session = await getServerSession();
    return { session };
  },
});

function RouteComponent() {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <Outlet />
      </SidebarProvider>
    </>
  );
}
