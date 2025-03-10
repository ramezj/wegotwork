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
          redirect(`/${job.organizationId}/jobs`)
        }
        setLoading(false);
      }
    return (
        <>
      <Dialog>
      <DialogTrigger asChild>
      <Button size={"sm"} variant={"destructive"}>
            <Trash className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent onOpenAutoFocus={((e) => {e.preventDefault()})} className="text-left w-[90%] rounded-md bg-black">
        <DialogHeader>
            <DialogTitle className="text-left">
            Are you absolutely sure?
            </DialogTitle>
          <DialogDescription className="text-left">
          This action cannot be undone. This will permanently delete your job.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          {
            loading
            ? 
            <>
            <Button size={"sm"} disabled className="w-full" variant={"destructive"}><Loader2 className="mr-1 h-4 w-4 animate-spin" />Delete Job</Button>
            </>
            : 
            <>
            <Button onClick={deletejob} className="w-full" size={"sm"} variant={"destructive"}>Delete Job</Button>
            </>
          }
        </DialogFooter>
      </DialogContent>
    </Dialog>
        </>
    )
}