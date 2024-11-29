"use client"
import { useState } from "react"
import { AcceptInvitation } from "@/actions/invitations/accept-invitation"
import { Button } from "./ui/button";
import { toast } from "sonner";

export function AcceptInvitationButton({invitationId} : { invitationId: string}) {
    const [ loading, setLoading ] = useState<boolean>(false);
    const accept_invitation = async () => {
        setLoading(true);
        const res = await AcceptInvitation(invitationId);
        setLoading(false);
        toast(res?.success);
    }
    return (
        <>
        <Button onClick={accept_invitation} variant={"outline"}>
            {
                loading 
                ? "Joining Team"
                : "Join Team"
            }
        </Button>
        </>
    )
}