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
import { ArrowUpRight, Briefcase, HomeIcon, Users } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useLocation } from "@tanstack/react-router";
import UserDropdown from "./user-dropdown";
import { Session } from "@/lib/auth";
import { OrganizationSelector } from "./organization-selector";
import { useQuery } from "@tanstack/react-query";
import { getDashFn } from "@/features/dash/get-dash";
import { Organization } from "generated/prisma/client";
import { Button } from "../ui/button";

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
      href: `/${slug}/dash`,
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
  const { data } = useQuery({
    queryKey: ["dash", slug],
    queryFn: () => getDashFn({ data: { slug: slug } }),
  });
  return (
    <Sidebar>
      <SidebarHeader className="h-(--header-height) border-b flex items-center align-middle justify-center">
        <SidebarMenu>
          <SidebarMenuItem className="items-center content-center text-center">
            {/* <OrganizationSelector
              organizations={data?.organizations as Organization[]}
              currentOrganization={data?.organization as Organization}
            /> */}
            <Button variant={"outline"} className="w-full justify-between">
              {data?.organization?.name || "Select Organization"}
              <ArrowUpRight />
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="space-y-2">
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          {menuItems.map((item, index) => {
            return (
              <SidebarMenuButton
                isActive={location.pathname === item.href}
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
