import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, ChevronsUpDown } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Organization } from "generated/prisma/client";

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
          <Button variant={"outline"} className="w-full justify-between">
            {currentOrganization?.name || "Select Organization"}
            <ChevronsUpDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="DropdownMenuContent">
          {organizations?.map((organization) => {
            return (
              <DropdownMenuItem
                className="justify-between flex"
                key={organization.id}
                asChild
              >
                <Link to={`/$slug/dash`} params={{ slug: organization.slug }}>
                  {organization.name}
                  {organization.id === currentOrganization?.id && (
                    <Check className="ml-2 h-4 w-4" />
                  )}
                </Link>
              </DropdownMenuItem>
            );
          })}
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/organization/manage">All Organizations</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/organization/create">Create Organization</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
