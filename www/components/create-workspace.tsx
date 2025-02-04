"use client"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { useState } from "react"
import { CreateWorkspace } from "@/actions/workspace/create-workspace"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import { Label } from "./ui/label"
import { Loader2 } from "lucide-react"
import { redirect } from "next/navigation"
  

export function CreateWorkspaceButton() {
    const [ name, setName ] = useState<string>("");
    const [ slug, setSlug ] = useState<string>("");
    const [ loading, setLoading ] = useState<boolean>(false);
    const create_workspace = async (e:React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const create = await CreateWorkspace(name, slug);
        if(create?.workspace) {
            redirect(`/${create.workspace.id}/overview`)
        }
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
        <DialogContent className="w-[90%] rounded-lg">
        <DialogHeader>
        <DialogTitle className="text-left text-xl">Create Workspace</DialogTitle>
        <p className="text-muted-foreground text-sm text-left">Create a workspace, invite members & start hiring now.</p>
        </DialogHeader>
        <form className="grid items-center gap-3 text-left" onSubmit={create_workspace}>
        <Label className="text-left">
        Name
        </Label>
        <Input placeholder="Workspace name" required value={name} onChange={((e) => {setName(e.target.value)})} className="flex w-full"/>
        <Label className="text-left">
        Slug
        </Label>
        <Input placeholder="Workspace slug" required value={slug} onChange={((e) => {setSlug(e.target.value)})} className="flex w-full"/>
        <div>
        <Button type="submit"  className="w-full mt-2 font-semibold">
            {
                loading
                ? 
                <>
                <Loader2 className="animate-spin" />
                Creating Workspace
                </>
                : 
                <>Create Workspace</>
            }
        </Button>
        </div>    
        </form>
        </DialogContent>
        </Dialog>
        </>
    )
}