"use server"
import { GetWorkspace } from "@/actions/workspace/workspace"
import { redirect } from "next/navigation";
import { CreateUserInvitation } from "@/components/create-invitation";
import { SettingsCard } from "@/components/cards/settings";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { formatRole } from "@/lib/format-role";

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
                    <Card className="bg-background" key={users.user.id}>
                    <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar>
                            <AvatarImage src={users.user.image as string} />
                    </Avatar>
                    <CardTitle>{users.user.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <p className="text-muted-foreground text-sm">{users.user.email}</p>
                    <p className="text-muted-foreground text-sm">{formatRole(users.role)}</p>
                    </CardContent>
                    </Card>
                )
            })}
        </div>
        <div>
        <CreateUserInvitation workspaceId={userWorkspace.workspaceId} />
        </div> 
        </>
    )
}