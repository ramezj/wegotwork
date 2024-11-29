"use server"
import { auth } from "@/auth"
import { redirect } from "next/navigation";
import { UserWorkspaces } from "@/actions/workspace/user-workspaces";
import Link from "next/link";
import { CreateWorkspaceButton } from "@/components/create-workspace";
import { Card, CardHeader, CardContent, CardDescription, CardTitle, CardFooter } from "@/components/ui/card";

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
    <Card className="w-[350px]">
      <CardHeader className="text-center">
        <CardTitle>Workspaces</CardTitle>
        <CardDescription>Workspaces you own or are a part of</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
            {
                userWorkspaces?.UserWorkspaces?.map((workspace) => {
                    return (
                        <div key={workspace.id}>
                        <Link href={`${workspace.workspace.slug}/overview`} className="w-full flex border border-foreground/20 hover:border-foreground/30 rounded-md items-center duration-300" key={workspace.workspace.id}>
                        <div className="mx-5 my-3 flex flex-col items-start text-left">
                        <p className='text-sm font-bold text-left text-foreground'>
                        {workspace.workspace.name}     
                        </p>   
                        </div>
                        </Link>
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
        </div>
    )
}