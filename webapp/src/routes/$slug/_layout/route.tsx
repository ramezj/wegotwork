import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getServerSession } from "@/lib/get-server-session";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { AppHeader } from "@/components/sidebar/app-header";
import { getDashFn } from "@/features/dash/get-dash";

export const Route = createFileRoute("/$slug/_layout")({
  ssr: true,
  component: RouteComponent,
  beforeLoad: async ({ context, params }) => {
    const session = await getServerSession();
    if (
      session.session.activeOrganizationId === null ||
      !session.session.activeOrganizationId
    ) {
      throw redirect({ to: "/organization/manage" });
    }
    await context.queryClient.prefetchQuery({
      queryKey: ["dash"],
      queryFn: () =>
        getDashFn({
          data: { slug: params.slug },
        }),
    });
    return { session };
  },
});

function RouteComponent() {
  const context = Route.useRouteContext();
  const params = Route.useParams();
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
        <AppSidebar session={context.session} slug={params.slug} />
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
