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
        } else {
            toast(create?.message);
        }
        setLoading(false);
    }
    return (
        <>
        <Dialog>
        <DialogTrigger asChild>
        <Button variant={"outline"} className="w-full font-extrabold rounded-sm border-none hover:bg-black">
        create organization
        </Button>    
        </DialogTrigger>
        <DialogContent className="w-[90%] !rounded-sm bg-white border border-black">
        <DialogHeader>
        <DialogTitle className="text-left text-xl font-extrabold text-black">create organization</DialogTitle>
        </DialogHeader>
        <form className="grid items-center gap-3 text-left" onSubmit={create_organization}>
        <Label className='font-extrabold text-black text-left'>name</Label>
        <Input placeholder="organization name" required value={name} onChange={((e) => {setName(e.target.value)})} className="bg-white border border-black rounded-sm text-black font-extrabold"/>
        <Label className='font-extrabold text-black text-left'>slug</Label>
        <Input placeholder="organization slug" required value={slug} onChange={((e) => {setSlug(e.target.value)})} className="bg-white border border-black rounded-sm text-black font-extrabold"/>
        <div>
        <Button type="submit" disabled={loading}  className="w-full mt-2 font-extrabold bg-black text-white hover:bg-black hover:text-white rounded-sm">
            {
                loading
                ? 
                <>
                <Loader2 className="animate-spin" />
                create organization
                </>
                : 
                <>
                create organization
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

