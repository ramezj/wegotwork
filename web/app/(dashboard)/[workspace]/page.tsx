"use server"
import { GetWorkspace } from "@/actions/workspace/workspace"
export default async function Page({ params } : { params: Promise<{ workspace: string }>}) {
    const workspace = await GetWorkspace((await params).workspace);
    return (
        <>
        {JSON.stringify(workspace?.workspace)}
        </>
    )
}