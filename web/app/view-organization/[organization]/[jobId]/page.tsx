import { getJobById } from "@/actions/jobs/get-job";
import { Job, Type } from "@prisma/client"
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Metadata } from "next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import ApplyCard from "@/components/apply-card";
// import { getOrganizationBySlug } from "@/server-actions/organization/get-organization";
import { notFound } from 'next/navigation'
import Link from "next/link";
import { formatJobType } from "@/lib/format-job";
import { formatDistanceToNow } from "date-fns";
// import { Toggle } from "@/components/toggle";
import { CareerNavbar } from "@/components/career-navbar";
import { Organization } from "@prisma/client";
import { FindOrganization } from "@/actions/organization/find-organization";
import { MapPin, Briefcase, Banknote } from "lucide-react";

export async function generateMetadata({ params } : { params: Promise<{ organization: string, jobId: string }>}): Promise<Metadata> {
    const job = await getJobById((await params).jobId)
    return {
      title: job.job?.title
    };
}
export default async function Page({ params } : { params: Promise<{ organization: string, jobId: string }>}) {
    // const organization = await getOrganizationBySlug(params.slug);
    // if(organization?.error) { 
    //     console.error("Not Found")
    //     notFound() 
    // }
    const organization = await FindOrganization((await params).organization);
    if(organization.error) {
        notFound();
    }
    const job = await getJobById((await params).jobId);
    if(job?.error) { redirect('/') }
    return (
        <main className="">
        <div className="top-0 z-10 sticky">
        <CareerNavbar organizationName={organization.organization?.name as string} />
        </div>
            <div className="w-full flex flex-col items-center text-center py-8 px-4 gap-y-4">
            <div>
            <h1 className="font-extrabold text-black text-2xl">{job.job?.title}</h1>
            <p className="text-sm max-w-3xl text-muted-foreground">{formatDistanceToNow(job.job?.createdAt!)} ago </p>
            </div>
            <div className="flex flex-row gap-2">
            <Button size={"sm"} variant={"outline"} className="rounded-sm bg-white hover:bg-white hover:text-black border border-black text-black font-extrabold"><Briefcase className="size-4 mr-2"/>{formatJobType(job.job?.type as Type)}</Button>
            {
                job?.job?.location
                ? <Button size={"sm"} variant={"outline"} className="rounded-sm bg-inherit border-foreground/20"><MapPin className="size-4 mr-2" />{job.job?.location}</Button>
                : <></>
            }
            </div>
            {
                job.job?.content
                ?  
                <>
                <div className="lg:w-1/2 w-full rounded-lg border border-foreground/20 p-7 text-left" dangerouslySetInnerHTML={{__html: job.job?.content!}} />
                </>
                :
                <>
                </>
            }
            <ApplyCard jobId={(await params).jobId} />
        </div>
        </main>
    )
}