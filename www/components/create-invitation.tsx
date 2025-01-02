"use client"
import React, {useState } from "react"
import { Button } from "./ui/button";
import { CreateInvitation } from "@/actions/invitations/create";
import { toast } from "sonner";

export function CreateUserInvitation({ workspaceId} : { workspaceId: string}) {
    const [ loading, setLoading ] = useState<boolean>(false);
    const create_the_invitation = async (e:React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const res = await CreateInvitation(workspaceId);
        setLoading(false);
        toast(JSON.stringify(res?.invitation))
    }
    return (
        <form onSubmit={create_the_invitation} className="flex items-center gap-3">
        <Button type="submit">
            {
                loading 
                ? "Creating Invitation Link"
                : "Create Invitation Link"
            }
        </Button>
        </form>
    )
}