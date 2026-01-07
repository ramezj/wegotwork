"use client";
import { Session } from "better-auth";
import { Button } from "@/components/ui/button";
import { Organization } from "@/src/generated/prisma/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import getAllOrganizationsAction from "@/actions/organization/get-all-organizations";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getCurrentOrganizationAction } from "@/actions/organization/get-current-organization";
import setCurrentOrganizationAction from "@/actions/organization/set-current-organization";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";

export function OrganizationSelector() {
  const queryClient = useQueryClient();

  const { data: organizationData } = useQuery({
    queryKey: ["activeOrganization"],
    queryFn: getCurrentOrganizationAction,
  });

  const { data: allOrganizationsData } = useQuery({
    queryKey: ["organizations"],
    queryFn: getAllOrganizationsAction,
  });

  const {
    mutate: mutation,
    isError,
    isPending,
  } = useMutation({
    mutationFn: ({ id, slug }: { id: string; slug: string }) =>
      setCurrentOrganizationAction(id, slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activeOrganization"] });
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild suppressHydrationWarning>
          <Button variant={"outline"} className="w-full justify-between">
            {organizationData?.name || "Select Organization"}
            <ChevronsUpDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {allOrganizationsData?.organizations?.map((org) => {
            return (
              <DropdownMenuItem
                className="justify-between flex"
                key={org.id}
                onClick={() =>
                  mutation({
                    id: org.organization.id,
                    slug: org.organization.slug,
                  })
                }
              >
                {org.organization.name}
                {org.organization.id === organizationData?.id && (
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
