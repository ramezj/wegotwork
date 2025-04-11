"use client"
import { Loader2, Plus, Trash } from "lucide-react"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Job, JobCategory, Type } from "@prisma/client"
import { useState } from "react"
import { toast } from "sonner"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent,  SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card"
import { SelectGroup } from "@radix-ui/react-select"
import { EditJob } from "@/actions/jobs/edit-job"
import { formatJobType } from "@/lib/format-job"
import { DeleteJob } from "@/actions/jobs/delete-job"
import { DeleteJobButton } from "./delete-job"
import { CountryDropdown } from "./ui/country-dropdown"
import { Prisma } from "@prisma/client"

type JobWithCategory = Prisma.JobGetPayload<{
    include: {
        category: true
    }
}>;

export function EditJobCard({ job, categories } : { job: JobWithCategory, categories: JobCategory[]}) {
    const [ current, setCurrent ] = useState<JobWithCategory>(job);
    const [ loading, setLoading ] = useState<boolean>(false);
    const EditTheJob = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const response = await EditJob(current);
        toast(response?.message as string)
        setLoading(false);
    }
    const deletejob = async () => {
      setLoading(true);
      const res = await DeleteJob(job.id);
      setLoading(false);
    }
    return (
        <>
        <Card className="w-full bg-white rounded-none">
        <CardHeader className=''>
        <div className="flex justify-between items-center w-full">
        <CardTitle className="text-black font-extrabold">
            Job Information
        </CardTitle>
        {/* <DeleteJobButton job={current as Job}/> */}
        </div>
        </CardHeader>
        <CardContent>
        <form onSubmit={EditTheJob} className="space-y-4">
                <div className="space-y-2">
                <Label className='font-extrabold text-black'>Title</Label>
                    <Input required className="bg-white border border-black rounded-none text-black font-bold text-base" placeholder="Enter job title" value={current.title} onChange={((e) => { setCurrent((previous) => ({...previous, title: e.target.value}))})}></Input>
                </div>
                <div className="space-y-2">
                <Label className='font-extrabold text-black'>Employment Type</Label>
                    <Select value={current.type} defaultValue={current.type} onValueChange={((e) => { setCurrent((previous) => ({ ...previous, type: e as Type}))})}>
                        <SelectTrigger value={current.type} className="bg-white border border-black rounded-none text-black font-bold text-base" defaultValue={current.type}>
                        <SelectValue>
                            {formatJobType(current.type)}
                        </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="bg-white rounded-none border border-black text-black font-bold">
                            <SelectGroup className="space-y-1">
                                <SelectItem className="hover:!bg-black active:!bg-black focus:!bg-black hover:text-white rounded-none" value="fulltime">Full Time</SelectItem>
                                <SelectItem className="hover:!bg-black active:!bg-black focus:!bg-black hover:text-white rounded-none" value="parttime">Part Time</SelectItem>
                                <SelectItem className="hover:!bg-black active:!bg-black focus:!bg-black hover:text-white rounded-none" value="internship">Internship</SelectItem>
                                <SelectItem className="hover:!bg-black active:!bg-black focus:!bg-black hover:text-white rounded-none" value="contract">Contract</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                <Label className='font-extrabold text-black'>Category</Label>
                    <Select value={current.category?.name === null ? "No Category" : current.category?.name} defaultValue={current.category?.name === null ? "No Category" : current.category?.name} onValueChange={((e) => { setCurrent((previous) => ({ ...previous, categoryId: e as string}))})}>
                        <SelectTrigger value={current.category?.name === null ? "No Category" : current.category?.name} className="bg-white border border-black rounded-none text-black font-bold text-base" defaultValue={current.category?.name === null ? "No Category" : current.category?.name}>
                        <SelectValue>
                            {current.category?.name === null ? "No Category" : current.category?.name}
                        </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="bg-white rounded-none border border-black text-black font-bold">
                            <SelectGroup className="space-y-1">
                                {
                                    categories.map((category: JobCategory) => {
                                        return (
                                            <SelectItem key={category.id} value={category.id}>
                                            {category.name}
                                            </SelectItem>
                                        )
                                    })
                                }
                                <Button
                                variant={"default"}
                                type="button"
                                onClick={() => {
                                    // Open modal or inline input for new category creation
                                    console.log('Open category creation modal')
                                }}
                                className="w-full !text-left font-bold text-sm"
                                >
                                <Plus className="w-4 h-4 mr-2" />
                                Create New Category
                                </Button>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                <Label className='font-extrabold text-black'>Country</Label>
                <Input className="bg-white border border-black rounded-none text-black font-bold text-base" placeholder="Enter country" value={current.country == null ? '' : current.country} onChange={((e) => { setCurrent((previous) => ({...previous, country: e.target.value}))})}></Input>
                </div>
                <div className="space-y-2">
                <Label className='font-extrabold text-black'>City</Label>
                <Input className="bg-white border border-black rounded-none text-black font-bold text-base" placeholder="Enter city" value={current.city == null ? '' : current.city} onChange={((e) => { setCurrent((previous) => ({...previous, city: e.target.value}))})}></Input>
                </div>
                <div className="space-y-2">
                <Label className='font-extrabold text-black'>Description</Label>
                <Textarea className="bg-white border border-black rounded-none text-black font-bold text-base" placeholder="Provide a detailed job description" value={current.content as string} onChange={((e) => { setCurrent((previous) => ({...previous, content: e.target.value}))})}></Textarea>
                </div>
                <div className="gap-2">
                {
                    loading
                    ? 
                    <>
                    <Button type="submit" disabled className="bg-black text-white font-extrabold hover:bg-black rounded-none">
                    <Loader2 className="animate-spin mr-2" />
                    save changes
                    </Button>
                    </>
                    :
                    <>
                    <Button type="submit" className="bg-black text-white font-extrabold hover:bg-black rounded-none">
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