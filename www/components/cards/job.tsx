"use client"
// import { formatJobType } from "@/lib/format-job";
import { Job } from "@prisma/client";
import { formatDistanceToNow } from "date-fns"
import { Button } from "../ui/button";
import { Settings } from "lucide-react";
import { useRouter } from "next/navigation";

export function JobCardForDashboard({ job }: { job: Job}) {
    const router = useRouter();
    // const handleApplicantsClick = (e: React.MouseEvent) => {
    //   e.stopPropagation();
    //   router.push(`jobs/${job.id}/applicants`);
    // };
  
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