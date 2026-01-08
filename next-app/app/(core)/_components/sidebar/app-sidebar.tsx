"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Briefcase, ChevronsUpDownIcon, HomeIcon, Users } from "lucide-react";
import UserDropdown from "./user-dropdown";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { OrganizationSelector } from "./organization-selector";
import { Organization } from "@/src/generated/prisma/client";
import { useQuery } from "@tanstack/react-query";
import { getCurrentOrganizationAction } from "@/actions/organization/get-current-organization";

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

export function AppSidebar({
  session,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  session: any;
}) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  const handleMenuClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };
  const { data, isLoading, isError } = useQuery({
    queryKey: ["activeOrganization"],
    queryFn: getCurrentOrganizationAction,
  });
  return (
    <Sidebar {...props}>
      <SidebarHeader className="h-(--header-height) border-b flex items-center align-middle justify-center">
        <SidebarMenu>
          <SidebarMenuItem>
            <OrganizationSelector organization={data as Organization} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="space-y-2">
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          {menuItems.map((item, index) => {
            return (
              <SidebarMenuButton
                isActive={item.href === pathname}
                className="flex items-center gap-2 cursor-pointer"
                key={index}
                asChild
                onClick={handleMenuClick}
              >
                <Link href={item.href}>
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
                isActive={item.href === pathname}
                className="flex items-center gap-2 cursor-pointer"
                key={index}
                asChild
                onClick={handleMenuClick}
              >
                <Link href={item.href}>
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
