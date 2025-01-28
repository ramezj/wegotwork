"use client"
import { Loader2, Trash } from "lucide-react"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Job, Type } from "@prisma/client"
import { useState } from "react"
import { toast } from "sonner"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent,  SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { SelectGroup } from "@radix-ui/react-select"
import { EditJob } from "@/actions/jobs/edit-job"
import { formatJobType } from "@/lib/format-job"

export function EditJobCard({ job } : { job: Job}) {
    const [ current, setCurrent ] = useState<Job>(job);
    const [ loading, setLoading ] = useState<boolean>(false);
    const EditTheJob = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const response = await EditJob(current);
        toast(JSON.stringify(response?.message))
        setLoading(false);
    }
    return (
        <>
        <div className="flex justify-between items-center w-full">
        <h1 className="font-bold text-3xl tracking-tight">Job Information</h1>
        <Button size={"icon"} variant={"destructive"}>
            <Trash className="size-4" />
        </Button>
        </div>
        <div>
        <form className="space-y-4" onSubmit={EditTheJob}>
        <div className="space-y-2">
        <Label>Job Title</Label>
        <Input placeholder="Job name" value={current.title} onChange={((e) => { setCurrent((previous) => ({...previous, title: e.target.value}))})}></Input>
        </div>
        <div className="space-y-2">
        <Label>Job Type</Label>
        <Select value={current.type} defaultValue={current.type} onValueChange={((e) => { setCurrent((previous) => ({ ...previous, type: e as Type}))})}>
            <SelectTrigger value={current.type} className="" defaultValue={current.type}>
              <SelectValue>
                {formatJobType(current.type)}
              </SelectValue>
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
        <Label>Job Location</Label>
        <Input placeholder="Job Location" value={current.title} onChange={((e) => { setCurrent((previous) => ({...previous, title: e.target.value}))})}></Input>
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
        </div>
        </>
    )
}