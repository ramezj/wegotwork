
import { ArrowRightIcon, SquareArrowOutUpRight, CheckIcon, XIcon, CircleCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

export function FreeCard() {
    return (
        <>
        <Card className="w-[350px] bg-theme rounded-none border border-dashed">
        <CardHeader>
          <CardTitle className='flex gap-2 font-medium text-white tracking-normal'>Free</CardTitle>
          <CardDescription className="text-left text-white">Free Forever</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
          <h2 className="flex text-2xl font-medium -mt-3 text-white">
            $0/month
          </h2>
          <Separator />
            <div className="flex flex-col space-y-1.5">
                <h2 className="flex gap-2 text-white font-medium">
                    <CircleCheck className="text-white"/>
                    1 Organization
                    </h2>
            </div>
            <div className="flex flex-col space-y-1.5">
                <h2 className="flex gap-2 text-white font-medium">
                    <CircleCheck className="text-white"/>
                    3 Jobs
                    </h2>
            </div>
            <div className="flex flex-col space-y-1.5">
                <h2 className="flex gap-2 text-white font-medium">
                    <CircleCheck className="text-white"/>
                    25 Total Applicants
                    </h2>
            </div>
            <div className="flex flex-col space-y-1.5">
                <h2 className="flex gap-2 text-white font-medium">
                    <CircleCheck className="text-white"/>
                    Wegotwork Branding
                    </h2>
            </div>
            <div className="flex flex-col space-y-1.5">
                <h2 className="flex gap-2 text-white font-medium">
                <XIcon className="text-white"/>
                    Candidate CV Upload
                    </h2>
            </div>
          </div>
      </CardContent>
      <CardFooter className="flex justify-between">
      <Button variant={"default"} className="w-full font-medium rounded-none">
                Start Hiring
        </Button>
      </CardFooter>
    </Card>
        </>
    )
}

export function PaidCard() {
    return (
        <>
        <Card className="w-[350px] bg-theme rounded-none border border-dashed">
        <CardHeader>
          <CardTitle className='flex gap-2 font-medium text-white tracking-normal'>Professional</CardTitle>
          <CardDescription className="text-left text-white">Monthly Subscription</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
          <h2 className="flex text-2xl font-medium text-white -mt-3">
            $75/month
          </h2>
          <Separator />
            <div className="flex flex-col space-y-1.5">
                <h2 className="flex gap-2 text-white font-medium">
                    <CircleCheck className="text-white"/>
                    5 Organizations
                    </h2>
            </div>
            <div className="flex flex-col space-y-1.5">
                <h2 className="flex gap-2 text-white font-medium">
                    <CircleCheck className="text-white"/>
                    <i>Unlimited</i> Jobs
                    </h2>
            </div>
            <div className="flex flex-col space-y-1.5 ">
                <h2 className="flex gap-2 text-white font-medium">
                    <CircleCheck className="text-white"/>
                    <i>Unlimited</i> Applicants
                    </h2>
            </div>
            <div className="flex flex-col space-y-1.5">
                <h2 className="flex gap-2 text-white font-medium">
                    <CircleCheck className="text-white"/>
                    Candidate CV Upload
                    </h2>
            </div>
            <div className="flex flex-col space-y-1.5">
                <h2 className="flex gap-2 text-white font-medium">
                    <XIcon className="text-white"/>
                    Wegotwork Branding
                    </h2>
            </div>
          </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant={"default"} className="w-full font-medium rounded-none">
              Start Hiring
        </Button>
      </CardFooter>
    </Card>
        </>
    )
}