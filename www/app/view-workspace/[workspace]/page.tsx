export default async function Page({ params } : { params: Promise<{ workspace: string }>}) {
    return (
        <>
        Hello from {(await params).workspace}
        </>
    )
}