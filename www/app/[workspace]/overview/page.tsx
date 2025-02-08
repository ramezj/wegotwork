"use server"
import { GetWorkspace } from "@/actions/workspace/workspace"
import { redirect } from "next/navigation";
import { TotalApplicants, TotalJobs } from "@/components/stats";
import { Session } from "next-auth";
import { auth } from "@/auth";
import { Card, CardContent, CardDescription, CardHeader, CardFooter, CardTitle } from "@/components/ui/card";
import { Home, Settings } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SettingsCard } from "@/components/cards/settings";
import { Workspace } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";

export default async function Page({ params } : { params: Promise<{ workspace: string }>}) {
    const session:Session | null = await auth();
    if(!session) { return redirect('/') }
    const userWorkspace = await GetWorkspace((await params).workspace);
    if(userWorkspace === null) { redirect('/') }
    return (
        <>
        <div className="flex justify-between items-center w-full">
        <h1 className="font-bold text-3xl tracking-tight">Overview</h1>
        <Button asChild size={"sm"}>
            <Link target="_blank" href={`http://${userWorkspace?.workspace.slug}.${process.env.NEXT_PUBLIC_URL}`}>
            Preview
            <SquareArrowOutUpRight className="size-4" />
            </Link>
        </Button>
        </div>
        <div className="flex sm:flex-row flex-col gap-2 w-full">
        <TotalJobs title="Total Jobs" amount={userWorkspace?.workspace.jobs.length as number}/>
        <TotalApplicants title="Total Applicants" amount={57}/>
        </div>
        <SettingsCard workspace={userWorkspace?.workspace as Workspace}/>
        </>
    )
}