import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";
import {
  CreditCard,
  GitBranch,
  BriefcaseBusiness,
  UsersRound,
  Folders,
  Building2,
  MapPinned,
} from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";
import { Session } from "@/features/auth/auth";
import UserDropdown from "./user-dropdown";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getAllOrganizationsFn } from "@/features/services/organization/get-all-organizations";
import { OrganizationSelector } from "./organization-selector";
import type { Organization } from "generated/prisma/client";

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
      label: "Jobs",
      icon: <BriefcaseBusiness />,
      href: `/${slug}/jobs`,
    },
    {
      label: "Candidates",
      icon: <UsersRound />,
      href: `/${slug}/candidates`,
    },
    {
      label: "Pipelines",
      icon: <GitBranch />,
      href: `/${slug}/pipelines`,
    },
  ];
  const categoryMenuItems: menuItem[] = [
    {
      label: "Categories",
      icon: <Folders />,
      href: `/${slug}/categories`,
    },
    {
      label: "Offices",
      icon: <MapPinned />,
      href: `/${slug}/offices`,
    },
  ];
  const teamMenuItems: menuItem[] = [
    {
      label: "Organization",
      icon: <Building2 />,
      href: `/${slug}/organization`,
    },
    {
      label: "Billing",
      icon: <CreditCard />,
      href: `/${slug}/billing`,
    },
    {
      label: "Team",
      icon: <UsersRound />,
      href: `/${slug}/team`,
    },
  ];

  const location = useLocation();
  const { isMobile, setOpenMobile } = useSidebar();

  // Clean, flawless matching based entirely on URL prefixes mapping to Sidebar paths seamlessly
  const isSidebarItemActive = (href: string) =>
    location.pathname === href || location.pathname.startsWith(`${href}/`);

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
    <Sidebar variant="sidebar">
      <SidebarHeader className="h-(--header-height) border-b flex items-center align-middle justify-center">
        <SidebarMenu className="">
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
        <SidebarGroup className="py-2">
          <SidebarMenu className="gap-1">
            {menuItems.map((item, index) => {
              return (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton
                    isActive={isSidebarItemActive(item.href)}
                    className="cursor-pointer hover:bg-background data-[active=true]:bg-background border border-transparent data-[active=true]:border-input data-[active=true]:border hover:border-input transition duration-100"
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
            {categoryMenuItems.map((item, index) => {
              return (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton
                    isActive={isSidebarItemActive(item.href)}
                    className="cursor-pointer hover:bg-background data-[active=true]:bg-background border border-transparent data-[active=true]:border-input data-[active=true]:border hover:border-input transition duration-100"
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
            {teamMenuItems.map((item, index) => {
              return (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton
                    isActive={isSidebarItemActive(item.href)}
                    className="cursor-pointer hover:bg-background data-[active=true]:bg-background border border-transparent data-[active=true]:border-input data-[active=true]:border hover:border-input transition duration-100"
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
      <SidebarFooter className="h-(--footer-height) border-t flex items-center align-middle justify-center ">
        <SidebarMenu>
          <SidebarMenuItem>
            <UserDropdown session={session} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
