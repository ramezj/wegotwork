"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"

export function BillingCard() {
    return (
        <>
        <Card className="w-full bg-white rounded-none">
        <CardHeader>
        <CardTitle className="text-2xl font-extrabold text-black">subscription plan</CardTitle>
        </CardHeader>
        <CardContent className="">
        <p className="font-bold text-black">
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