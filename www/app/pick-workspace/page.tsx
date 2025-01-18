"use server"
import { auth } from "@/auth"
import { redirect } from "next/navigation";
import { UserWorkspaces } from "@/actions/workspace/user-workspaces";
import Link from "next/link";
import { CreateWorkspaceButton } from "@/components/create-workspace";
import { Card, CardHeader, CardContent, CardDescription, CardTitle, CardFooter } from "@/components/ui/card";
import { LogOutButton } from "@/components/login-button";
import { Button } from "@/components/ui/button";

export default async function Page() {
    const session = await auth();
    if(!session) { redirect('/') }
    const userWorkspaces = await UserWorkspaces();
    return (
        <div className="p-8">
        <div className="flex items-center justify-center">
        <h1 className="font-bold text-3xl">Pick a Workspace</h1>
        </div>
        <div className="w-full flex items-center justify-center mt-8">
    <Card className="w-[350px] bg-background">
      <CardHeader className="text-center">
        <CardTitle>Workspaces</CardTitle>
        <CardDescription>Workspaces you own or are a part of</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center">
            <div className="flex flex-col">
            {
                userWorkspaces?.UserWorkspaces?.map((workspace) => {
                    return (
                        <div key={workspace.id}>
                        <Button asChild variant={"outline"} className="my-2 flex flex-col items-start text-left">
                        <Link href={`${workspace.workspace.id}/overview`} className="" key={workspace.workspace.id}>
                        {workspace.workspace.name}    
                        </Link> 
                        </Button>
                        </div>
                    )
                })
            }
            </div>
          </div>
        </form>
      </CardContent>
        <CardFooter className="flex justify-between">
            <CreateWorkspaceButton />
        </CardFooter>
        </Card>
        </div>
        <LogOutButton />
        </div>
    )
}