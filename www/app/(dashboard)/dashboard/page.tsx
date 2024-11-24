"use server"
import { auth } from "@/auth"
import { redirect } from "next/navigation";
import { UserWorkspaces } from "@/actions/workspace/user-workspaces";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CreateWorkspaceForm } from "@/components/create-workspace";
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { DeleteWorkspace } from "@/actions/workspace/delete-workspace";
import { DeleteWorkspaceButton } from "@/components/delete-workspace-button";

export default async function Page() {
    const session = await auth();
    if(!session) { redirect('/') }
    const userWorkspaces = await UserWorkspaces();
    return (
        <div className="p-8">
        <div className="flex items-center justify-center">
        <h1 className="font-bold text-3xl">Pick a Workspace</h1>
        </div>
        <CreateWorkspaceForm />
        <div className="flex flex-col space-y-4">
        {
            userWorkspaces?.UserWorkspaces?.map((workspace) => {
                return (
                    <Card className="" key={workspace.workspace.id}>
                        <CardHeader>
                            <CardTitle>{workspace.workspace.name}</CardTitle>
                            <CardDescription>{workspace.role}</CardDescription>
                        </CardHeader>
                        <CardContent>
                        <Button asChild>
                            <Link href={workspace.workspace.slug}>
                            View
                            </Link>
                        </Button>
                        <DeleteWorkspaceButton workspaceId={workspace.workspace.id}/>
                        </CardContent>
                    </Card>
                )
            })
        }
        </div>
        </div>
    )
}