"use client"
// import { formatJobType } from "@/lib/format-job";
import { Job } from "@prisma/client";
import { Button } from "../ui/button";
import { Settings, ArrowRight, Users, ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns" 
import { Prisma } from "@prisma/client";
import { Badge } from "../ui/badge";
import { formatJobType } from "@/lib/format-job";
import { Type } from "@prisma/client";

type JobWithCategories = Prisma.JobGetPayload<{
  include: {
    category: true
  }
}>

export function JobCardForDashboard({ job }: { job: Job}) {
    const router = useRouter();
    const handleCardClick = () => {
      router.push(`jobs/${job.id}`);
    };
    return (
      <div onClick={handleCardClick}>
      <div className="w-full flex border border-foreground/20 border-dashed hover:border-white/30 bg-theme rounded-none items-center duration-200 pt-3 pb-3 cursor-pointer">
      <div className="mx-5 my-3 flex flex-col items-start text-left">
        <p className='sm:text-lg text-md font-medium text-left text-white'>
         {job.title}     
        </p>
        <div className="mt-1 flex">
          <p className="text-xs text-white font-medium">{formatDistanceToNow(job.createdAt)} ago</p>
          </div>
        </div>
        <div className="mr-5 ml-auto">
        <Button size={"sm"} variant={"default"} className="rounded-none">
          <Settings className="size-4"/>
        </Button>
        </div>
        </div>
        </div>
      )
}

export function JobCard({ job }: { job: JobWithCategories }) {
    return (
      <Link target="_blank" href={`/${job.id}`}>
      <div className="w-full bg-theme flex border border-foreground/20 border-dashed hover:border-white/30 duration-200 rounded-none items-center pt-3 pb-3 cursor-pointer">
      <div className="mx-5 my-3 flex flex-col items-start text-left">
        <p className='sm:text-lg text-md font-medium text-left text-white'>
         {job.title}     
        </p>
        <div className="mt-2 flex gap-2">
        <Badge variant={"outline"} className="rounded-none border-dashed border-white/20 bg-accent text-white border font-medium hover:bg-accent">{formatJobType(job.type as Type)}</Badge>
        {
            job.categoryId === null 
            ?
            <>
            </>
            :
            <Badge variant={"outline"} className="rounded-none border-dashed border-white/20 bg-accent text-white border font-medium hover:bg-accent">{job.category?.name}</Badge>
          }
        </div>
        </div>
        <div className="ml-auto mr-5">
        <div className="sm:hidden block">
        <Button className="border rounded-none" variant={"default"} size={"icon"}>
        <ArrowUpRight className="size-4" />
        </Button>
        </div>
        <div className="sm:block hidden">
        <Button className="border rounded-none" variant={"default"}>
            View
            <ArrowUpRight className="size-4" />
        </Button>
        </div>
          {/* {
            job.city === null && job.country === null
            ?
            <>
            </>
            :
            <>
            <p className="text-sm text-black font-medium sm:block hidden">{job.country}</p>
            </>
          } */}
        </div>
        </div>
        </Link>
      )
}

export function LandingPageJobCard({ title, type, location, age, category }: { title: string, type: string, location: string, age:string, category: string }) {
  return (
      <div className="w-full bg-theme cursor-default flex border border-foreground/20 border-dashed duration-200 rounded-none items-center pt-3 pb-3">
      <div className="mx-5 my-3 flex flex-col items-start text-left">
      <p className='sm:text-lg text-md font-medium text-left text-white'>
       {title}     
      </p>
      <div className="mt-2 flex gap-2">
        <Badge variant={"outline"} className="rounded-none border-dashed border-white/20 bg-accent text-white border font-medium hover:bg-accent">{formatJobType(type as Type)}</Badge>
        <Badge variant={"outline"} className="rounded-none border-dashed border-white/20 bg-accent text-white border font-medium hover:bg-accent">{category}</Badge>
      </div>
      </div>
      <div className="ml-auto mr-5">
        <div className="sm:hidden block">
        <Button className="border rounded-none" variant={"default"} size={"icon"}>
        <ArrowUpRight className="size-4" />
        </Button>
        </div>
        <div className="sm:block hidden">
        <Button className="border rounded-none" variant={"default"}>
            View
            <ArrowUpRight className="size-4" />
        </Button>
        </div>
        </div>
      </div>
    )
}

export function JobCardForApplicants({ job, applicants }: { job: Job, applicants: number }) {
  const router = useRouter();
  const handleCardClick = () => {
    router.push(`applicants/${job.id}`);
  };
  return (
    <div onClick={handleCardClick}>
    <div className="w-full bg-theme flex border border-foreground/20 border-dashed hover:border-white/30 duration-200 rounded-none items-center pt-3 pb-3 cursor-pointer">
    <div className="mx-5 my-3 flex flex-col items-start text-left">
      <p className='sm:text-lg text-md font-medium text-left text-white'>
       {job.title}     
      </p>
      <div className="mt-1 flex">
        <p className="text-xs text-white font-medium">{formatDistanceToNow(job.createdAt)} ago</p>
        </div>
      </div>
      <div className="mr-5 ml-auto">
      <Button size={"sm"} variant={"default"} className="rounded-none">
        {applicants}
        <Users className="size-4"/>
      </Button>
      </div>
      </div>
      </div>
    )
}