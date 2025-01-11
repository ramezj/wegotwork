"use server"
import { GetWorkspace } from "@/actions/workspace/workspace"
import { redirect } from "next/navigation";
import { TotalApplicants, TotalJobs } from "@/components/stats";
import { Session } from "next-auth";
import { auth } from "@/auth";

export default async function Page({ params } : { params: Promise<{ workspace: string }>}) {
    const session:Session | null = await auth();
    if(!session) { return redirect('/') }
    const userWorkspace = await GetWorkspace((await params).workspace);
    if(userWorkspace === null) { redirect('/') }
    return (
        <>
        <h1 className="font-bold text-3xl tracking-tight">Overview</h1>
        <div className="flex sm:flex-row flex-col gap-2 w-full">
        <TotalJobs title="Total Jobs" amount={10}/>
        <TotalApplicants title="Total Applicants" amount={57}/>
        </div>
        </>
    )
}