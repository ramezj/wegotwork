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
      <Button size={"sm"} variant={"destructive"} className='rounded-none'>
            <Trash className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent onOpenAutoFocus={((e) => {e.preventDefault()})} className="text-left w-[90%] !rounded-none bg-white border border-black">
        <DialogHeader>
            <DialogTitle className="text-left text-black">
            are you absolutely sure?
            </DialogTitle>
        </DialogHeader>
        <DialogFooter className="mt-2">
          {
            loading
            ? 
            <>
            <Button size={"sm"} disabled className="w-full rounded-none" variant={"destructive"}>
            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            delete job
            </Button>
            </>
            : 
            <>
            <Button onClick={deletejob} className="w-full rounded-none" size={"sm"} variant={"destructive"}>delete job</Button>
            </>
          }
        </DialogFooter>
      </DialogContent>
    </Dialog>
        </>
    )
}