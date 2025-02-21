"use client"
import { Loader2 } from "lucide-react"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Organization } from "@prisma/client"
import { useState } from "react"
import { EditOrganization } from "@/actions/organization/edit-organization"
import { toast } from "sonner"
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
        <>
        <form onSubmit={editOrganization} className="space-y-4">
        <div className="space-y-2">
        <Label>Organization Title</Label>
        <Input required placeholder="Organization name" value={current.name} onChange={((e) => { setCurrent((previous) => ({...previous, name: e.target.value}))})}></Input>
        </div>
        <div className="space-y-2">
        <Label>Organization Slug</Label>
        <Input required placeholder="Organization slug" value={current.slug} onChange={((e) => { setCurrent((previous) => ({...previous, slug: e.target.value}))})}></Input>
        </div>
        <div className="space-y-2">
        <Label>Organization Description</Label>
        <Textarea placeholder="Organization description" value={current.description as string} onChange={((e) => { setCurrent((previous) => ({...previous, description: e.target.value}))})}></Textarea>
        </div>
        <div className="space-y-2">
        {
            loading
            ? 
            <>
            <Button type="submit" disabled>
            <Loader2 className="animate-spin mr-2" />
            Save Changes
            </Button>
            </>
            :
            <>
            <Button type="submit">
            Save Changes
            </Button>
            </>
        }
        </div>
        </form>
        </>
    )
}