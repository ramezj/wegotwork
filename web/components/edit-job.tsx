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
        <Card className="w-full bg-white rounded-none border-2 border-black shadow-[0_4px_0_0_rgba(0,0,0,1)]">
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
                    <Input required className="bg-white border-2 border-2-black rounded-none text-black font-bold text-base" placeholder="Enter job title" value={current.title} onChange={((e) => { setCurrent((previous) => ({...previous, title: e.target.value}))})}></Input>
                </div>
                <div className="space-y-2">
                <Label className='font-extrabold text-black'>Employment Type</Label>
                    <Select value={current.type} onValueChange={((e) => { setCurrent((previous) => ({ ...previous, type: e as Type}))})}>
                        <SelectTrigger value={current.type} className="bg-white border-2 border-2-black rounded-none text-black font-bold text-base" defaultValue={current.type}>
                        <SelectValue>
                            {formatJobType(current.type)}
                        </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="bg-white rounded-none border-2 border-2-black text-black font-bold">
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
                <div className="flex flex-row gap-2">
                    <Select
                        value={currentCategoryId ?? "Select Category"}
                        onValueChange={((e) => { 
                        setCurrentCategoryId(e as string);
                        })}>
                        <SelectTrigger className="bg-white border-2 border-2-black rounded-none text-black font-bold text-base">
                        <SelectValue>
                            {selectedCategoryName}
                        </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="bg-white rounded-none border-2 border-2-black text-black font-bold">
                            <SelectGroup className="space-y-1">
                            <SelectItem value="none" className="hover:!bg-black active:!bg-black focus:!bg-black hover:text-white rounded-none">
                                No Category
                            </SelectItem>
                                {
                                    categories.map((category: JobCategory) => {
                                        return (
                                            <SelectItem 
                                            className={`hover:!bg-black active:!bg-black focus:!bg-black hover:text-white rounded-none`} 
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
                    variant={"secondary"}
                    type="button"
                    className="bg-black rounded-none text-white hover:bg-black"
                    onClick={() => setCurrentCategoryId("none")}
                    >
                    <X className="w-4 h-4 text-white" />
                    </Button>
                </div>
                </div>
                <div className="space-y-2">
                <Label className='font-extrabold text-black'>Country</Label>
                <div className="flex flex-row gap-2">
                <Input className="bg-white border-2 border-2-black rounded-none text-black font-bold text-base" 
                placeholder="Enter country" value={current.country == null ? '' : current.country} 
                onChange={((e) => { 
                    setCurrent((previous) => ({
                        ...previous, 
                        country: e.target.value === '' ? null : e.target.value
                }))})} />
                <Button
                    disabled={current.country === null}
                    variant={"secondary"}
                    type="button"
                    className="bg-black rounded-none text-white hover:bg-black"
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
                <Label className='font-extrabold text-black'>City</Label>
                <div className="flex flex-row gap-2">
                <Input className="bg-white border-2 border-2-black rounded-none text-black font-bold text-base" 
                placeholder="Enter city" 
                value={current.city == null ? '' : current.city} 
                onChange={((e) => { 
                    setCurrent((previous) => ({
                        ...previous, 
                        city: e.target.value === '' ? null : e.target.value
                }))})}/>
                <Button
                    disabled={current.city === null}
                    variant={"secondary"}
                    type="button"
                    className="bg-black rounded-none text-white hover:bg-black"
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
                <Label className='font-extrabold text-black'>Description</Label>
                <Textarea className="bg-white border-2 border-2-black rounded-none text-black font-bold text-base" placeholder="Provide a detailed job description" value={current.content as string} onChange={((e) => { setCurrent((previous) => ({...previous, content: e.target.value}))})}></Textarea>
                </div>
                <div className="gap-2">
                {
                    loading
                    ? 
                    <>
                    <Button type="submit"
                    className="pointer-events-none font-extrabold !bg-[#F2EFE8] hover:bg-[#F2EFE8] active:bg-[#F2EFE8] rounded-none text-black border-2 border-black shadow-[0_4px_0_0_rgba(0,0,0,1)] active:shadow-[0_0px_0_0_rgba(0,0,0,1)] transition-all active:translate-y-1">
                    <Loader2 className="animate-spin mr-2 text-black" />
                    Save Changes
                    </Button>
                    </>
                    :
                    <>
                    <Button type="submit" className="font-extrabold bg-[#F2EFE8] hover:bg-[#F2EFE8] active:bg-[#F2EFE8] rounded-none text-black border-2 border-black shadow-[0_4px_0_0_rgba(0,0,0,1)] active:shadow-[0_0px_0_0_rgba(0,0,0,1)] transition-all active:translate-y-1">
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