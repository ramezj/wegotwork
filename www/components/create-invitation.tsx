"use client"
import React, {useState } from "react"
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { CreateInvitation } from "@/actions/invitations/create";
import { toast } from "sonner";

export function CreateUserInvitation({ workspaceId} : { workspaceId: string}) {
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ theEmail, setTheEmail ] = useState<string>("");
    const create_the_invitation = async (e:React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const res = await CreateInvitation(workspaceId, theEmail);
        setLoading(false);
        toast(JSON.stringify(res?.invitation))
    }
    return (
        <form onSubmit={create_the_invitation} className="flex items-center gap-3">
        <Input value={theEmail} onChange={((e) => {setTheEmail(e.target.value)})} placeholder="Email" />
        <Button type="submit">
            {
                loading 
                ? "Inviting Member"
                : "Invite Member"
            }
        </Button>
        </form>
    )
}