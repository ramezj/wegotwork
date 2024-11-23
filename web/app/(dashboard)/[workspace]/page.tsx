"use server"
import { GetWorkspace } from "@/actions/workspace/workspace"
export default async function Page({ params } : { params: Promise<{ workspace: string }>}) {
    const workspace = await GetWorkspace((await params).workspace);
    return (
        <>
        <p>Workspace Name : {workspace?.workspace.name}</p>
        <p>Workspace ID : {workspace?.workspace.id}</p>
        <p>User Role : {workspace?.role}</p>
        </>
    )
}