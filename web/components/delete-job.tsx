"use client"
import { Button } from "./ui/button"
import { Trash } from "lucide-react"
import { DeleteJob } from "@/actions/jobs/delete-job"
import { useState } from "react"
import { Job } from "@prisma/client"
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog"
import { Label } from "./ui/label"
import { Loader2 } from "lucide-react"
import { redirect } from "next/navigation"

export function DeleteJobButton({ job } : { job: Job}) {
    const [ loading, setLoading ] = useState<boolean>(false);
    const deletejob = async () => {
        setLoading(true);
        const res = await DeleteJob(job.id);
        if(res.error === false) {
          redirect(`/jobs`)
        }
        setLoading(false);
      }
    return (
        <>
      <Dialog>
      <DialogTrigger asChild>
      <Button size={"sm"} variant={"destructive"} className='rounded-none border-[3px] border-black shadow-[0_4px_0_0_rgba(0,0,0,1)] active:shadow-[0_0px_0_0_rgba(0,0,0,1)] transition-all active:translate-y-1'>
            <Trash className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent onOpenAutoFocus={((e) => {e.preventDefault()})} className="text-left w-[90%] !rounded-none bg-white border border-black">
        <DialogHeader>
            <DialogTitle className="text-left text-black">
            Are you absolutely sure?
            </DialogTitle>
        </DialogHeader>
        <DialogFooter className="mt-2">
          {
            loading
            ? 
            <>
            <Button size={"sm"} className="pointer-events-none mt-2 w-full rounded-none border-[3px] border-black shadow-[0_4px_0_0_rgba(0,0,0,1)] active:shadow-[0_0px_0_0_rgba(0,0,0,1)] transition-all active:translate-y-1" variant={"destructive"}>
            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            Delete Job
            </Button>
            </>
            : 
            <>
            <Button onClick={deletejob} className="mt-2 w-full rounded-none border-[3px] border-black shadow-[0_4px_0_0_rgba(0,0,0,1)] active:shadow-[0_0px_0_0_rgba(0,0,0,1)] transition-all active:translate-y-1" size={"sm"} variant={"destructive"}>
            Delete Job
            </Button>
            </>
          }
        </DialogFooter>
      </DialogContent>
    </Dialog>
        </>
    )
}