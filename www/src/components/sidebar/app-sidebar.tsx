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
  useSidebar,
} from "../ui/sidebar";
import {
  Briefcase,
  Building,
  CreditCard,
  HomeIcon,
  Loader,
  Users,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useLocation } from "@tanstack/react-router";
// import { Button } from "../ui/button";
import { Session } from "@/features/auth/auth";
import UserDropdown from "./user-dropdown";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { getAllOrganizationsFn } from "@/features/services/organization/get-all-organizations";
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
      label: "Dashboard",
      icon: <HomeIcon />,
      href: `/${slug}`,
    },
    {
      label: "Jobs",
      icon: <Briefcase />,
      href: `/${slug}/jobs`,
    },
    {
      label: "Applicants",
      icon: <Users />,
      href: `/${slug}/applicants`,
    },
  ];
  const categoryMenuItems: menuItem[] = [
    {
      label: "Categories",
      icon: <Building />,
      href: `/${slug}/categories`,
    },
  ];
  const teamMenuItems: menuItem[] = [
    {
      label: "Organization",
      icon: <Building />,
      href: `/${slug}/organization`,
    },
    {
      label: "Billing",
      icon: <CreditCard />,
      href: `/${slug}/billing`,
    },
    {
      label: "Team",
      icon: <Users />,
      href: `/${slug}/team`,
    },
  ];

  const location = useLocation();
  const { isMobile, setOpenMobile } = useSidebar();
  const handleItemClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };
  const { data } = useSuspenseQuery({
    queryKey: ["organizations"],
    queryFn: getAllOrganizationsFn,
    staleTime: 60 * 60 * 1000,
  });
  return (
    <Sidebar>
      <SidebarHeader className="h-(--header-height) border-b flex items-center align-middle justify-center">
        <SidebarMenu>
          <SidebarMenuItem className="items-center content-center text-center">
            <OrganizationSelector
              organizations={data?.organizations as Organization[]}
              currentOrganization={
                data?.organizations.find(
                  (org) => org.slug === slug,
                ) as Organization
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="space-y-1">
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            {menuItems.map((item, index) => {
              const isActive =
                item.label === "Dashboard"
                  ? location.pathname === item.href
                  : location.pathname.includes(item.href);
              return (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton
                    isActive={isActive}
                    className="flex items-center gap-2 py-4 cursor-pointer transition duration-200 font-medium"
                    onClick={handleItemClick}
                    asChild
                  >
                    <Link to={item.href}>
                      {item.icon}
                      {item.label}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup className="space-y-1">
          <SidebarGroupLabel>Categories</SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            {categoryMenuItems.map((item, index) => {
              return (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton
                    isActive={item.href === location.pathname}
                    className="flex items-center gap-2 py-4 cursor-pointer transition duration-200 font-medium"
                    onClick={handleItemClick}
                    asChild
                  >
                    <Link to={item.href}>
                      {item.icon}
                      {item.label}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup className="space-y-1">
          <SidebarGroupLabel>Organization</SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            {teamMenuItems.map((item, index) => {
              return (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton
                    isActive={item.href === location.pathname}
                    className="flex items-center gap-2 py-4 cursor-pointer transition duration-200 font-medium border border-transparent hover:bg-input/30 hover:border-input active:bg-input/30 active:border-input focus:bg-input/30 focus:border-input data-[active=true]:bg-input/30 data-[active=true]:border data-[active=true]:border-input data-[active=true]:text-sidebar-accent-foreground"
                    onClick={handleItemClick}
                    asChild
                  >
                    <Link to={item.href}>
                      {item.icon}
                      {item.label}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
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
