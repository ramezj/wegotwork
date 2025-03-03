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
import { redirect } from "next/navigation"
import { toast } from "sonner"

type ButtonSize = "default" | "sm" | "default" | "lg" | "icon" | null

export default function CreateJob({ id, buttonSize, buttonColor } : { id: string, buttonSize: ButtonSize, buttonColor: "white" | "black"}) {
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ name, setName ] = useState<string>("");
    const createjob = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const res = await CreateJobAction(name, id);
        console.log(res);
        if(res.error) {
          toast(res.message as string)
        } else {
          redirect(`/${id}/jobs/${res.job?.id}`)
        }
        setLoading(false);
    }
    return (
        <>
      <Dialog>
        {
          buttonColor === "white"
          ? 
          <DialogTrigger asChild>
          <Button size={buttonSize} className="rounded-sm border font-extrabold" >
            create new job
          </Button>
          </DialogTrigger>
          :
          <DialogTrigger asChild>
          <Button size={buttonSize} className="rounded-sm border-none font-extrabold bg-black text-white hover:bg-black hover:text-white" >
            create new job
          </Button>
          </DialogTrigger>
        }
      <DialogContent onOpenAutoFocus={((e) => {e.preventDefault()})} className="text-left w-[90%] !rounded-sm bg-white border border-black">
        <DialogHeader>
          <DialogTitle className="text-left font-extrabold text-black">create job</DialogTitle>
          <DialogDescription className="text-left text-black font-bold">
          create a job listing & start hiring immediately
          </DialogDescription>
        </DialogHeader>
        <div className="grid py-2">
          <div className="grid items-center gap-4">
            <Label htmlFor="name" className="text-left font-extrabold text-black">
              job title
            </Label>
            <form id="form" onSubmit={createjob}>
            <Input
              type="text"
              required
              id="name"
              value={name}
              onChange={((e) => {setName(e.target.value)})}
              placeholder="Name"
              className="col-span-3 bg-white rounded-sm border border-black text-black font-extrabold"
            />
            </form>
          </div>
        </div>
        <DialogFooter>
          {
            loading
            ? 
            <>
            <Button size={"sm"} disabled form="form" type="submit" className="w-full bg-black text-white rounded-sm hover:bg-black hover:text-white">
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              create job
            </Button>
            </>
            : 
            <>
            <Button form="form" type="submit" className="w-full bg-black text-white rounded-sm hover:bg-black hover:text-white" size={"sm"}>create job</Button>
            </>
          }
        </DialogFooter>
      </DialogContent>
    </Dialog>
        </>
    )
}