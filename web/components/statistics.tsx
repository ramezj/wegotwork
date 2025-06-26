import { Briefcase, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

export function TotalJobs({title, amount} : { title: string, amount: number}) {
    return (
        <>
        <Card className="w-full bg-theme rounded-none border border-dashed">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-white font-medium">
                      {title}
                    </CardTitle>
                    <Briefcase className="size-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-medium text-white">{amount}</div>
                  </CardContent>
                </Card>
        </>
    )
}

export function TotalApplicants({title, amount} : { title: string, amount: number}) {
  return (
      <>
      <Card className="w-full bg-theme rounded-none border border-dashed">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="font-medium text-white">
                    {title}
                  </CardTitle>
                  <Users className="size-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-medium text-white">{amount}</div>
                </CardContent>
              </Card>
      </>
  )
}

export function Applicants({title, amount} : { title: string, amount: number}) {
  return (
      <>
      <Card className="w-full bg-white rounded-none  border-black border-2 shadow-[0_4px_0_0_rgba(0,0,0,1)]" >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className='text-black font-medium'>{title}</CardTitle>
            <Button className="rounded-none bg-white border border-black text-black" size="icon">
              <Users className="h-4 w-4" />
              <span className="sr-only">Add applicant</span>
            </Button>
          </div>
        </CardHeader>
                <CardContent>
                  <div className="text-2xl font-medium text-black">{amount}</div>
                </CardContent>
              </Card>
      </>
  )
}

