import { Session } from "@/features/auth/auth";
import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "../ui/sidebar";
import { authClient } from "@/features/auth/auth-client";
import { Menu } from "lucide-react";
import { useSidebar } from "../ui/sidebar";

const navItems = ["Features", "Demo", "Pricing"];

function CustomTrigger() {
  const { toggleSidebar } = useSidebar();
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-10 w-10"
      onClick={toggleSidebar}
    >
      <Menu className="h-5 w-5" />
      <span className="sr-only">Toggle Menu</span>
    </Button>
  );
}

export function NavSidebar({ session }: { session: Session | null }) {
  return (
    <SidebarProvider defaultOpen={false} className="min-h-0 w-auto">
      <CustomTrigger />

      <Sidebar side="right">
        <SidebarHeader className="border-b px-4 h-16 flex items-center justify-center">
          <span className="font-bold text-base">Hirelou</span>
        </SidebarHeader>

        <SidebarContent className="px-2 py-4">
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item}>
                <SidebarMenuButton asChild size="lg">
                  <Link to="/">{item}</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="border-t p-4">
          {session?.user ? (
            <Button variant="default" asChild className="w-full font-semibold">
              <Link to="/dashboard">Open Dashboard</Link>
            </Button>
          ) : (
            <Button
              className="w-full font-semibold"
              onClick={() => {
                authClient.signIn.social({
                  provider: "google",
                  callbackURL: "/",
                });
              }}
            >
              Sign In
            </Button>
          )}
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}
