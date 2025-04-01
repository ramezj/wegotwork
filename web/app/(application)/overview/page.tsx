import { auth } from "@/lib/auth";
import { Session } from "@/lib/auth-client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
    const session:Session | null = await auth.api.getSession({
        headers: await headers()
    })
    if(session?.user.currentOrganizationId === null) {
        redirect('/dashboard')
    }
    return (
        <>
        {JSON.stringify(session?.user)}
        </>
    )
}