import { GetOrganization } from "@/actions/organization/organization";
import { redirect } from "next/navigation";
// import { CreateUserInvitation } from "@/components/create-invitation";
import { SettingsCard } from "@/components/cards/settings";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteOrganizationCard } from "@/components/cards/delete-org";
import { Metadata } from "next";

export const metadata:Metadata = {
    title: "settings",
    description: "settings"
}

export default async function Page({ params } : { params: Promise<{ organization: string }>}) {
    const userOrganization = await GetOrganization((await params).organization);
    if(userOrganization === null) { redirect('/') }
    if(userOrganization?.organization?.role !== "owner") {
        return (
            <>
            <div className="flex justify-between items-center w-full">
            <h1 className="font-extrabold text-4xl text-black tracking-tight">settings</h1>
            <Button size={"sm"} className="rounded-sm border border-black">
                <Settings className="size-4" />
            </Button>
            </div>
            <p className="text-muted-foreground font-semibold">restricted access</p>
            </>
        )
    }
    return (
        <>
        <div className="flex justify-between items-center w-full">
        <h1 className="font-extrabold text-4xl text-black tracking-tight">settings</h1>
        <Button size={"sm"} className="rounded-sm border border-black">
            <Settings className="size-4" />
        </Button>
        </div>
        <div className="space-y-4">
        <SettingsCard organization={userOrganization.organization.organization} />
        <DeleteOrganizationCard />
        </div>
        </>
    )
}