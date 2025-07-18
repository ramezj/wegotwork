"use client"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { useState } from "react"
import { CreateOrganization } from "@/actions/organization/create-organization"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import { Label } from "./ui/label"
import { Loader2, Plus } from "lucide-react"
// import { redirect } from "next/navigation"
import { toast } from "sonner"
import { useEffect } from "react"
import { DialogDescription } from "@radix-ui/react-dialog"
import { redirect } from "next/navigation"
  

export function CreateOrganizationButton() {
    const [ name, setName ] = useState<string>("");
    const [ slug, setSlug ] = useState<string>("");
    const [ loading, setLoading ] = useState<boolean>(false);
    useEffect(() => {
        setSlug(name.trim().toLowerCase().replace(/\s+/g, "-"));
      }, [name]);
    
    const create_organization = async (e:React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const create = await CreateOrganization(name, slug);
        if(create?.organization) {
            toast(create.message)
            redirect('/overview')
        } else {
            toast(create?.message);
        }
        setLoading(false);
    }
    return (
        <>
        <Dialog>
        <DialogTrigger asChild>
        <Button variant={"outline"} className="font-medium w-full bg-theme border border-dashed rounded-none">
        <Plus className="text-white"/>
        </Button>    
        </DialogTrigger>
        <DialogDescription>
            
        </DialogDescription>
        <DialogContent className="w-[90%] bg-theme border border-dashed !rounded-none">
        <DialogHeader>
        <DialogTitle className="text-left text-xl font-medium text-white">Create Organization</DialogTitle>
        </DialogHeader>
        <form className="grid items-center gap-3 text-left" onSubmit={create_organization}>
        <Label className='font-medium text-white text-left'>Name</Label>
        <Input placeholder="Enter name" required value={name} onChange={((e) => {setName(e.target.value)})} 
        className="bg-accent text-base border border-dashed font-medium text-white rounded-none"/>
        <Label className='font-medium text-white text-left'>Slug</Label>
        <Input placeholder="Enter slug" required value={slug} onChange={((e) => {setSlug(e.target.value)})} 
        className="bg-accent text-base border border-dashed font-medium text-white rounded-none"/>
        <div>
        <Button type="submit" 
        disabled={loading}
        variant={"default"}
        className="w-full text-white bg-blueColor hover:bg-blueColor mt-4 font-medium rounded-none">
            {
                loading
                ? 
                <>
                <Loader2 className="animate-spin text-white" />
                Create Organization
                </>
                : 
                <>
                Create Organization
                </>
            }
        </Button>
        </div>    
        </form>
        </DialogContent>
        </Dialog>
        </>
    )
}

