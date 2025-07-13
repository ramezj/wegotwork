"use client"
import { Loader2 } from "lucide-react"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Organization } from "@prisma/client"
import { useState, useEffect } from "react"
import { EditOrganization } from "@/actions/organization/edit-organization"
import { toast } from "sonner"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card"
import { Textarea } from "../ui/textarea"

export function SettingsCard({ organization } : { organization: Organization}) {
    const [ current, setCurrent ] = useState<Organization>(organization);
    const [ loading, setLoading ] = useState<boolean>(false);
    
    // Update current state when organization prop changes
    useEffect(() => {
        setCurrent(organization);
    }, [organization]);
    
    const editOrganization = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true)
        const res = await EditOrganization(current);
        toast(res.message as string);
        setLoading(false);
    }
    return (
        <Card className="w-full dark:bg-theme bg-gray-200 rounded-none border border-dashed">
            <CardHeader>
                <CardTitle className="text-foreground font-extrabold">
                    Organization
                </CardTitle>
            </CardHeader>
        <CardContent>
        <form onSubmit={editOrganization} className="space-y-4">
        <div className="space-y-2">
        <Label className='font-bold text-foreground'>Name</Label>
        {/* hover:border-white/50 active:border-white/50 focus:border-white/50 */}
        <Input className="bg-accent border border-dashed rounded-none font-bold text-foreground text-sm" required placeholder="Enter name" value={current.name} onChange={((e) => { setCurrent((previous) => ({...previous, name: e.target.value}))})}></Input>
        </div>
        <div className="space-y-2">
        <Label className='font-bold text-foreground'>Slug</Label>
        {/* hover:border-white/50 active:border-white/50 focus:border-white/50 */}
        <Input className="bg-accent border border-dashed rounded-none font-bold text-foreground text-sm" required placeholder="Enter slug" value={current.slug} onChange={
            ((e) => { 
                const newSlug = e.target.value.replace(/\s+/g, '-');
                setCurrent((previous) => ({...previous, slug: newSlug }))})
        }></Input>
        </div>
        <div className="space-y-2">
        <Label className='font-bold text-foreground'>Website</Label>
        {/* hover:border-white/50 active:border-white/50 focus:border-white/50 */}
        <Input className="bg-accent border border-dashed rounded-none font-bold text-foreground text-sm" 
        type="url"
        placeholder="Enter organization's website" 
        value={current.website === null ? "" : current.website } 
        onChange={((e) => { setCurrent((previous) => ({...previous, website: e.target.value}))})} />
        </div>
        <div className="space-y-2">
        <Label className='font-bold text-foreground'>Description</Label>
        {/* hover:border-white/50 active:border-white/50 focus:border-white/50 */}
        <Textarea className="bg-accent border border-dashed rounded-none font-bold text-foreground text-sm" placeholder="Provide a detailed organization description" value={current.description as string} onChange={((e) => { setCurrent((previous) => ({...previous, description: e.target.value}))})}></Textarea>
        </div>
        <div className="space-y-2">
        <Button disabled={loading} type="submit" variant={"default"} className="bg-blueColor text-white hover:bg-blueColor font-bold px-4 rounded-none">
        { loading ? <Loader2 className="animate-spin mr-2" /> : <></> }
        Save Changes
        </Button>
        </div>
        </form>
        </CardContent>
        </Card>
    )
}