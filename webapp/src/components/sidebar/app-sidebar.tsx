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
} from "@/components/ui/sidebar";
import { Briefcase, HomeIcon, Users } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useLocation } from "@tanstack/react-router";
import UserDropdown from "./user-dropdown";
import { Session } from "@/lib/auth";
// import { Button } from "../ui/button";
// import { useQuery } from "@tanstack/react-query";
// import { getDashFn } from "@/features/dash/get-dash";

export function AppSidebar({ session }: { session: Session }) {
  type menuItem = {
    label: string;
    icon: React.ReactNode;
    href: string;
  };

  const menuItems: menuItem[] = [
    {
      label: "Dashboard",
      icon: <HomeIcon />,
      href: "/dash",
    },
    {
      label: "Jobs",
      icon: <Briefcase />,
      href: "/jobs",
    },
    {
      label: "Applicants",
      icon: <Users />,
      href: "/applicants",
    },
  ];

  const teamMenuItems: menuItem[] = [
    {
      label: "Team",
      icon: <Users />,
      href: "/team",
    },
    {
      label: "Members",
      icon: <Users />,
      href: "/members",
    },
  ];
  const location = useLocation();
  // const { data } = useQuery({
  //   queryKey: ["dash"],
  //   queryFn: getDashFn,
  // });
  return (
    <Sidebar>
      <SidebarHeader className="h-(--header-height) border-b flex items-center align-middle justify-center">
        <SidebarMenu>
          <SidebarMenuItem className="items-center content-center text-center">
            {/* <Button variant={"outline"} className="w-full">
              {data?.organization?.name}
            </Button> */}
            <span className="font-base">wegotwork</span>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="space-y-2">
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          {menuItems.map((item, index) => {
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
