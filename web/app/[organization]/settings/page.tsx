"use server"
import { GetOrganization } from "@/actions/organization/organization";
import { redirect } from "next/navigation";
// import { CreateUserInvitation } from "@/components/create-invitation";
import { SettingsCard } from "@/components/cards/settings";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function Page({ params } : { params: Promise<{ organization: string }>}) {
    const userOrganization = await GetOrganization((await params).organization);
    if(userOrganization === null) { redirect('/') }
    if(userOrganization?.role !== "owner") {
        return (
            <>
            <div className="flex justify-between items-center w-full">
            <h1 className="font-bold text-3xl tracking-tight">Settings</h1>
            <Button size={"sm"}>
                <Settings className="size-4" />
            </Button>
            </div>
            <p className="text-muted-foreground font-semibold">Restricted Access</p>
            </>
        )
    }
    return (
        <>
        <div className="flex justify-between items-center w-full">
        <h1 className="font-bold text-3xl tracking-tight">Settings</h1>
        <Button size={"sm"}>
            <Settings className="size-4" />
        </Button>
        </div>
        <div className="">
        <SettingsCard organization={userOrganization.organization} />
        </div>
        </>
    )
}