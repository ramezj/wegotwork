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
        toast(res.message as string);
        setLoading(false);
    }
    return (
        <Card className="w-full bg-theme rounded-none border border-dashed">
            <CardHeader>
                <CardTitle className="text-white font-medium">
                    Organization
                </CardTitle>
            </CardHeader>
        <CardContent>
        <form onSubmit={editOrganization} className="space-y-4">
        <div className="space-y-2">
        <Label className='font-medium text-white'>Name</Label>
        <Input className="bg-accent border border-dashed hover:border-white/50 active:border-white/50 focus:border-white/50 rounded-none font-medium text-white text-sm" required placeholder="Enter name" value={current.name} onChange={((e) => { setCurrent((previous) => ({...previous, name: e.target.value}))})}></Input>
        </div>
        <div className="space-y-2">
        <Label className='font-medium text-white'>Slug</Label>
        <Input className="bg-accent border border-dashed hover:border-white/50 active:border-white/50 focus:border-white/50 rounded-none font-medium text-white text-sm" required placeholder="Enter slug" value={current.slug} onChange={
            ((e) => { 
                const newSlug = e.target.value.replace(/\s+/g, '-');
                setCurrent((previous) => ({...previous, slug: newSlug }))})
        }></Input>
        </div>
        <div className="space-y-2">
        <Label className='font-medium text-white'>Website</Label>
        <Input className="bg-accent border border-dashed hover:border-white/50 active:border-white/50 focus:border-white/50 rounded-none font-medium text-white text-sm" 
        type="url"
        placeholder="Enter organization's website" 
        value={current.website === null ? "" : current.website } 
        onChange={((e) => { setCurrent((previous) => ({...previous, website: e.target.value}))})} />
        </div>
        <div className="space-y-2">
        <Label className='font-medium text-white'>Description</Label>
        <Textarea className="bg-accent border border-dashed rounded-none hover:border-white/50 active:border-white/50 focus:border-white/50 font-medium text-white text-sm" placeholder="Provide a detailed organization description" value={current.description as string} onChange={((e) => { setCurrent((previous) => ({...previous, description: e.target.value}))})}></Textarea>
        </div>
        <div className="space-y-2">
        <Button disabled={loading} type="submit" variant={"default"} className="font-medium px-4 rounded-none">
        { loading ? <Loader2 className="animate-spin mr-2" /> : <></> }
        Save Changes
        </Button>
        </div>
        </form>
        </CardContent>
        </Card>
    )
}