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
import { MembersCard } from "@/components/members";

type OrganizationWithUser = Prisma.OrganizationUserGetPayload<{
    include: {
        user: true
    }
}>

export const metadata:Metadata = {
    title: "Members",
    description: "Members"
}

export default async function Page() {
    const session:Session | null = await auth.api.getSession({
        headers: await headers()
    });
    if(!session?.user) { 
        redirect('/') 
    }
    if(session.user.currentOrganizationId === null) {
        redirect('/dashboard')
    }
    const userOrganization = await GetOrganization(session.user.currentOrganizationId!);
    if(userOrganization?.error) { redirect('/') }
    if(userOrganization?.organization?.role !== "owner") {
        return (
            <>
            <div className="flex justify-between items-center w-full">
            <h1 className="font-medium text-white text-3xl tracking-tight">Members</h1>
            <Button size={"sm"} variant={"outline"} className="rounded-none bg-theme font-medium border border-dashed border-foreground/20">
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
        <h1 className="font-medium text-white text-3xl tracking-tight">Members</h1>
        <Button size={"sm"} variant={"outline"} className="rounded-none bg-theme font-medium border border-dashed border-foreground/20">
            <Users className="size-4" />
        </Button>
        </div>
        <div className="flex flex-col gap-4">
        <MembersCard users={userOrganization.organization.organization.users} session={session} />
        <CreateUserInvitation organizationId={userOrganization?.organization.organizationId} />
        <PendingInvitations OrganizationInvites={userOrganization.organization.organization.invitations} />
        </div>
        </>
    )
}