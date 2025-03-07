"use client"
import { Loader2, Trash } from "lucide-react"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Job, Type } from "@prisma/client"
import { useState } from "react"
import { toast } from "sonner"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent,  SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card"
import { SelectGroup } from "@radix-ui/react-select"
// import { EditJob } from "@/actions/jobs/edit-job"
import { formatJobType } from "@/lib/format-job"
// import { DeleteJob } from "@/actions/jobs/delete-job"
// import { DeleteJobButton } from "../delete-job"

export function EditJobCard({ job } : { job: Job}) {
    const [ current, setCurrent ] = useState<Job>(job);
    const [ loading, setLoading ] = useState<boolean>(false);
    const EditTheJob = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // const response = await EditJob(current);
        // toast(response?.message as string)
        setLoading(false);
    }
    const deletejob = async () => {
      setLoading(true);
    //   const res = await DeleteJob(job.id);
      setLoading(false);
    }
    return (
        <>
        <Card className="w-full bg-white rounded-sm">
                    <CardHeader>
                        <CardTitle className="text-black font-extrabold">
                            job information
                        </CardTitle>
                    </CardHeader>
        {/* <DeleteJobButton job={current as Job}/> */}
        <CardContent>
        <form onSubmit={EditTheJob} className="space-y-4">
                <div className="space-y-2">
                <Label className='font-extrabold text-black'>Job Title</Label>
                    <Input className="bg-white border border-black rounded-sm text-black font-extrabold" placeholder="Job name" value={current.title} onChange={((e) => { setCurrent((previous) => ({...previous, title: e.target.value}))})}></Input>
                </div>
                <div className="space-y-2">
                <Label className='font-extrabold text-black'>Employment Type</Label>
                    <Select value={current.type} defaultValue={current.type} onValueChange={((e) => { setCurrent((previous) => ({ ...previous, type: e as Type}))})}>
                        <SelectTrigger value={current.type} className="bg-white border border-black rounded-sm text-black font-extrabold" defaultValue={current.type}>
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
                <Label className='font-extrabold text-black'>Job Location</Label>
                <Input className="bg-white border border-black rounded-sm text-black font-extrabold" placeholder="Job Location" value={current.location == null ? '' : current.location} onChange={((e) => { setCurrent((previous) => ({...previous, location: e.target.value}))})}></Input>
                </div>
                <div className="space-y-2">
                <Label className='font-extrabold text-black'>Job Description</Label>
                <Textarea className="bg-white border border-black rounded-sm text-black font-extrabold" placeholder="Job description" value={current.content as string} onChange={((e) => { setCurrent((previous) => ({...previous, content: e.target.value}))})}></Textarea>
                </div>
                <div className="gap-2">
                {
                    loading
                    ? 
                    <>
                    <Button type="submit" disabled className="bg-black text-white font-extrabold hover:bg-black rounded-sm">
                    <Loader2 className="animate-spin mr-2" />
                    save changes
                    </Button>
                    </>
                    :
                    <>
                    <Button type="submit" className="bg-black text-white font-extrabold hover:bg-black rounded-sm">
                    save changes
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