"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Loader2, Settings } from "lucide-react"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Workspace } from "@prisma/client"
import { useState } from "react"
import { EditWorkspace } from "@/actions/workspace/edit-workspace"
import { toast } from "sonner"
import { Textarea } from "../ui/textarea"

export function SettingsCard({ workspace } : { workspace: Workspace}) {
    const [ current, setCurrent ] = useState<Workspace>(workspace);
    const [ loading, setLoading ] = useState<boolean>(false);
    const editworkspace = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true)
        const res = await EditWorkspace(current);
        toast(res.message as string);
        setLoading(false);
    }
    return (
        <>
        <Card className="w-full bg-background">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">
        Manage Workspace
        </CardTitle>
        <Settings className="size-4" />
        </CardHeader>
        <CardContent>
        <form onSubmit={editworkspace} className="space-y-4">
        <div className="space-y-2">
        <Label>Workspace Name</Label>
        <Input placeholder="Workspace name" value={current.name} onChange={((e) => { setCurrent((previous) => ({...previous, name: e.target.value}))})}></Input>
        </div>
        <div className="space-y-2">
        <Label>Workspace Slug</Label>
        <Input placeholder="Workspace slug" value={current.slug} onChange={((e) => { setCurrent((previous) => ({...previous, slug: e.target.value}))})}></Input>
        </div>
        <div className="space-y-2">
        <Label>Workspace Description</Label>
        <Textarea placeholder="Workspace description" value={current.description as string} onChange={((e) => { setCurrent((previous) => ({...previous, description: e.target.value}))})}></Textarea>
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
        </CardContent>
        </Card>
        </>
    )
}