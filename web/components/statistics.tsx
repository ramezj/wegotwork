import { Briefcase, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function TotalJobs({title, amount} : { title: string, amount: number}) {
    return (
        <>
        <Card className="w-full bg-white rounded-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl text-black font-extrabold">
                      {title}
                    </CardTitle>
                    <Briefcase className="size-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-extrabold text-black">{amount}</div>
                  </CardContent>
                </Card>
        </>
    )
}

export function TotalApplicants({title, amount} : { title: string, amount: number}) {
  return (
      <>
      <Card className="w-full bg-white rounded-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-extrabold text-black">
                    {title}
                  </CardTitle>
                  <Users className="size-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-extrabold text-black">{amount}</div>
                </CardContent>
              </Card>
      </>
  )
}