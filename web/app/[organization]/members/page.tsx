import { GetOrganization } from "@/actions/organization/organization";
import { redirect } from "next/navigation";
import { CreateUserInvitation } from "@/components/create-invitation";
import { SettingsCard } from "@/components/cards/settings";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatRole } from "@/lib/format-role";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ManageMember } from "@/components/manage-member";
import { Session } from "@/lib/auth-client";
import { auth } from "@/lib/auth";
import { Prisma } from "@prisma/client";
import { headers } from "next/headers";
import { PendingInvitations } from "@/components/pending-invitations";
import { Metadata } from "next";

type OrganizationWithUser = Prisma.OrganizationUserGetPayload<{
    include: {
        user: true
    }
}>

export const metadata:Metadata = {
    title: "Members",
    description: "Members"
}

export default async function Page({ params } : { params: Promise<{ organization: string }>}) {
    const session:Session | null = await auth.api.getSession({
        headers: await headers()
    });
    if(!session?.user) { redirect('/') }
    const userOrganization = await GetOrganization((await params).organization);
    if(userOrganization?.error) { redirect('/') }
    if(userOrganization?.organization?.role !== "owner") {
        return (
            <>
             <div className="flex justify-between items-center w-full">
            <h1 className="font-bold text-3xl tracking-tight">Team Members</h1>
            <Button size={"sm"}>
                <Users className="size-4" />
            </Button>
            </div>
            <p className="text-muted-foreground font-semibold">Restricted Access</p>
            </>
        )
    }
    return (
        <>
        <div className="flex justify-between items-center w-full">
        <h1 className="font-bold text-3xl tracking-tight">Team Members</h1>
        <Button size={"sm"}>
            <Users className="size-4" />
        </Button>
        </div>
        <Card className="bg-background">
        <CardHeader>
            <CardTitle>Members</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
            {
                userOrganization?.organization?.organization?.users.map((users: OrganizationWithUser) => {
                    return (
                        <div className="flex items-center justify-between" key={users.user.id}>
                        <div className="flex items-center space-x-4" key={users.user.id}>
                        <Avatar>
                        <AvatarImage src={users.user.image!} />
                        <AvatarFallback>OM</AvatarFallback>
                        </Avatar>
                        <div>
                        <p className="text-sm font-medium leading-none">{users.user.name}</p>
                        <p className="text-sm text-muted-foreground">{formatRole(users.role)}</p>
                        </div>
                        </div>
                        {
                            session.user?.id === users.userId 
                            ? 
                            <>
                            </>
                            :
                            <>
                            <ManageMember OrganizationUser={users} />
                            </>
                        }
                        </div>
                    )
                })
            }
        </CardContent>
        </Card>
        <div>
        <CreateUserInvitation organizationId={userOrganization?.organization.organizationId} />
        </div> 
        <div>
        <PendingInvitations OrganizationInvites={userOrganization.organization.organization.invitations} />
        </div>
        </>
    )
}