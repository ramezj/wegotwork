"use client"
import { Loader2, Plus, Trash, X } from "lucide-react"
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
import { redirect } from "next/navigation"

type JobWithCategory = Prisma.JobGetPayload<{
    include: {
        category: true
    }
}>;

export function EditJobCard({ job, categories } : { job: JobWithCategory, categories: JobCategory[]}) {
    const [ current, setCurrent ] = useState<JobWithCategory>(job);
    const [ currentCategoryId, setCurrentCategoryId ] = useState<null | string>(job.categoryId === null ? "none" : job.categoryId);
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ deleteLoading, setDeleteLoading ] = useState<boolean>(false);
    const selectedCategoryName = categories.find((c) => c.id === currentCategoryId)?.name ?? "Select Category";
    const EditTheJob = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const response = await EditJob(current, currentCategoryId);
        toast(response?.message as string)
        setLoading(false);
    }
    const deletejob = async (e: React.FormEvent) => {
      e.preventDefault();
      setDeleteLoading(true);
      const res = await DeleteJob(job.id);
      toast(res.message);
      if(res.error === false) {
        redirect('/jobs');
      }
      setDeleteLoading(false);
    }
    return (
        <>
        <div className="flex lg:flex-row flex-col gap-4">
        <Card className="w-full rounded-none bg-theme border border-dashed">
        <CardHeader className=''>
        <div className="flex justify-between items-center w-full">
        <CardTitle className="text-white font-medium">
        Information
        </CardTitle>
        </div>
        </CardHeader>
        <CardContent>
        <form onSubmit={EditTheJob} className="space-y-4">
                <div className="space-y-2">
                <Label className='font-medium text-white'>Title</Label>
                <Input required className="bg-accent border border-dashed text-white font-medium text-sm rounded-none" placeholder="Enter job title" value={current.title} onChange={((e) => { setCurrent((previous) => ({...previous, title: e.target.value}))})}></Input>
                </div>
                <div className="space-y-2">
                <Label className='font-medium text-white'>Employment Type</Label>
                    <Select value={current.type} onValueChange={((e) => { setCurrent((previous) => ({ ...previous, type: e as Type}))})} >
                        <SelectTrigger value={current.type} className="bg-accent rounded-none border border-dashed border-white/20 text-white font-medium text-sm" defaultValue={current.type}>
                        <SelectValue>
                            {formatJobType(current.type)}
                        </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="bg-theme rounded-none border border-dashed text-white font-medium">
                            <SelectGroup className="space-y-1">
                                <SelectItem className="rounded-none" value="fulltime">Full Time</SelectItem>
                                <SelectItem className="rounded-none" value="parttime">Part Time</SelectItem>
                                <SelectItem className="rounded-none" value="internship">Internship</SelectItem>
                                <SelectItem className="rounded-none" value="contract">Contract</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                <Label className='font-medium text-white'>Category</Label>
                <div className="flex flex-row gap-2">
                    <Select
                        value={currentCategoryId ?? "Select Category"}
                        onValueChange={((e) => { 
                        setCurrentCategoryId(e as string);
                        })}>
                        <SelectTrigger className="bg-accent rounded-none border border-dashed border-white/20  text-white font-medium text-sm">
                        <SelectValue>
                            {selectedCategoryName}
                        </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="bg-accent rounded-none border  text-white font-medium">
                            <SelectGroup className="space-y-1">
                            <SelectItem value="none">
                                No Category
                            </SelectItem>
                                {
                                    categories.map((category: JobCategory) => {
                                        return (
                                            <SelectItem 
                                            key={category.id} 
                                            value={category.id}>
                                            {category.name}
                                            </SelectItem>
                                        )
                                    })
                                }
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Button
                    disabled={currentCategoryId === "none"}
                    variant={"outline"}
                    type="button"
                    className="rounded-none bg-accent border-dashed text-white hover:bg-accent duration-300"
                    onClick={() => setCurrentCategoryId("none")}
                    >
                    <X className="w-4 h-4 text-white" />
                    </Button>
                </div>
                </div>
                {/* <div className="space-y-2">
                <Label className='font-medium text-white'>Description</Label>
                <Textarea className="bg-accent border border-dashed text-white font-medium text-sm rounded-none" placeholder="Provide a detailed job description" value={current.content as string} onChange={((e) => { setCurrent((previous) => ({...previous, content: e.target.value}))})}></Textarea>
                </div> */}
                <div className="gap-2">
                <Button type="submit" variant={"default"} disabled={loading} className="px-4 font-medium rounded-none">
                {loading ? <Loader2 className="animate-spin mr-2 text-black" /> : <></>}
                Save Changes
                </Button>
                </div>
        </form>
        </CardContent>
        </Card>
        <Card className="w-full rounded-none bg-theme border border-dashed">
        <CardHeader className=''>
        <div className="flex justify-between items-center w-full">
        <CardTitle className="text-white font-medium">
        Location
        </CardTitle>
        </div>
        </CardHeader>
        <CardContent>
        <form onSubmit={EditTheJob} className="space-y-4">
                <div className="space-y-2">
                <Label className='font-medium text-white'>Country</Label>
                <div className="flex flex-row gap-2">
                <Input className="bg-accent border border-dashed text-white font-medium text-sm rounded-none"
                placeholder="Enter country" value={current.country == null ? '' : current.country} 
                onChange={((e) => { 
                    setCurrent((previous) => ({
                        ...previous, 
                        country: e.target.value === '' ? null : e.target.value
                }))})} />
                <Button
                    disabled={current.country === null}
                    variant={"outline"}
                    type="button"
                    className="bg-accent text-white border-dashed hover:bg-accent duration-300 rounded-none"
                    onClick={() => {
                        setCurrent((previous) => ({
                            ...previous, 
                            country: null
                    }))
                    }}
                >
                <X className="w-4 h-4 text-white" />
                </Button>
                </div>
                </div>
                <div className="space-y-2">
                <Label className='font-medium text-white'>City</Label>
                <div className="flex flex-row gap-2">
                <Input className="bg-accent border border-dashed text-white font-medium text-sm rounded-none"
                placeholder="Enter city" 
                value={current.city == null ? '' : current.city} 
                onChange={((e) => { 
                    setCurrent((previous) => ({
                        ...previous, 
                        city: e.target.value === '' ? null : e.target.value
                }))})}/>
                <Button
                    disabled={current.city === null}
                    variant={"outline"}
                    type="button"
                    className="bg-accent border-dashed text-white hover:bg-accent rounded-none duration-300"
                    onClick={() => {
                        setCurrent((previous) => ({
                            ...previous, 
                            city: null
                    }))
                    }}
                    >
                <X className="w-4 h-4 text-white" />
                </Button>
                </div>
                </div>
                <div className="space-y-2">
                <Label className='font-medium text-white'>Remote Friendly</Label>
                    <Select value={current.remote === true ? "true" : "false"} onValueChange={((e) => { setCurrent((previous) => ({ ...previous, remote: e === "true"}))})} >
                        <SelectTrigger value={current.remote === true ? "true" : "false"} className="bg-accent rounded-none border border-dashed border-white/20 text-white font-medium text-sm" defaultValue={current.remote === true ? "true" : "false"}>
                        <SelectValue>
                            {current.remote === true ? "Remote Friendly" : "No Remote"}
                        </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="bg-theme rounded-none border border-dashed text-white font-medium">
                            <SelectGroup className="space-y-1">
                                <SelectItem className="rounded-none" value="false">No Remote</SelectItem>
                                <SelectItem className="rounded-none" value="true">Remote Friendly</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="gap-2">
                <Button type="submit" variant={"default"} disabled={loading} className="px-4 font-medium rounded-none">
                {loading ? <Loader2 className="animate-spin mr-2 text-black" /> : <></>}
                Save Changes
                </Button>
                </div>
        </form>
        </CardContent>
        </Card>
        </div>
        <div className="flex flex-col gap-4">
        <Card className="w-full rounded-none bg-theme border border-dashed">
        <CardHeader className=''>
        <div className="flex justify-between items-center w-full">
        <CardTitle className="text-white font-medium">
        Description
        </CardTitle>
        </div>
        </CardHeader>
        <CardContent>
        <form onSubmit={EditTheJob} className="space-y-4">
        <div className="space-y-2">
        <Label className='font-medium text-white'>Description</Label>
        <Textarea className="bg-accent border border-dashed text-white font-medium text-sm rounded-none" placeholder="Provide a detailed job description" value={current.content as string} onChange={((e) => { setCurrent((previous) => ({...previous, content: e.target.value}))})}></Textarea>
        </div> 
        <Button type="submit" variant={"default"} disabled={loading} className="px-4 font-medium rounded-none">
        {loading ? <Loader2 className="animate-spin mr-2 text-black" /> : <></>}
        Save Changes
        </Button>
        </form>
        </CardContent>
        </Card>
        <Card className="w-full rounded-none bg-theme border border-dashed">
        <CardHeader>
        <CardTitle className='font-medium text-white'>Delete Job</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className='font-medium text-white w-fit sm:text-base text-sm'>
        Are you sure you want to delete this job?
        </h1>
        <Button variant={"destructive"} className="rounded-none" 
        onClick={((e) => {deletejob(e)})}
        disabled={deleteLoading}>
        {deleteLoading ? <Loader2 className="size-4 mr-2 animate-spin text-white" /> : <></>}
        Delete Job
        </Button>
        </CardContent>
        </Card>
        </div>
        </>
    )
}                


{/* <div className="space-y-2">
                <Label className='font-medium text-white'>Description</Label>
                <Textarea className="bg-accent border border-dashed text-white font-medium text-sm rounded-none" placeholder="Provide a detailed job description" value={current.content as string} onChange={((e) => { setCurrent((previous) => ({...previous, content: e.target.value}))})}></Textarea>
                </div> */}