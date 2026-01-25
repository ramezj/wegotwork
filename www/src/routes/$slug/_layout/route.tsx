import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getSession } from "@/server/auth/server-session";
import { getAllOrganizationsFn } from "@/server/organization/get-all-organizations";
import { getOrganizationBySlugFn } from "@/server/organization/get-by-slug";
import { AppHeader } from "@/components/sidebar/app-header";
import { Loader } from "lucide-react";
import { Suspense } from "react";

export const Route = createFileRoute("/$slug/_layout")({
  component: RouteComponent,
  beforeLoad: async ({ context, params }) => {
    const session = await getSession();
    if (!session?.user) {
      throw redirect({ to: "/" });
    }
    await context.queryClient.prefetchQuery({
      queryKey: ["organizations"],
      queryFn: getAllOrganizationsFn,
      staleTime: 60 * 60 * 1000,
    });

    // const data = context.queryClient.fetchQuery({
    //   queryKey: ["organization", params.slug],
    //   queryFn: () => getOrganizationBySlugFn({ data: { slug: params.slug } }),
    //   staleTime: 60 * 60 * 1000,
    // });

    // if (!data?.organization) {
    //   throw redirect({ to: "/dashboard" });
    // }

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
          <AppHeader />
          <main className="flex flex-1 flex-col p-4">
            <Suspense
              fallback={
                <div className="flex h-full items-center justify-center min-h-[400px]">
                  <Loader className="animate-spin size-8 text-muted-foreground" />
                </div>
              }
            >
              <Outlet />
            </Suspense>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
