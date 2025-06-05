"use client"
// import { formatJobType } from "@/lib/format-job";
import { Job } from "@prisma/client";
import { Button } from "../ui/button";
import { Settings, ArrowRight, Users } from "lucide-react";
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
      <div className="w-full flex border border-white/20 bg-theme rounded-md items-center duration-300 pt-3 pb-3 cursor-pointer">
      <div className="mx-5 my-3 flex flex-col items-start text-left">
        <p className='sm:text-lg text-md font-extrabold text-left text-white'>
         {job.title}     
        </p>
        <div className="mt-1 flex">
          <p className="text-xs text-white font-bold">{formatDistanceToNow(job.createdAt)} ago</p>
          </div>
        </div>
        <div className="mr-5 ml-auto">
        <Button size={"sm"} variant={"outline"} className="rounded-none bg-theme hover:bg-theme border border-none text-white">
          <Settings className="size-4"/>
        </Button>
        </div>
        </div>
        </div>
      )
}

export function JobCard({ job }: { job: JobWithCategories }) {
    return (
      <Link href={`/${job.id}`}>
      <div className="w-full bg-[#0A0A0A] flex border border-white/20 rounded-md items-center pt-3 pb-3 cursor-pointer shadow-[0_4px_0_0_rgba(0,0,0,1)] active:shadow-[0_0px_0_0_rgba(0,0,0,1)] active:translate-y-1 transition-all">
      <div className="mx-5 my-3 flex flex-col items-start text-left">
        <p className='sm:text-lg text-md font-extrabold text-left text-white'>
         {job.title}     
        </p>
        <div className="mt-2 flex gap-2">
        <Badge className="rounded-sm bg-black text-white border border-white/20 font-bold hover:bg-black">{formatJobType(job.type as Type)}</Badge>
        {
            job.categoryId === null 
            ?
            <>
            </>
            :
            <Badge className="rounded-sm bg-black text-white border border-white/20 font-bold hover:bg-black">{job.category?.name}</Badge>
          }
        </div>
        </div>
        <div className="ml-auto mr-5 sm:block hidden">
        <Button className="rounded-none  bg-transparent border-none" variant={"outline"} size={"icon"}>
            <ArrowRight className="size-4" />
        </Button>
          {/* {
            job.city === null && job.country === null
            ?
            <>
            </>
            :
            <>
            <p className="text-sm text-black font-bold sm:block hidden">{job.country}</p>
            </>
          } */}
        </div>
        </div>
        </Link>
      )
}

export function LandingPageJobCard({ title, type, location, age }: { title: string, type: string, location: string, age:string }) {
  return (
      <div color={"white"}
      className="w-full bg-white flex border-2 border-black rounded-none items-center pt-3 pb-3 cursor-pointer shadow-[0_4px_0_0_rgba(0,0,0,1)] active:shadow-[0_0px_0_0_rgba(0,0,0,1)] active:translate-y-1 transition-all hover:shadow-[0_0px_0_0_rgba(0,0,0,1)] hover:translate-y-1">
      <div className="mx-5 my-3 flex flex-col items-start text-left">
      <p className='sm:text-lg text-md font-extrabold text-left text-black'>
       {title}     
      </p>
      <div className="mt-1 flex">
        <p className="text-xs font-bold text-black">{age}</p>
      </div>
      </div>
      <div className="ml-auto mr-5">
      <Button className="rounded-none bg-inherit bg-black hover:bg-black border-none" variant={"outline"} size={"icon"}>
        <ArrowRight className="size-4" />
      </Button>
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
    <div className="w-full flex border border-white/20 bg-theme rounded-md items-center duration-300 pt-3 pb-3 cursor-pointer">
    <div className="mx-5 my-3 flex flex-col items-start text-left">
      <p className='sm:text-lg text-md font-extrabold text-left text-white'>
       {job.title}     
      </p>
      <div className="mt-1 flex">
        <p className="text-xs text-white font-bold">{formatDistanceToNow(job.createdAt)} ago</p>
        </div>
      </div>
      <div className="mr-5 ml-auto">
      <Button size={"sm"} variant={"outline"} className="rounded-none bg-inherit hover:bg-inherit border border-none text-white">
        {applicants}
        <Users className="size-4"/>
      </Button>
      </div>
      </div>
      </div>
    )
}