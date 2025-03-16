"use client"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import React, { useState } from "react"
// import { applyToJob } from "@/server-actions/applicants/apply-to-job"
import { Loader2, Upload } from "lucide-react"
import { Textarea } from "./ui/textarea"
import { toast } from "sonner"


export default function ApplyCard({ jobId }: { jobId: string}) {
    const [ name, setName ] = useState<string>();
    const [ emailAddress, setEmailAddress ] = useState<string>();
    const [ phoneNumber, setPhoneNumber ] = useState<number>();
    const [ file, setFile ] = useState<File | null>();
    const [ motivation, setMotivation ] = useState<string>();
    const [ loading, setLoading ] = useState<boolean>(false);
    const apply = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file!);
        setLoading(true);
        // const res = await applyToJob(jobId, name!, emailAddress!, phoneNumber!, motivation!, formData);
        setLoading(false);
        // if(res.ok) {
        //     toast.success(res.message);
        // } else {
        //     toast.error(res.message);
        // }
    }
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        setFile(selectedFile);
      };
    return (
        <>
            <div className="lg:w-1/2 w-full rounded-sm bg-white border border-black p-7 text-left">
            <form onSubmit={apply} className="space-y-4">
            <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-black text-center">apply to job</h1>
            </div>
            <div className="space-y-2">
            <Label htmlFor="name" className="text-black font-extrabold">full name</Label>
            <Input className="bg-white border border-black rounded-sm text-black font-extrabold" required placeholder="Enter your full name" value={name} onChange={((e) => {setName(e.target.value)})} />
            </div>
            <div className="space-y-2">
            <Label htmlFor="name" className="text-black font-extrabold">email address</Label>
            <Input className="bg-white border border-black rounded-sm text-black font-extrabold" required placeholder="Enter your email address" value={emailAddress} onChange={((e) => {setEmailAddress(e.target.value)})} />
            </div>
            <div className="space-y-2">
            <Label htmlFor="name" className="text-black font-extrabold">phone number</Label>
            <Input className="bg-white border border-black rounded-sm text-black font-extrabold" required type="number" placeholder="Enter your phone number" value={phoneNumber} onChange={((e) => {setPhoneNumber(Number(e.target.value))})} />
            </div>
            <div className="space-y-2">
            <Label htmlFor="name" className="text-black font-extrabold">resume</Label>
            <div>
            <Input className="bg-white file:text-black file:font-bold border border-black rounded-sm text-black font-extrabold" required type="file" id="file" name="file" accept=".pdf" onChange={handleFileChange} />
            </div>
            </div>
            <div className="space-y-2"> 
            <Label htmlFor="motivation" className="text-black font-extrabold">motivation letter</Label>
            <Textarea className="bg-white border border-black rounded-sm text-black font-extrabold" required value={motivation} onChange={((e) => {setMotivation(e.target.value)})} placeholder="Tell us why you're the best candidate for this position" />
            </div>
            {
                loading 
                ?  
                <Button disabled className="w-full bg-black text-white font-extrabold hover:bg-black hover:text-white rounded-sm">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                apply to job
                </Button>
                :
                <Button type="submit" className="w-full bg-black text-white font-extrabold hover:bg-black hover:text-white rounded-sm">
                apply to job
                </Button>
            }
            </form>
            </div>
        </>
    )
}