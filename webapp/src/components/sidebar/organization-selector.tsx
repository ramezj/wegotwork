import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, ChevronsUpDown } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Organization } from "generated/prisma/client";
import { setActiveOrganizationFn } from "@/features/dash/set-active-organization";
import { useMutation } from "@tanstack/react-query";

export function OrganizationSelector({
  organizations,
  currentOrganization,
  slug,
}: {
  organizations?: Organization[];
  currentOrganization?: Organization;
  slug: string;
}) {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: setActiveOrganizationFn,
    onSuccess: (_data, variables) => {
      navigate({
        to: "/$slug/dash",
        params: { slug: variables.data.organizationSlug },
      });
    },
  });

  const handleOrganizationSwitch = (organization: Organization) => {
    mutation.mutate({
      data: {
        organizationSlug: organization.slug,
        organizationId: organization.id,
      },
    });
  };

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
                className="justify-between flex cursor-pointer"
                key={organization.id}
                onClick={() => handleOrganizationSwitch(organization)}
                disabled={mutation.isPending}
              >
                {organization.name}
                {organization.slug === currentOrganization?.slug && (
                  <Check className="ml-2 h-4 w-4" />
                )}
              </DropdownMenuItem>
            );
          })}
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/organization/manage">All Organizations</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
