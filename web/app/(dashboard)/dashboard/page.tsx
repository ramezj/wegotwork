"use server"
import { auth } from "@/auth"
import { redirect } from "next/navigation";
import { UserWorkspaces } from "@/actions/workspace/user-workspaces";

export default async function Page() {
    const session = await auth();
    if(!session) { redirect('/') }
    const userWorkspaces = await UserWorkspaces();
    return (
        <div>
            {JSON.stringify(session.user)}
        <p>Pick a Workspace</p>
        {
            userWorkspaces?.UserWorkspaces?.map((workspace) => {
                return (
                    <div key={workspace.workspace.id}>
                    Workspace : {workspace.workspace.name}
                    <br />
                    Workspace Id : {workspace.workspace.id}
                    </div>
                )
            })
        }
        </div>
    )
}