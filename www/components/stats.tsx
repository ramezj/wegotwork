import { Briefcase, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function TotalJobs({title, amount} : { title: string, amount: number}) {
    return (
        <>
        <Card className="w-full bg-background">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {title}
                    </CardTitle>
                    <Briefcase className="size-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{amount}</div>
                    <p className="text-xs text-muted-foreground">
                      +20.1% from last month
                    </p>
                  </CardContent>
                </Card>
        </>
    )
}

export function TotalApplicants({title, amount} : { title: string, amount: number}) {
  return (
      <>
      <Card className="w-full bg-background">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {title}
                  </CardTitle>
                  <Users className="size-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{amount}</div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                  </p>
                </CardContent>
              </Card>
      </>
  )
}