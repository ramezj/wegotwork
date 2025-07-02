import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Navigation } from "@/components/navbar";
import { Navbar } from "@/components/navbar-2";
import SignIn from "@/components/sign-in";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Metadata } from "next";
import { Session } from "@/lib/auth-client";
import { GetInvitation } from "@/actions/invitations/get-invitation";
import SignInInvitation from "@/components/sign-in-invitation";
import Link from "next/link";

export const metadata: Metadata = {
    title: "You're Invited!",
    description: "You're Invited!"
}

export default async function Page({ params } : { params: Promise<{ invitationId: string }>}) {
    const session:Session | null = await auth.api.getSession({
        headers: await headers()
    })
    const invitation = await GetInvitation((await params).invitationId);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background py-8">
            <div className="w-full px-4 flex flex-col items-center">
                <Card className="w-full max-w-xl mb-8 bg-theme border border-dashed rounded-none">
                    <CardHeader>
                        <CardTitle className="text-center text-white font-medium text-2xl">You're Invited!</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center text-white text-base font-medium">
                            You've been invited to <Link target="_blank" href={`http://${invitation?.invitation?.organization.slug}.${process.env.NEXT_PUBLIC_URL}`} className="font-bold text-blue-400">{invitation?.invitation?.organization.name}</Link>
                        </div>
                        <div className="mt-4">
                            {
                                session === null 
                                ?
                                <>
                                <SignInInvitation />
                                </>
                                :
                                <></>
                            }
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}