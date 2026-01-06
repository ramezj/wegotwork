import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/(core)/_components/sidebar/app-sidebar";
import { AppHeader } from "@/app/(core)/_components/sidebar/app-header";
import { useUser } from "@/lib/use-user";
import { redirect } from "next/navigation";
import { getCurrentOrganizationAction } from "@/actions/organization/get-current-organization";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
  useQuery,
} from "@tanstack/react-query";
import getAllOrganizationsAction from "@/actions/organization/get-all-organizations";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();
  const session = await useUser();
  if (!session) {
    redirect("/");
  }
  if (!session.session.activeOrganizationId) {
    redirect("/organization/create");
  }
  await queryClient.prefetchQuery({
    queryKey: ["organizations"],
    queryFn: getAllOrganizationsAction,
  });
  await queryClient.prefetchQuery({
    queryKey: ["activeOrganization"],
    queryFn: getCurrentOrganizationAction,
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
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
        <AppSidebar session={session} />
        <SidebarInset>
          <AppHeader />
          <div className="flex flex-1 flex-col p-4">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </HydrationBoundary>
  );
}
