import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/(core)/components/sidebar/app-sidebar";
import { AppHeader } from "@/app/(core)/components/sidebar/app-header";
import { useUser } from "@/lib/use-user";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await useUser();
  if (!session) {
    redirect("/");
  }
  return (
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
  );
}
