import { AppSidebar } from "@/components/testing/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Session } from "@/lib/auth-client"
import { MenuIcon } from "lucide-react"
import { CustomTrigger } from "@/components/testing/sidebar-trigger"

export default async function Layout({ children }: { children: ReactNode }) {
    const session:Session | null = await auth.api.getSession({
      headers: await headers()
    })
    if(!session) {
        redirect('/');
    }
    if(session.user.currentOrganizationId === null) {
        redirect('/dashboard')
    }
  return (
    <SidebarProvider>
      <AppSidebar session={session as Session}/>
      <SidebarInset>
        <header className="flex border-b border-white/20 h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="items-center gap-2 px-4">
            <CustomTrigger />
          </div>
          <div className="flex gap-2 ml-auto mr-2">
            <Button className="" variant="default">
              Feedback
            </Button>
          </div>
        </header>
        <div className="p-6">
            {children}
        </div>  
      </SidebarInset>
    </SidebarProvider>
  )
}
