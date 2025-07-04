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
import { Input } from "./ui/input"

export function DeleteJobButton({ job } : { job: Job}) {
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ jobTitle, setJobTitle ] = useState<string>("");
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
                      <Button className="rounded-none" variant={"destructive"}>
                        Delete Job
                      </Button>
                      </DialogTrigger>
                  <DialogContent onOpenAutoFocus={((e) => {e.preventDefault()})} 
                  className="text-left w-[90%] bg-theme border border-dashed !rounded-none ">
                    <DialogHeader>
                      <DialogTitle className="text-left font-medium text-white !text-xl">DANGER ZONE</DialogTitle>
                    </DialogHeader>
                    <div className="grid">
                      <div className="grid items-center gap-4">
                        <Label htmlFor="name" className="text-left font-medium text-white">
                        Job Name
                        </Label>
                        <form id="form">
                        <Input
                          type="text"
                          id="name"
                          onChange={((e) => {
                            setJobTitle(e.target.value)
                          })}
                          value={jobTitle}
                          required
                          placeholder={`${job.title}`}
                          className="bg-accent border-dashed  rounded-none border text-white font-medium text-base"
                        />
                        </form>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button disabled={jobTitle !== job.title}  
                      onClick={((e) => {deletejob()})}  
                      variant={"destructive"} 
                      className="px-4 w-full font-medium rounded-none">
                        { loading ? <Loader2 className="mr-1 h-4 w-4 animate-spin text-white" /> : <></> }
                        Delete Organization
                      </Button>
                    </DialogFooter>
                  </DialogContent>
          </Dialog>
        </>
    )
}