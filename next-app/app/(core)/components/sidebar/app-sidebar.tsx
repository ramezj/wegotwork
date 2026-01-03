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
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenuAction,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Briefcase,
  ChevronDown,
  ChevronsUpDownIcon,
  ChevronUp,
  HomeIcon,
  Plus,
  User2,
  Users,
} from "lucide-react";
import UserDropdown from "./user-dropdown";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

export function AppSidebar({
  session,
  ...props
}: React.ComponentProps<typeof Sidebar> & { session: any }) {
  const pathname = usePathname();
  return (
    <Sidebar {...props}>
      <SidebarHeader className="h-(--header-height) border-b flex items-center align-middle justify-center">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton asChild>
                  <Button variant={"outline"}>
                    Select Workspace
                    <ChevronsUpDownIcon className="ml-auto" />
                  </Button>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                <DropdownMenuItem>
                  <span>Acme Inc</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Acme Corp.</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="space-y-2">
          {menuItems.map((item, index) => {
            return (
              <SidebarMenuButton
                isActive={item.href === pathname}
                className="flex items-center gap-2 cursor-pointer"
                key={index}
                asChild
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
