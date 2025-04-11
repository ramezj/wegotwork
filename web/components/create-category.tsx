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

export default function CreateCategoryButton({ id, buttonSize, buttonColor } : { id: string, buttonSize: ButtonSize, buttonColor: "white" | "black"}) {
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
          redirect(`/jobs/${res.job?.id}`)
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
          <Button size={buttonSize} className="rounded-none border font-extrabold" >
            Create category
          </Button>
          </DialogTrigger>
          :
          <DialogTrigger asChild>
          <Button size={buttonSize} className="rounded-none border-none font-extrabold bg-black text-white hover:bg-black hover:text-white" >
            Create category
          </Button>
          </DialogTrigger>
        }
      <DialogContent onOpenAutoFocus={((e) => {e.preventDefault()})} className="text-left w-[90%] !rounded-none bg-white border border-black">
        <DialogHeader>
          <DialogTitle className="text-left font-extrabold text-black !text-xl">Create a new job</DialogTitle>
          {/* <DialogDescription className="text-left text-black font-bold">
          create a job listing & start hiring immediately
          </DialogDescription> */}
        </DialogHeader>
        <div className="grid py-2">
          <div className="grid items-center gap-4">
            <Label htmlFor="name" className="text-left font-extrabold text-black">
              Job Title
            </Label>
            <form id="form" onSubmit={createjob}>
            <Input
              type="text"
              required
              id="name"
              value={name}
              onChange={((e) => {setName(e.target.value)})}
              placeholder="Enter Job title"
              className="bg-white rounded-none border border-black text-black font-bold text-base"
            />
            </form>
          </div>
        </div>
        <DialogFooter>
          {
            loading
            ? 
            <>
            <Button disabled form="form" type="submit" className="w-full font-extrabold bg-black text-white rounded-none hover:bg-black hover:text-white">
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              create job
            </Button>
            </>
            : 
            <>
            <Button form="form" type="submit" className="w-full font-extrabold bg-black text-white rounded-none hover:bg-black hover:text-white">
              create job
            </Button>
            </>
          }
        </DialogFooter>
      </DialogContent>
    </Dialog>
        </>
    )
}