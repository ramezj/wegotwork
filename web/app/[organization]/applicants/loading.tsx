import { Metadata } from "next"
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
    title: "Loading",
    description: "Generated by create next app",
};

export default function Loading() {
    return (
        <> 
        <div className="flex justify-between items-center w-full">
        <h1 className="font-extrabold text-4xl text-black tracking-tight">Applicants</h1>
        <Button disabled size={"sm"} variant={"default"} className="rounded-none font-extrabold border border-black">
        Create a new job
        </Button>
        </div>
        <div className="w-full h-full items-center flex flex-col justify-center">
        <Loader2 className="size-8 animate-spin text-black" />
        </div>
      </>
    )
}