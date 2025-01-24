"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Loader2, Settings } from "lucide-react"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Job, Workspace } from "@prisma/client"
import { useState } from "react"
import { EditWorkspace } from "@/actions/workspace/edit-workspace"
import { toast } from "sonner"
import { Textarea } from "../ui/textarea"

export function EditJobCard({ job } : { job: Job}) {
    const [ current, setCurrent ] = useState<Job>(job);
    const [ loading, setLoading ] = useState<boolean>(false);
    return (
        <>
        <Card className="w-full bg-background">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">
        Manage Job
        </CardTitle>
        <Settings className="size-4" />
        </CardHeader>
        <CardContent>
        <form className="space-y-4">
        <div className="space-y-2">
        <Label>Job Title</Label>
        <Input placeholder="Workspace name" value={current.title} onChange={((e) => { setCurrent((previous) => ({...previous, title: e.target.value}))})}></Input>
        </div>
        {/* <div className="space-y-2">
        <Label>Workspace Slug</Label>
        <Input placeholder="Workspace slug" value={current.} onChange={((e) => { setCurrent((previous) => ({...previous, slug: e.target.value}))})}></Input>
        </div> */}
        <div className="space-y-2">
        <Label>Workspace Description</Label>
        <Textarea placeholder="Workspace description" value={current.content as string} onChange={((e) => { setCurrent((previous) => ({...previous, content: e.target.value}))})}></Textarea>
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