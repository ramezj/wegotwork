"use client"
import { useState } from "react"
import { AcceptInvitation } from "@/actions/invitations/accept-invitation"
import { Button } from "./ui/button";
import { toast } from "sonner";
import { redirect } from "next/navigation";

export function AcceptInvitationButton({invitationId} : { invitationId: string}) {
    const [ loading, setLoading ] = useState<boolean>(false);
    const accept_invitation = async () => {
        setLoading(true);
        const res = await AcceptInvitation(invitationId);
        setLoading(false);
        if(res?.success) {
            redirect('/pick-workspace')
        }
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