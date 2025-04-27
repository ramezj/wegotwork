"use client"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import React, { useState } from "react"
import { applyToJob } from "@/actions/jobs/apply-to-job"
import { Loader2, Upload } from "lucide-react"
import { Textarea } from "./ui/textarea"
import { toast } from "sonner"


export default function ApplyCard({ jobId }: { jobId: string}) {
    const [ name, setName ] = useState<string>("");
    const [ emailAddress, setEmailAddress ] = useState<string>("");
    const [ phoneNumber, setPhoneNumber ] = useState<number | null>(null);
    const [ file, setFile ] = useState<File | null>();
    const [ motivation, setMotivation ] = useState<string>("");
    const [ loading, setLoading ] = useState<boolean>(false);
    const apply = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file!);
        setLoading(true);
        const res = await applyToJob(jobId, name!, emailAddress!, motivation!, formData);
        setLoading(false);
        if(res.ok) {
            toast.success(res.message);
        } else {
            toast.error(res.message);
        }
    }
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        setFile(selectedFile);
      };
    return (
        <>
            <div className="lg:w-1/2 w-full rounded-none bg-white border-2 border-black p-7 text-left shadow-[0_4px_0_0_rgba(0,0,0,1)]">
            <form onSubmit={apply} className="space-y-4">
            <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-black text-center">Apply to job</h1>
            </div>
            <div className="space-y-2">
            <Label htmlFor="name" className="text-black font-extrabold">Full name</Label>
            <Input className="bg-white border-2 border-black rounded-none text-black font-bold text-base" required placeholder="Enter your full name" value={name} onChange={((e) => {setName(e.target.value)})} />
            </div>
            <div className="space-y-2">
            <Label htmlFor="name" className="text-black font-extrabold">Email address</Label>
            <Input className="bg-white border-2 border-black rounded-none text-black font-bold text-base" required placeholder="Enter your email address" value={emailAddress} onChange={((e) => {setEmailAddress(e.target.value)})} />
            </div>
            {/* <div className="space-y-2">
            <Label htmlFor="name" className="text-black font-extrabold">Phone number</Label>
            <Input className="bg-white border border-black rounded-none text-black font-bold text-base" required type="number" placeholder="Enter your phone number" value={phoneNumber ?? ""} onChange={((e) => {setPhoneNumber(Number(e.target.value))})} />
            </div> */}
            <div className="space-y-2">
            <Label htmlFor="name" className="text-black font-extrabold">Resume</Label>
            <div>
            <Input className="bg-white file:text-black file:font-bold border-2 border-black rounded-none text-black font-bold text-base" required type="file" id="file" name="file" accept=".pdf" onChange={handleFileChange} />
            </div>
            </div>
            <div className="space-y-2"> 
            <Label htmlFor="motivation" className="text-black font-extrabold">Cover letter</Label>
            <Textarea rows={6} className="bg-white border-2 border-black rounded-none text-black font-bold text-base" required value={motivation} onChange={((e) => {setMotivation(e.target.value)})} placeholder="Share why you're a great fit." />
            </div>
            {
                loading 
                ?  
                <Button className="w-full pointer-events-none font-extrabold bg-[#F2EFE8] hover:bg-[#F2EFE8] active:bg-[#F2EFE8] rounded-none text-black border-2 border-black shadow-[0_4px_0_0_rgba(0,0,0,1)] active:shadow-[0_0px_0_0_rgba(0,0,0,1)] transition-all active:translate-y-1">
                <Loader2 className="mr-2 h-4 w-4 animate-spin text-black" />
                Apply to Job
                </Button>
                :
                <Button type="submit" className="w-full font-extrabold bg-[#F2EFE8] hover:bg-[#F2EFE8] active:bg-[#F2EFE8] rounded-none text-black border-2 border-black shadow-[0_4px_0_0_rgba(0,0,0,1)] active:shadow-[0_0px_0_0_rgba(0,0,0,1)] transition-all active:translate-y-1">
                Apply to Job
                </Button>
            }
            </form>
            </div>
        </>
    )
}