

export default async function Page({ params } : { params: Promise<{ jobId: string, workspace: string }>}) {
    return (
        <>
        Hello from workspace : {(await params).workspace}
        & Job Id : {(await params).jobId}
        </>
    )
}