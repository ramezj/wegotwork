"use server"
import { GetWorkspace } from "@/actions/workspace/workspace"
import { redirect } from "next/navigation";
import { CreateUserInvitation } from "@/components/create-invitation";
import { SettingsCard } from "@/components/cards/settings";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function Page({ params } : { params: Promise<{ workspace: string }>}) {
    const userWorkspace = await GetWorkspace((await params).workspace);
    if(userWorkspace === null) { redirect('/') }
    if(userWorkspace?.role !== "owner") {
        return (
            <>
            <h1 className="font-bold text-3xl">Settings</h1>
            <p className="text-muted-foreground font-semibold">Restricted Access, please contact owner of workspace.</p>
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
        <div>
            {userWorkspace.workspace.users.map((users) => {
                return (
                    <div key={users.user.id}>
                    <p className="">{users.user.name}</p>
                    <p className="text-muted-foreground">{users.user.email}</p>
                    <p className="text-muted-foreground">{users.role}</p>
                    </div>
                )
            })}
        </div>
        <div className="mt-2">
        <CreateUserInvitation workspaceId={userWorkspace.workspaceId} />
        </div> 
        </>
    )
}