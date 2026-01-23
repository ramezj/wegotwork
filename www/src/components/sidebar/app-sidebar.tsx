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
  SidebarSeparator,
} from "../ui/sidebar";
import { Briefcase, HomeIcon, Loader, Users } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useLocation } from "@tanstack/react-router";
// import { Button } from "../ui/button";
import { Session } from "@/lib/auth";
import UserDropdown from "./user-dropdown";
import { useQuery } from "@tanstack/react-query";
import { getAllOrganizationsFn } from "@/server/organization/get-all-organizations";
import { OrganizationSelector } from "./organization-selector";
import { Organization } from "generated/prisma/client";

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
  const { data, isPending } = useQuery({
    queryKey: ["organizations"],
    queryFn: getAllOrganizationsFn,
    staleTime: 60 * 60 * 1000,
  });
  return (
    <Sidebar>
      <SidebarHeader className="h-(--header-height) border-b flex items-center align-middle justify-center">
        <SidebarMenu>
          <SidebarMenuItem className="items-center content-center text-center">
            {isPending && <Loader className="animate-spin" />}
            {!isPending && (
              <OrganizationSelector
                organizations={data?.organizations as Organization[]}
                currentOrganization={
                  data?.organizations.find(
                    (org) => org.slug === slug,
                  ) as Organization
                }
              />
            )}
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
                className="flex items-center gap-2 cursor-pointer font-medium"
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
