
import { ArrowRightIcon, SquareArrowOutUpRight, CheckIcon, XIcon, CircleCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

export function FreeCard() {
    return (
        <>
        <Card className="w-[350px] bg-white rounded-none">
      <CardHeader>
        <CardTitle className='flex gap-2 font-extrabold text-black tracking-normal'>free</CardTitle>
        <CardDescription className="text-left text-black">free forever.</CardDescription>
      </CardHeader>
      <CardContent>
          <div className="grid w-full items-center gap-4">
          <h2 className="flex text-2xl font-extrabold -mt-3 text-black">
            $0/month
          </h2>
          <Separator />
            <div className="flex flex-col space-y-1.5">
                <h2 className="flex gap-2 text-black font-medium">
                    <CircleCheck className="text-black"/>
                    1 organization
                    </h2>
            </div>
            <div className="flex flex-col space-y-1.5">
                <h2 className="flex gap-2 text-black font-medium">
                    <CircleCheck className="text-black"/>
                    3 jobs
                    </h2>
            </div>
            <div className="flex flex-col space-y-1.5">
                <h2 className="flex gap-2 text-black font-medium">
                    <CircleCheck className="text-black"/>
                    25 total applicants
                    </h2>
            </div>
            <div className="flex flex-col space-y-1.5">
                <h2 className="flex gap-2 text-black font-medium">
                    <CircleCheck className="text-black"/>
                    lou Branding
                    </h2>
            </div>
            <div className="flex flex-col space-y-1.5">
                <h2 className="flex gap-2 text-black font-medium">
                <XIcon className="text-black"/>
                    candidate cv upload
                    </h2>
            </div>
          </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button className='w-full font-extrabold bg-black text-white rounded-none hover:bg-black hover:text-white' variant={"default"}>
              start hiring
        </Button>
      </CardFooter>
    </Card>
        </>
    )
}

export function PaidCard() {
    return (
        <>
        <Card className="w-[350px] bg-white rounded-none">
      <CardHeader>
        <CardTitle className='flex gap-2 font-extrabold text-black tracking-normal'>professional</CardTitle>
        <CardDescription className="text-left text-black">monthly subscription</CardDescription>
      </CardHeader>
      <CardContent>
          <div className="grid w-full items-center gap-4">
          <h2 className="flex text-2xl font-extrabold text-black -mt-3">
            $50/month
          </h2>
          <Separator />
            <div className="flex flex-col space-y-1.5">
                <h2 className="flex gap-2 text-black font-medium">
                    <CircleCheck className="text-black"/>
                    3 organizations
                    </h2>
            </div>
            <div className="flex flex-col space-y-1.5">
                <h2 className="flex gap-2 text-black font-medium">
                    <CircleCheck className="text-black"/>
                    unlimited jobs
                    </h2>
            </div>
            <div className="flex flex-col space-y-1.5 ">
                <h2 className="flex gap-2 text-black font-medium">
                    <CircleCheck className="text-black"/>
                    unlimited applicants
                    </h2>
            </div>
            <div className="flex flex-col space-y-1.5">
                <h2 className="flex gap-2 text-black font-medium">
                    <CircleCheck className="text-black"/>
                    candidate cv upload
                    </h2>
            </div>
            <div className="flex flex-col space-y-1.5">
                <h2 className="flex gap-2 text-black font-medium">
                    <XIcon className="text-black"/>
                    lou branding
                    </h2>
            </div>
          </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button className='w-full font-extrabold bg-black hover:bg-black text-white hover:text-white rounded-none' variant={"default"}>
              start hiring
        </Button>
      </CardFooter>
    </Card>
        </>
    )
}