"use client"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu"
import Link from "next/link"
import { Button } from "./ui/button"
import { ChevronsUpDown, Settings2, LogOut, Plus} from "lucide-react"
import { signOut } from "@/lib/auth-client"
import { Session } from "@/lib/auth-client"
import { Separator } from "./ui/separator"
import { redirect } from "next/navigation"
import { OrganizationUser } from "@prisma/client"
import { Prisma } from "@prisma/client"

type OrganizationUserWithUser = Prisma.OrganizationUserGetPayload<{
    include: {
        organization: true
    }
}>

export function OrganizationsDropdown({ organizations, session }: { organizations: OrganizationUserWithUser[], session: Session}) {
    return (
        <>
        <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant={"outline"} className="w-full bg-theme rounded-none border border-dashed">
                    {session.user.currentOrganization?.name}
                    <ChevronsUpDown className="ml-auto size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width] space-y-2 bg-theme mb-1 rounded-none border-dashed"
                >
                    
                  {organizations.map((organization) => {
                    return (
                      <div key={organization.organizationId}>
                      {organization.organizationId !== session.user.currentOrganizationId &&
                      <>
                      <DropdownMenuItem key={organization.organizationId} onClick={(() => {

                      })} className="cursor-pointer rounded-none">
                      {organization.organization.name}
                      </DropdownMenuItem>
                      </>}
                      </div>
                    )
                  })}
                      <DropdownMenuItem onClick={(() => {

                      })} 
                      className="cursor-pointer rounded-none w-full">
                      <Plus className="size-4" />
                      Create Organization
                      </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}