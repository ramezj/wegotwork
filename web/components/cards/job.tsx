"use client"
// import { formatJobType } from "@/lib/format-job";
import { Job } from "@prisma/client";
import { Button } from "../ui/button";
import { Settings, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns" 

export function JobCardForDashboard({ job }: { job: Job}) {
    const router = useRouter();
    const handleCardClick = () => {
      router.push(`jobs/${job.id}`);
    };
    return (
      <div onClick={handleCardClick}>
      <div className="w-full flex border border-foreground/20 hover:border-foreground/30 rounded-lg items-center duration-300 pt-3 pb-3 cursor-pointer">
      <div className="mx-5 my-3 flex flex-col items-start text-left">
        <p className='sm:text-lg text-md font-bold text-left text-black dark:text-white'>
         {job.title}     
        </p>
        <div className="mt-1 flex">
          <p className="text-xs text-muted-foreground">{formatDistanceToNow(job.createdAt)} ago</p>
          </div>
        </div>
        <div className="mr-5 ml-auto">
        <Button size={"sm"} variant={"outline"} className="rounded-lg bg-inherit border border-foreground/20">
          <Settings className="size-4"/>
        </Button>
        </div>
        </div>
        </div>
      )
}

export function JobCard({ job }: { job: Job }) {
    return (
      <Link href={`/${job.id}`} target="_blank">
      <div 
      className="w-full flex border border-foreground/20 hover:border-foreground/30 rounded-lg items-center duration-300 pt-3 pb-3">
      <div className="mx-5 my-3 flex flex-col items-start text-left">
        <p className='sm:text-lg text-md font-bold text-left text-black dark:text-white'>
         {job.title}     
        </p>
        <div className="mt-1 flex">
        <p className="text-xs text-muted-foreground">{formatDistanceToNow(job.createdAt)} ago</p>
        </div>
        </div>
        <div className="ml-auto mr-5">
          <Button size={"icon"} variant={"outline"} className="rounded-lg bg-inherit border border-foreground/20">
            <ArrowRight className="size-4" />
          </Button>
        </div>
        </div>
        </Link>
      )
}

export function LandingPageJobCard({ title, type, location, age }: { title: string, type: string, location: string, age:string }) {
  return (
      <div color={"white"}
      className="w-full bg-white flex border border-black rounded-md items-center duration-300 pt-3 pb-3 cursor-pointer">
      <div className="mx-5 my-3 flex flex-col items-start text-left">
      <p className='sm:text-lg text-md font-extrabold text-left text-black'>
       {title}     
      </p>
      <div className="mt-1 flex">
        <p className="text-xs text-muted-foreground">{age}</p>
      </div>
      </div>
      <div className="ml-auto mr-5">
      <Button className="rounded-sm bg-inherit bg-black hover:bg-black" variant={"outline"} size={"icon"}>
        <ArrowRight className="size-4" />
      </Button>
      </div>
      </div>
    )
}