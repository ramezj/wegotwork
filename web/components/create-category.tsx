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

export default function CreateCategoryButton() {
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
        <DialogTrigger asChild>
        <Button className="px-4 border bg-theme font-bold rounded-none" variant={"outline"}>
        Create Category
        </Button>
        </DialogTrigger>
      <DialogContent onOpenAutoFocus={((e) => {e.preventDefault()})} className="text-left w-[90%] bg-theme !rounded-none border">
        <DialogHeader>
          <DialogTitle className="text-left font-extrabold text-white !text-xl">Create a new category</DialogTitle>
          {/* <DialogDescription className="text-left text-black font-bold">
          create a job listing & start hiring immediately
          </DialogDescription> */}
        </DialogHeader>
        <div className="grid">
          <div className="grid items-center gap-4">
            <Label htmlFor="name" className="text-left font-extrabold text-white">
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
              className="bg-accent rounded-none border font-medium text-base"
            />
            </form>
          </div>
        </div>
        <DialogFooter>
          <Button disabled={loading} form="form" variant={"default"} className="w-full font-extrabold rounded-none">
            {loading ? <Loader2 className="mr-1 h-4 w-4 animate-spin text-black" /> : <></>}
            Create Category
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
        </>
    )
}