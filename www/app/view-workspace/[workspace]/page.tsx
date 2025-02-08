import { FindWorkspace } from "@/actions/workspace/find-workspace"

export default async function Page({ params } : { params: Promise<{ workspace: string }>}) {
    const workspace = await FindWorkspace((await params).workspace);
    return (
        <>
        Hello from {JSON.stringify(workspace.workspace)}
        </>
    )
}