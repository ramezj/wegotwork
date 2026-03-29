import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, ChevronsUpDown } from "lucide-react";
import type { Organization } from "generated/prisma/client";
import { Link } from "@tanstack/react-router";
import { SidebarMenuButton } from "../ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function getOrganizationInitial(name?: string | null) {
  return name?.trim().charAt(0).toUpperCase() || "O";
}

function formatOrganizationPlan(plan?: string | null) {
  const normalized = (plan || "FREE").toLowerCase().replace(/_/g, " ");
  return `${normalized.charAt(0).toUpperCase()}${normalized.slice(1)} plan`;
}

export function OrganizationSelector({
  organizations,
  currentOrganization,
}: {
  organizations?: Organization[];
  currentOrganization?: Organization;
}) {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild suppressHydrationWarning>
          <SidebarMenuButton
            size={"lg"}
            variant={"default"}
            className="border bg-background hover:bg-accent hover:text-accent-foreground"
          >
            <Avatar className="h-8 w-8 bg-primary rounded-none">
              <AvatarFallback className="bg-primary rounded-none text-primary-foreground font-light">
                {getOrganizationInitial(currentOrganization?.name)}
              </AvatarFallback>
            </Avatar>
            <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">
                {currentOrganization?.name || "Select Organization"}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {currentOrganization
                  ? formatOrganizationPlan(currentOrganization.plan)
                  : "Choose an organization"}
              </span>
            </div>
            <ChevronsUpDown className="ml-auto size-4 shrink-0" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="DropdownMenuContent">
          {organizations?.map((organization) => {
            const isSelected = organization.slug === currentOrganization?.slug;
            return (
              <DropdownMenuItem
                key={organization.id}
                asChild
                className="cursor-pointer"
              >
                <Link
                  to="/$slug"
                  params={{ slug: organization.slug }}
                  preload={false}
                >
                  <Avatar className="h-8 w-8 bg-primary rounded-none">
                    <AvatarFallback className="bg-primary rounded-none text-primary-foreground font-light">
                      {getOrganizationInitial(organization.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {organization.name}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {formatOrganizationPlan(organization.plan)}
                    </span>
                  </div>
                  {isSelected && <Check className="ml-2 h-4 w-4 shrink-0" />}
                </Link>
              </DropdownMenuItem>
            );
          })}
          <DropdownMenuSeparator />
          <Link to={"/dashboard"} preload={false}>
            <DropdownMenuItem className="justify-between flex cursor-pointer hover:bg-accent">
              All Organizations
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
