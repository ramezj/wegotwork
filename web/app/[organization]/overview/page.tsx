"use server"
import { auth } from "@/lib/auth"
import { Session } from "@/lib/auth-client"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function Page({ params } : { params: Promise<{ organization: string }>}) {
    const session:Session | null = await auth.api.getSession({
        headers: await headers()
    })
    if(!session?.user) { redirect('/') }
    return (
        <>
        {(await params).organization}
        </>
    )
}