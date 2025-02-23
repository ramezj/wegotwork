"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"

export function BillingCard() {
    return (
        <>
        <Card className="w-full bg-background">
        <CardHeader>
        <CardTitle className="text-2xl font-bold">Subscription Plan</CardTitle>
        </CardHeader>
        <CardContent className="">
        <p className="text-muted-foreground">
          Premium Plan
        </p>
        </CardContent>
        {/* <CardFooter>
        <p className="text-sm text-muted-foreground">
          Add team members to join your organization & help you recruit.
        </p>
        </CardFooter> */}
        </Card>
        </>
    )
}