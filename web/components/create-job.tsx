"use client"
import { Button } from "./ui/button"
import React, { useState } from "react"
import { getFirstZodErrorMessage } from "@/lib/zod-loop"
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
import { redirect } from "next/navigation"
import { toast } from "sonner"

type CreateJobProps = {
  id: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export default function CreateJob({ id, className, children, ...buttonProps }: CreateJobProps) {
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ name, setName ] = useState<string>("");
    const createjob = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const res = await CreateJobAction(name, id);
        console.log(res);
        if(res.error) {
          const message = typeof res.message === "string"
          ? res.message
          : getFirstZodErrorMessage(res.message as Record<string, string[]>);
          toast(message)
        } else {
          redirect(`/jobs/${res.job?.id}`)
        }
        setLoading(false);
    }
    return (
        <>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-theme px-4 font-bold rounded-none" variant={"outline"} {...buttonProps}>
            Create Job
          </Button>
          </DialogTrigger>
      <DialogContent onOpenAutoFocus={((e) => {e.preventDefault()})} 
      className="text-left w-[90%] bg-theme border border-white/20 !rounded-none ">
        <DialogHeader>
          <DialogTitle className="text-left font-extrabold text-white !text-xl">Create a new job</DialogTitle>
        </DialogHeader>
        <div className="grid">
          <div className="grid items-center gap-4">
            <Label htmlFor="name" className="text-left font-extrabold text-white">
              Job Title
            </Label>
            <form id="form" onSubmit={createjob}>
            <Input
              type="text"
              id="name"
              required
              value={name}
              onChange={((e) => {setName(e.target.value)})}
              placeholder="Enter Job title"
              className="bg-accent rounded-none border border-white/20 text-white font-medium text-base"
            />
            </form>
          </div>
        </div>
        <DialogFooter>
          <Button disabled={loading} form="form" type="submit" variant={"default"} className="px-4 w-full font-extrabold rounded-none">
            { loading ? <Loader2 className="mr-1 h-4 w-4 animate-spin text-black" /> : <></> }
            Create Job
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
        </>
    )
}