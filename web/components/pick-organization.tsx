"use client"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Prisma } from "@prisma/client"
import { CreateOrganizationButton } from "./create-organization"
import { useState } from "react"
import { SetCurrentOrganization } from "@/actions/organization/set-current-org"
import { toast } from "sonner"
import { redirect } from "next/navigation"
import { Loader2 } from "lucide-react"

type OrganizationUserWithOrganization = Prisma.OrganizationUserGetPayload<{
    include: {
        organization: true
    }
}>

export function PickOrganizationCard({ userOrganizations }: { userOrganizations : OrganizationUserWithOrganization[] }) {
    const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null)
    const [isSelecting, setIsSelecting] = useState(false)
    const setUserOrg = async (e:React.FormEvent, organizationId: string) => {
        e.preventDefault();
        setSelectedOrgId(organizationId)
        setIsSelecting(true)
        const res = await SetCurrentOrganization(organizationId);
        if(res?.error ) {
            toast(res.message);
            setIsSelecting(false);
        } else {
            redirect('/overview');
        }
    }
  return (
    <div className="sm:w-[30%]">
    <Card className="bg-theme w-full rounded-none">
      <CardHeader>
        <CardTitle>Your Organizations</CardTitle>
        <CardDescription>
          Organizations you own or are a part of.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
          {
            userOrganizations.map((organization: OrganizationUserWithOrganization ) => {
                return (
                <form onSubmit={((e) => {setUserOrg(e, organization.organizationId)})} key={organization.organizationId} className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-4">
                    <Avatar className="rounded-none">
                    <AvatarImage src="/avatars/01.png" />
                    <AvatarFallback className="rounded-none">{organization.organization.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                    <p className="text-sm font-medium leading-none">{organization.organization.name}</p>
                    <p className="text-sm text-muted-foreground">0 Member</p>
                    </div>
                </div>
                <Button type="submit" variant="default" className="rounded-none">
                      {organization.organizationId === selectedOrgId && isSelecting ? (
                        <>
                          <Loader2 className="animate-spin text-black flex mr-2" />
                          View
                        </>
                      ) : (
                        <>View</>
                      )}
                    </Button>
                </form>
                )
            })
          }
          <div>
          </div>
      </CardContent>
    </Card>
    <div className="mt-4">
    <CreateOrganizationButton />
    </div>
    </div>
  )
}