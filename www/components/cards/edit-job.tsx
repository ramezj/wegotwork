"use client"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Loader2, Trash } from "lucide-react"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Job, Type, Workspace } from "@prisma/client"
import { useState } from "react"
import { EditWorkspace } from "@/actions/workspace/edit-workspace"
import { toast } from "sonner"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent,  SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { SelectGroup } from "@radix-ui/react-select"

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
        <Button size={"icon"} variant={"destructive"}>
            <Trash className="size-4" />
        </Button>
        </CardHeader>
        <CardContent>
        <form className="space-y-4">
        <div className="space-y-2">
        <Label>Job Title</Label>
        <Input placeholder="Workspace name" value={current.title} onChange={((e) => { setCurrent((previous) => ({...previous, title: e.target.value}))})}></Input>
        </div>
        <div className="space-y-2">
        <Label>Job Type</Label>
        <Select defaultValue={current.type} onValueChange={((e) => { setCurrent((previous) => ({ ...previous, type: e as Type}))})}>
            <SelectTrigger className="" defaultValue={current.type}>
                <SelectValue defaultValue={current.type}/>
            </SelectTrigger>
            <SelectContent className="bg-background">
                <SelectGroup>
                    <SelectItem value="fulltime">Full Time</SelectItem>
                    <SelectItem value="parttime">Part Time</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
        </div>
        <div className="space-y-2">
        <Label>Job Description</Label>
        <Textarea placeholder="Job description" value={current.content as string} onChange={((e) => { setCurrent((previous) => ({...previous, content: e.target.value}))})}></Textarea>
        </div>
        <div className="gap-2">
        {
            loading
            ? 
            <>
            <Button type="submit" disabled className="">
            <Loader2 className="animate-spin mr-2" />
            Save Changes
            </Button>
            </>
            :
            <>
            <Button type="submit" className="">
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