"use client"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { useState } from "react"
import { CreateWorkspace } from "@/actions/workspace/create"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  

export function CreateWorkspaceButton() {
    const [ name, setName ] = useState<string>("");
    const [ loading, setLoading ] = useState<boolean>(false);
    const create_workspace = async (e:React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const create = await CreateWorkspace(name);
        setLoading(false);
    }
    return (
        <>
        <Dialog>
        <DialogTrigger asChild>
        <Button variant={"outline"} className="w-full">
        Create Workspace
        </Button>    
        </DialogTrigger>
        <DialogContent>
        <DialogHeader>
            <DialogTitle>Create Workspace</DialogTitle>
        </DialogHeader>
        <form className="flex items-center gap-3" onSubmit={create_workspace}>
        <Input required value={name} onChange={((e) => {setName(e.target.value)})} className="flex-1 w-full"/>
        <div>
        <Button type="submit">
            {
                loading
                ? "Loading"
                : "Create"
            }
        </Button>
        </div>    
        </form>
        </DialogContent>
        </Dialog>
        </>
    )
}