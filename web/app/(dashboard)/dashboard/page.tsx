"use server"
import { auth } from "@/auth"
import { redirect } from "next/navigation";
import { UserWorkspaces } from "@/actions/workspace/user-workspaces";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CreateWorkspaceForm } from "@/components/create-workspace";

export default async function Page() {
    const session = await auth();
    if(!session) { redirect('/') }
    const userWorkspaces = await UserWorkspaces();
    return (
        <div>
        <CreateWorkspaceForm />
        <p>Pick a Workspace</p>
        {
            userWorkspaces?.UserWorkspaces?.map((workspace) => {
                return (
                    <div key={workspace.workspace.id}>
                        <Button asChild>
                            <Link href={workspace.workspace.slug}>
                            {workspace.workspace.name}
                            </Link>
                        </Button>
                    </div>
                )
            })
        }
        </div>
    )
}