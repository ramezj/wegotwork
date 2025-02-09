import { FindWorkspace } from "@/actions/workspace/find-workspace"
import { notFound } from "next/navigation";
import { ViewWorkspace } from "@/components/cards/view-workspace";
import { Prisma } from "@prisma/client";

export default async function Page({ params } : { params: Promise<{ workspace: string }>}) {
    type WorkspaceWithJobs = Prisma.WorkspaceGetPayload<{
        include: {
            jobs: true
        }
    }>
    const workspace = await FindWorkspace((await params).workspace);
    if(workspace.error) {
        notFound();
    }
    return (
        <>
        <ViewWorkspace 
        workspace={workspace.workspace as WorkspaceWithJobs} 
        locations={workspace.locations as Array<string>} 
        types={workspace.types as Array<string>} />
        </>
    )
}