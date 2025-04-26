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
import { CreateCategoryAction } from "@/actions/category/create-category"
import { redirect } from "next/navigation"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

type ButtonSize = "default" | "sm" | "default" | "lg" | "icon" | null

export default function CreateCategoryButton({ buttonSize, buttonColor } : { buttonSize: ButtonSize, buttonColor: "white" | "black"}) {
  const router = useRouter();  
  const [ loading, setLoading ] = useState<boolean>(false);
    const [ name, setName ] = useState<string>("");
    const createjob = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const res = await CreateCategoryAction(name);
        if(!res.error) {
          router.refresh();
        }
        toast(JSON.stringify(res));
        setLoading(false);
    }
    return (
        <>
      <Dialog>
        {
          buttonColor === "white"
          ? 
          <DialogTrigger asChild>
          <Button size={buttonSize} className="rounded-none font-extrabold border-2 border-black shadow-[0_4px_0_0_rgba(0,0,0,1)] active:shadow-[0_0px_0_0_rgba(0,0,0,1)] active:translate-y-1 transition-all">
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
          <DialogTitle className="text-left font-extrabold text-black !text-xl">Create a new category</DialogTitle>
          {/* <DialogDescription className="text-left text-black font-bold">
          create a job listing & start hiring immediately
          </DialogDescription> */}
        </DialogHeader>
        <div className="grid">
          <div className="grid items-center gap-4">
            <Label htmlFor="name" className="text-left font-extrabold text-black">
              Category name
            </Label>
            <form id="form" onSubmit={createjob}>
            <Input
              type="text"
              required
              id="name"
              value={name}
              onChange={((e) => {setName(e.target.value)})}
              placeholder="Enter category name"
              className="bg-white rounded-none border-2 border-black text-black font-bold text-base"
            />
            </form>
          </div>
        </div>
        <DialogFooter>
          {
            loading
            ? 
            <>
            <Button form="form" type="submit" className="w-full font-extrabold bg-[#F2EFE8] hover:bg-[#F2EFE8] active:bg-[#F2EFE8] rounded-none text-black border-2 border-black shadow-[0_4px_0_0_rgba(0,0,0,1)] active:shadow-[0_0px_0_0_rgba(0,0,0,1)] pointer-events-none transition-all active:translate-y-1">
              <Loader2 className="mr-1 h-4 w-4 animate-spin text-black" />
              create category
            </Button>
            </>
            : 
            <>
            <Button form="form" type="submit" className="w-full font-extrabold bg-[#F2EFE8] hover:bg-[#F2EFE8] active:bg-[#F2EFE8] rounded-none text-black border-2 border-black shadow-[0_4px_0_0_rgba(0,0,0,1)] active:shadow-[0_0px_0_0_rgba(0,0,0,1)] transition-all active:translate-y-1">
              create category
            </Button>
            </>
          }
        </DialogFooter>
      </DialogContent>
    </Dialog>
        </>
    )
}