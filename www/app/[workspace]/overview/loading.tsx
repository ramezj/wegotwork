import { Metadata } from "next"
import { Button } from "@/components/ui/button";
import { SquareArrowOutUpRight, ArrowUpRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { Home } from "lucide-react";

export const metadata: Metadata = {
    title: "Loading",
    description: "Generated by create next app",
  };

export default function Loading() {
    return (
        <>
        <div className="flex justify-between items-center w-full">
        <h1 className="font-bold text-3xl tracking-tight">Overview</h1>
        <Button size={"sm"}>
            <Home className="size-4" />
        </Button>
        </div>
        <div className="w-full h-full items-center flex flex-col justify-center">
        <Loader2 className="size-8 animate-spin dark:text-white text-black" />
        </div>
        </>
    )
}