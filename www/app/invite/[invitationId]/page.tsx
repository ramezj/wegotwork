"use server"
import { GetInvitation } from "@/actions/invitations/get-invitation"
import { Session } from "next-auth";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Page({ params } : { params: Promise<{ invitationId: string }>}) {
    const invitation = await GetInvitation(await((await params).invitationId));
    const session:Session | null = await auth();
    if(!session) {
        return (
            <>
            
            </>
        )
    }
    return (
        <>
        {JSON.stringify(invitation?.invitation)}
        </>
    )
}