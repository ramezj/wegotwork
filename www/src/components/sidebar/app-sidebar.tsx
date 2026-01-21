import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { Briefcase, HomeIcon, Users } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useLocation } from "@tanstack/react-router";
// import { Button } from "../ui/button";
import { Session } from "@/lib/auth";
import UserDropdown from "./user-dropdown";

export function AppSidebar({
  session,
  slug,
}: {
  session: Session;
  slug: string;
}) {
  type menuItem = {
    label: string;
    icon: React.ReactNode;
    href: string;
  };

  const menuItems: menuItem[] = [
    {
      label: "dashboard",
      icon: <HomeIcon />,
      href: `/${slug}`,
    },
    {
      label: "jobs",
      icon: <Briefcase />,
      href: `/${slug}/jobs`,
    },
    {
      label: "applicants",
      icon: <Users />,
      href: `/${slug}/applicants`,
    },
  ];

  const teamMenuItems: menuItem[] = [
    {
      label: "team",
      icon: <Users />,
      href: "/team",
    },
    {
      label: "members",
      icon: <Users />,
      href: "/members",
    },
  ];
  const location = useLocation();
  return (
    <Sidebar>
      <SidebarHeader className="h-(--header-height) border-b flex items-center align-middle justify-center">
        <SidebarMenu>
          <SidebarMenuItem className="items-center content-center text-center">
            {/* <Button variant={"outline"} className="w-full justify-between">
              {data?.organization?.name || "Select Organization"}
              <ArrowUpRight />
            </Button> */}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="space-y-2">
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          {menuItems.map((item, index) => {
            const isActive =
              item.label === "dashboard"
                ? location.pathname === item.href
                : location.pathname.includes(item.href);
            return (
              <SidebarMenuButton
                isActive={isActive}
                className="flex items-center gap-2 cursor-pointer"
                key={index}
                asChild
              >
                <Link to={item.href}>
                  {item.icon}
                  {item.label}
                </Link>
              </SidebarMenuButton>
            );
          })}
        </SidebarGroup>
        <SidebarGroup className="space-y-2">
          <SidebarGroupLabel>Organization</SidebarGroupLabel>
          {teamMenuItems.map((item, index) => {
            return (
              <SidebarMenuButton
                isActive={item.href === location.pathname}
                className="flex items-center gap-2 cursor-pointer"
                key={index}
                asChild
              >
                <Link to={item.href}>
                  {item.icon}
                  {item.label}
                </Link>
              </SidebarMenuButton>
            );
          })}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="h-(--footer-height) border-t flex items-center align-middle justify-center">
        <SidebarMenu>
          <SidebarMenuItem>
            <UserDropdown session={session} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
