"use client";
import { Session } from "better-auth";
import { Button } from "@/components/ui/button";
import { Organization } from "generated/prisma/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, ChevronsUpDown } from "lucide-react";
import { getAllOrganizationsFn } from "@/features/organization/actions/get-all-organizations";
import { getActiveOrganizationFn } from "@/features/organization/actions/get-active-organization";
import { setOrganization } from "@/features/organization/actions/set-organization";

export function OrganizationSelector() {
  const queryClient = useQueryClient();
  const { data: activeOrganization } = useQuery({
    queryKey: ["activeOrganization"],
    queryFn: getActiveOrganizationFn,
  });
  const { data: organizations } = useQuery({
    queryKey: ["organizations"],
    queryFn: getAllOrganizationsFn,
  });

  const {
    mutate: mutation,
    isError,
    isPending,
  } = useMutation({
    mutationFn: ({ id, slug }: { id: string; slug: string }) =>
      setOrganization({ data: { organizationId: id, organizationSlug: slug } }),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["activeOrganization"] });
      queryClient.refetchQueries({ queryKey: ["organizations"] });
    },
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild suppressHydrationWarning>
          <Button variant={"outline"} className="w-full justify-between">
            {activeOrganization?.organization?.name || "Select Organization"}
            <ChevronsUpDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="DropdownMenuContent">
          {organizations?.organizations?.map((organization) => {
            return (
              <DropdownMenuItem
                className="justify-between flex"
                key={organization.id}
                onClick={() =>
                  mutation({
                    id: organization.id,
                    slug: organization.slug,
                  })
                }
              >
                {organization.name}
                {organization.id === activeOrganization?.organization?.id && (
                  <Check className="ml-2 h-4 w-4" />
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
