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
          <Button
            variant={"outline"}
            className="w-full justify-between border-input"
          >
            {currentOrganization?.name || "Select Organization"}
            <ChevronsUpDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="DropdownMenuContent">
          {organizations?.map((organization) => {
            const isSelected = organization.slug === currentOrganization?.slug;
            return (
              <Link
                key={organization.id}
                to="/$slug"
                params={{ slug: organization.slug }}
                preload={false}
              >
                <DropdownMenuItem
                  className="justify-between flex cursor-pointer"
                  selected={isSelected}
                >
                  {organization.name}
                  {isSelected && <Check className="ml-2 h-4 w-4" />}
                </DropdownMenuItem>
              </Link>
            );
          })}
          <DropdownMenuSeparator />
          <Link to={"/dashboard"} preload={false}>
            <DropdownMenuItem className="justify-between flex cursor-pointer">
              All Organizations
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
