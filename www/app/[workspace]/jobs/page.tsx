import { auth } from "@/auth"
import { Session } from "next-auth"
import { redirect } from "next/navigation";
// import { Job } from "@prisma/client";
import { GetWorkspaceJobs } from "@/actions/jobs/get-all-jobs";
import CreateJob from "@/components/create-job";

export default async function Page({ params } : { params: Promise<{ workspace: string }>}) {
    const session:Session | null = await auth();
    if(!session) { redirect('/')}
    const jobs = await GetWorkspaceJobs(await((await params).workspace))
    console.log(jobs);
    return (
        <>
        <h1 className="font-bold text-3xl tracking-tight">Jobs</h1>
            { jobs?.jobs.length === 0 
            &&
            <>
            <div className="w-full border border-white/20 h-full rounded-lg items-center flex flex-col gap-3 justify-center">
                <div>
                <h1 className="font-bold text-xl text-center">You dont have any jobs yet.</h1>
                <p className="text-muted-foreground">create some jobs & start hiring immediately</p>
                </div>
                <CreateJob />
            </div>
            </>
            }
        </>
    )
}