"use client"
import { Loader2 } from "lucide-react"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Organization } from "@prisma/client"
import { useState } from "react"
import { EditOrganization } from "@/actions/organization/edit-organization"
import { toast } from "sonner"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card"
import { Textarea } from "../ui/textarea"

export function SettingsCard({ organization } : { organization: Organization}) {
    const [ current, setCurrent ] = useState<Organization>(organization);
    const [ loading, setLoading ] = useState<boolean>(false);
    const editOrganization = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true)
        const res = await EditOrganization(current);
        toast(
            <div className="font-bold">
                <h1 className="font-bold">{res.message as string}</h1>
            </div>
        );
        setLoading(false);
    }
    return (
        <Card className="w-full bg-white rounded-none">
            <CardHeader>
                <CardTitle className="text-black font-extrabold">
                    Organization
                </CardTitle>
            </CardHeader>
        <CardContent>
        <form onSubmit={editOrganization} className="space-y-4">
        <div className="space-y-2">
        <Label className='font-extrabold text-black'>Name</Label>
        <Input className="bg-white border border-black rounded-none text-black font-bold text-base" required placeholder="Enter name" value={current.name} onChange={((e) => { setCurrent((previous) => ({...previous, name: e.target.value}))})}></Input>
        </div>
        <div className="space-y-2">
        <Label className='font-extrabold text-black'>Slug</Label>
        <Input className="bg-white border border-black rounded-none text-black font-bold text-base" required placeholder="Enter slug" value={current.slug} onChange={
            ((e) => { 
                const newSlug = e.target.value.replace(/\s+/g, '-');
                setCurrent((previous) => ({...previous, slug: newSlug }))})
        }></Input>
        </div>
        <div className="space-y-2">
        <Label className='font-extrabold text-black'>Website</Label>
        <Input className="bg-white border border-black rounded-none text-black font-bold text-base" 
        required 
        placeholder="Enter organization's website" 
        value={current.website === null ? "" : current.website } 
        onChange={((e) => { setCurrent((previous) => ({...previous, website: e.target.value}))})} />
        </div>
        <div className="space-y-2">
        <Label className='font-extrabold text-black'>Description</Label>
        <Textarea className="bg-white border border-black rounded-none text-black font-bold text-base" placeholder="Provide a detailed organization description" value={current.description as string} onChange={((e) => { setCurrent((previous) => ({...previous, description: e.target.value}))})}></Textarea>
        </div>
        <div className="space-y-2">
        {
            loading
            ? 
            <>
            <Button type="submit" disabled className="font-extrabold bg-black hover:bg-black rounded-none text-white">
            <Loader2 className="animate-spin mr-2" />
            save changes
            </Button>
            </>
            :
            <>
            <Button type="submit" className="font-extrabold bg-black hover:bg-black rounded-none text-white">
            save changes
            </Button>
            </>
        }
        </div>
        </form>
        </CardContent>
        </Card>
    )
}