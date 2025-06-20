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

type JobWithCategory = Prisma.JobGetPayload<{
    include: {
        category: true
    }
}>;

export function EditJobCard({ job, categories } : { job: JobWithCategory, categories: JobCategory[]}) {
    const [ current, setCurrent ] = useState<JobWithCategory>(job);
    const [ currentCategoryId, setCurrentCategoryId ] = useState<null | string>(job.categoryId === null ? "none" : job.categoryId);
    const [ loading, setLoading ] = useState<boolean>(false);
    const selectedCategoryName = categories.find((c) => c.id === currentCategoryId)?.name ?? "Select Category";
    const EditTheJob = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const response = await EditJob(current, currentCategoryId);
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
        <Card className="w-full rounded-none bg-theme border ">
        <CardHeader className=''>
        <div className="flex justify-between items-center w-full">
        <CardTitle className="text-white font-extrabold">
            Job Information
        </CardTitle>
        {/* <DeleteJobButton job={current as Job}/> */}
        </div>
        </CardHeader>
        <CardContent>
        <form onSubmit={EditTheJob} className="space-y-4">
                <div className="space-y-2">
                <Label className='font-extrabold text-white'>Title</Label>
                <Input required className="bg-accent border  text-white font-bold text-base rounded-none" placeholder="Enter job title" value={current.title} onChange={((e) => { setCurrent((previous) => ({...previous, title: e.target.value}))})}></Input>
                </div>
                <div className="space-y-2">
                <Label className='font-extrabold text-white'>Employment Type</Label>
                    <Select value={current.type} onValueChange={((e) => { setCurrent((previous) => ({ ...previous, type: e as Type}))})} >
                        <SelectTrigger value={current.type} className="bg-accent rounded-none border border-white/20 text-white font-bold text-base" defaultValue={current.type}>
                        <SelectValue>
                            {formatJobType(current.type)}
                        </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="bg-theme rounded-none border  text-white font-bold">
                            <SelectGroup className="space-y-1">
                                <SelectItem className="rounded-none" value="fulltime">Full Time</SelectItem>
                                <SelectItem className="rounded-none" value="parttime">Part Time</SelectItem>
                                <SelectItem className="rounded-none" value="internship">Internship</SelectItem>
                                <SelectItem className="rounded-none" value="contract">Contract</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                {/* <div className="space-y-2">
                <Label className="font-extrabold text-white">Country</Label>
                <CountryDropdown
                placeholder="Select country"
                defaultValue="USA"
                />
                </div> */}
                <div className="space-y-2">
                <Label className='font-extrabold text-white'>Category</Label>
                <div className="flex flex-row gap-2">
                    <Select
                        value={currentCategoryId ?? "Select Category"}
                        onValueChange={((e) => { 
                        setCurrentCategoryId(e as string);
                        })}>
                        <SelectTrigger className="bg-accent rounded-none border border-white/20  text-white font-bold text-base">
                        <SelectValue>
                            {selectedCategoryName}
                        </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="bg-accent rounded-none border  text-white font-bold">
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
                    className="rounded-none bg-accent text-white hover:bg-accent duration-300"
                    onClick={() => setCurrentCategoryId("none")}
                    >
                    <X className="w-4 h-4 text-white" />
                    </Button>
                </div>
                </div>
                <div className="space-y-2">
                <Label className='font-extrabold text-white'>Country</Label>
                <div className="flex flex-row gap-2">
                <Input className="bg-accent border  text-white font-bold text-base rounded-none"
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
                    className="bg-accent text-white hover:bg-accent duration-300 rounded-none"
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
                <Label className='font-extrabold text-white'>City</Label>
                <div className="flex flex-row gap-2">
                <Input className="bg-accent border  text-white font-bold text-base rounded-none"
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
                    className="bg-accent text-white hover:bg-accent rounded-none duration-300"
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
                <Label className='font-extrabold text-white'>Description</Label>
                <Textarea className="bg-accent border  text-white font-bold text-base rounded-none" placeholder="Provide a detailed job description" value={current.content as string} onChange={((e) => { setCurrent((previous) => ({...previous, content: e.target.value}))})}></Textarea>
                </div>
                <div className="gap-2">
                <Button type="submit" variant={"default"} disabled={loading} className="px-4 font-extrabold rounded-none">
                {loading ? <Loader2 className="animate-spin mr-2 text-black" /> : <></>}
                Save Changes
                </Button>
                </div>
        </form>
        </CardContent>
        </Card>
        </>
    )
}