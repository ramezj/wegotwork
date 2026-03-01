import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getSession } from "@/features/auth/server-session";
import { AppHeader } from "@/components/sidebar/app-header";
import { Suspense } from "react";
import { LoadingLayout } from "@/components/shared/layout";
import { organizationsQueryOptions } from "@/features/queries/organization";

export const Route = createFileRoute("/$slug/_layout")({
  component: RouteComponent,

  beforeLoad: async ({ context }) => {
    const session = await getSession();
    if (!session?.user) {
      throw redirect({ to: "/" });
    }
    await context.queryClient.ensureQueryData(organizationsQueryOptions());
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
            <Suspense fallback={<LoadingLayout title="" />}>
              <Outlet />
            </Suspense>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
