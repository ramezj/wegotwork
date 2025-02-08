import { FindWorkspace } from "@/actions/workspace/find-workspace"
import { notFound } from "next/navigation";

export default async function Page({ params } : { params: Promise<{ workspace: string }>}) {
    const workspace = await FindWorkspace((await params).workspace);
    if(workspace.error) {
        notFound();
    }
    return (
        <>
        Hello from {JSON.stringify(workspace.workspace)}
        </>
    )
}