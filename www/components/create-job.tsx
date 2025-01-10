"use client"
import { Button } from "./ui/button"
import React, { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import { Input } from "@/components/ui/input"
  import { Label } from "@/components/ui/label"
  import { Loader2 } from "lucide-react"
import { CreateJobAction } from "@/actions/jobs/create-job"

export default function CreateJob({ workspaceId } : { workspaceId: string}) {
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ name, setName ] = useState<string>("");
    const createjob = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        console.log("NAME:", name);
        console.log("WORKSPACE ID:", workspaceId);
        const res = await CreateJobAction(name, workspaceId);
        if(res) {

        } else {

        }
        setLoading(false);
    }
    return (
        <>
            <Dialog>
      <DialogTrigger asChild>
      <Button variant={"outline"}>
        Create a Job
      </Button>
      </DialogTrigger>
      <DialogContent onOpenAutoFocus={((e) => {e.preventDefault()})} className="text-left w-[90%] rounded-md bg-black">
        <DialogHeader>
          <DialogTitle className="text-left">Create Job</DialogTitle>
          <DialogDescription className="text-left">
          Create a job listing & start hiring immediately
          </DialogDescription>
        </DialogHeader>
        <div className="grid py-2">
          <div className="grid items-center gap-4">
            <Label htmlFor="name" className="text-left">
              Name
            </Label>
            <form id="form" onSubmit={createjob}>
            <Input
              type="text"
              required
              id="name"
              value={name}
              onChange={((e) => {setName(e.target.value)})}
              placeholder="Name"
              className="col-span-3 bg-black"
            />
            </form>
          </div>
        </div>
        <DialogFooter>
          {
            loading
            ? 
            <>
            <Button disabled form="form" type="submit" className="w-full"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Create Job</Button>
            </>
            : 
            <>
            <Button form="form" type="submit" className="w-full">Create Job</Button>
            </>
          }
        </DialogFooter>
      </DialogContent>
    </Dialog>
        </>
    )
}