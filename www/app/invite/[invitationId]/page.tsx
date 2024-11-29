"use server"
import { GetInvitation } from "@/actions/invitations/get-invitation"
import { Session } from "next-auth";
import { auth } from "@/auth";
import { GoogleSignIn } from "@/components/sign-in-buttons";
import { AcceptInvitationButton } from "@/components/accept-invite-button";

export default async function Page({ params } : { params: Promise<{ invitationId: string }>}) {
    const invitation = await GetInvitation(await((await params).invitationId));
    const session:Session | null = await auth();
    if(!session) {
        return (
            <main className="flex flex-col w-full items-center justify-center p-6 space-y-2">
            <h1 className="font-bold text-2xl">
                You have been invited to {invitation?.invitation?.workspace.name}
            </h1>
            <div>
            <p className="text-muted-foreground">
                Please sign in first to join the workspace.
            </p>
            </div>
            <div>
            <GoogleSignIn callbackUrl={`/invite/${await((await params).invitationId)}`} />
            </div>
            </main>
        )
    }
    return (
        <main className="flex flex-col w-full items-center justify-center p-6 space-y-2">
            <h1 className="font-bold text-2xl">
                You have been invited to {invitation?.invitation?.workspace.name}
            </h1>
            <div>
                <AcceptInvitationButton invitationId={await((await params).invitationId)} />
            </div>
            </main>
    )
}