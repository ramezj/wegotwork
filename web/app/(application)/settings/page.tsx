import { GetOrganization } from "@/actions/organization/organization";
import { redirect } from "next/navigation";
// import { CreateUserInvitation } from "@/components/create-invitation";
import { SettingsCard } from "@/components/cards/settings";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteOrganizationCard } from "@/components/cards/delete-org";
import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { Session } from "@/lib/auth-client";
import { headers } from "next/headers";

export const metadata:Metadata = {
    title: "Settings",
    description: "Settings"
}

export default async function Page() {
    const session:Session | null = await auth.api.getSession({
        headers: await headers()
    })
    if(!session?.user) { 
        redirect('/')
    }
    if(session.user.currentOrganizationId === null) {
        redirect('/dashboard')
    }
    const userOrganization = await GetOrganization(session.user.currentOrganizationId!);
    if(userOrganization === null) { redirect('/') }
    if(userOrganization?.organization?.role !== "owner") {
        return (
            <>
            <div className="flex justify-between items-center w-full">
            <h1 className="font-medium text-3xl text-white tracking-tight">Settings</h1>
            <Button size={"sm"} variant={"outline"} className="rounded-none bg-theme font-medium border border-dashed border-foreground/20">
                <Settings className="size-4" />
            </Button>
            </div>
            <p className="text-muted-foreground font-semibold">Restricted access</p>
            </>
        )
    }
    return (
        <>
        <div className="flex justify-between items-center w-full">
        <h1 className="font-medium text-3xl text-white tracking-tight">Settings</h1>
        <Button size={"sm"} variant={"outline"} className="rounded-none bg-theme font-medium border border-dashed border-foreground/20">
            <Settings className="size-4" />
        </Button>
        </div>
        <div className="flex flex-col gap-4">
        <SettingsCard organization={userOrganization.organization.organization} />
        <DeleteOrganizationCard organization={userOrganization.organization.organization} />
        </div>
        </>
    )
}