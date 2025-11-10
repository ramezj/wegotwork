"use client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "./ui/dropdown-menu";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  ChevronsUpDown,
  Settings2,
  LogOut,
  Plus,
  Check,
  Loader,
  Loader2,
} from "lucide-react";
import { signOut } from "@/lib/auth-client";
import { Session } from "@/lib/auth-client";
import { Separator } from "./ui/separator";
import { redirect } from "next/navigation";
import { OrganizationUser } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { SetCurrentOrganization } from "@/actions/organization/set-current-org";
import { useRouter } from "next/navigation";
import { useState } from "react";

type OrganizationUserWithUser = Prisma.OrganizationUserGetPayload<{
  include: {
    organization: true;
  };
}>;

export function OrganizationsDropdown({ session }: { session: Session }) {
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const SetCurrentOrg = async (e: React.FormEvent, organizationId: string) => {
    e.preventDefault();
    setSelectedOrgId(organizationId);
    setIsSelecting(true);
    const response = await SetCurrentOrganization(organizationId);
    if (response?.error === false) {
      setIsSelecting(false);
    }
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={"outline"}
            className="w-full dark:bg-theme bg-gray-200 hover:bg-gray-200 rounded-none border border-dashed"
          >
            {session.user.currentOrganization?.name}
            <ChevronsUpDown className="ml-auto size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="top"
          className="w-[--radix-popper-anchor-width] space-y-2 dark:bg-theme bg-gray-200 mb-1 rounded-none border-dashed"
        >
          <DropdownMenuGroup>
            {session.user.organizations.map((organization) => {
              return (
                <DropdownMenuItem
                  disabled={
                    organization.organizationId ===
                    session.user.currentOrganizationId
                  }
                  key={organization.organizationId}
                  onClick={(e: React.FormEvent) => {
                    SetCurrentOrg(e, organization.organizationId);
                  }}
                  className="cursor-pointer rounded-none font-bold"
                >
                  {organization.organization.name}
                  {organization.organizationId === selectedOrgId &&
                    isSelecting && (
                      <>
                        <Loader2 className="text-foreground ml-auto animate-spin" />
                      </>
                    )}
                  {organization.organizationId ===
                    session.user.currentOrganizationId && (
                    <Check className="ml-auto" />
                  )}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuGroup>
          <DropdownMenuItem
            asChild
            className="cursor-pointer rounded-none w-full font-bold"
          >
            <Link href={"/dashboard"}>
              <Plus className="size-4" />
              Create Organization
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
