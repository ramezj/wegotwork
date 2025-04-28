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
import { Loader2 } from "lucide-react"
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
        <Button variant={"default"} className="font-extrabold w-full bg-[#F2EFE8] hover:bg-[#F2EFE8] active:bg-[#F2EFE8] rounded-none text-black border-2 border-black shadow-[0_4px_0_0_rgba(0,0,0,1)] active:shadow-[0_0px_0_0_rgba(0,0,0,1)] transition-all active:translate-y-1">
        Create Organization
        </Button>    
        </DialogTrigger>
        <DialogDescription>
            
        </DialogDescription>
        <DialogContent className="w-[90%] !rounded-none bg-white border border-black">
        <DialogHeader>
        <DialogTitle className="text-left text-xl font-extrabold text-black">Create Organization</DialogTitle>
        </DialogHeader>
        <form className="grid items-center gap-3 text-left" onSubmit={create_organization}>
        <Label className='font-extrabold text-black text-left'>Name</Label>
        <Input placeholder="Enter name" required value={name} onChange={((e) => {setName(e.target.value)})} className="bg-white text-base border-2 border-black rounded-none font-medium text-black"/>
        <Label className='font-extrabold text-black text-left'>Slug</Label>
        <Input placeholder="Enter slug" required value={slug} onChange={((e) => {setSlug(e.target.value)})} className="bg-white text-base border-2 border-black rounded-none font-medium text-black"/>
        <div>
        <Button type="submit" 
        className={`w-full mt-4 font-extrabold bg-[#F2EFE8] hover:bg-[#F2EFE8] active:bg-[#F2EFE8] rounded-none text-black border-2 border-black shadow-[0_4px_0_0_rgba(0,0,0,1)] active:shadow-[0_0px_0_0_rgba(0,0,0,1)] transition-all active:translate-y-1`}>
            {
                loading
                ? 
                <>
                <Loader2 className="animate-spin" />
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

