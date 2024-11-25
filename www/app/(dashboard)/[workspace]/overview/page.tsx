"use server"
import { GetWorkspace } from "@/actions/workspace/workspace"
import { redirect } from "next/navigation";
export default async function Page({ params } : { params: Promise<{ workspace: string }>}) {
    const workspace = await GetWorkspace((await params).workspace);
    if(workspace === null) { redirect('/') }
    return (
        <main className="p-2">
        <h1 className="font-bold text-3xl">Overview</h1>
        </main>
    )
}