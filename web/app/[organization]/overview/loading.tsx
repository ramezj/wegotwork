import { Metadata } from "next"
import { Button } from "@/components/ui/button";
import { SquareArrowOutUpRight } from "lucide-react";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
    title: "Loading",
    description: "Generated by create next app",
  };

export default function Loading() {
    return (
        <>
        <div className="flex justify-between items-center w-full">
        <h1 className="font-extrabold text-4xl tracking-tight text-black">Overview</h1>
        <Button disabled size={"sm"} className="rounded-none font-extrabold border border-black">
            Preview
        <SquareArrowOutUpRight className="size-4" />
        </Button>
        </div>
        <div className="w-full h-full items-center flex flex-col justify-center">
        <Loader2 className="size-8 animate-spin text-black" />
        </div>
        </>
    )
}