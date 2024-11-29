"use server"
import { GetWorkspace } from "@/actions/workspace/workspace"
import { redirect } from "next/navigation";
import { CreateUserInvitation } from "@/components/create-invitation";

export default async function Page({ params } : { params: Promise<{ workspace: string }>}) {
    const userWorkspace = await GetWorkspace((await params).workspace);
    if(userWorkspace === null) { redirect('/') }
    if(userWorkspace?.role !== "owner") {
        return (
            <main className="p-2">
            <h1 className="font-bold text-3xl">Settings</h1>
            <p className="text-muted-foreground font-semibold">Restricted Access, please contact owner of workspace.</p>
            </main>
        )
    }
    return (
        <main className="p-2">
        <h1 className="font-bold text-3xl">Settings</h1>
        View Team Members
        <div>
            {userWorkspace.workspace.users.map((users) => {
                return (
                    <div key={users.user.id}>
                    <p className="text-muted-foreground">{users.user.name}</p>
                    <p className="text-muted-foreground">{users.user.email}</p>
                    </div>
                )
            })}
        </div>
        <div className="mt-2">
        <CreateUserInvitation workspaceId={userWorkspace.workspaceId} />
        </div>
        </main>
    )
}