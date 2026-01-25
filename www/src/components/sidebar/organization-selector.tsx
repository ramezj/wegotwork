import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, ChevronsUpDown } from "lucide-react";
import { Organization } from "generated/prisma/client";
import { Link } from "@tanstack/react-router";

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
              <Link
                to="/$slug"
                params={{ slug: organization.slug }}
                viewTransition
              >
                <DropdownMenuItem
                  className="justify-between flex cursor-pointer"
                  key={organization.id}
                >
                  {organization.name}
                  {organization.slug === currentOrganization?.slug && (
                    <Check className="ml-2 h-4 w-4" />
                  )}
                </DropdownMenuItem>
              </Link>
            );
          })}
          <DropdownMenuSeparator />
          <Link viewTransition to={"/dashboard"}>
            <DropdownMenuItem className="justify-between flex cursor-pointer">
              All Organizations
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
