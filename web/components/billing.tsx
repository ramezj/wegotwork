"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"

export function BillingCard() {
    return (
        <>
        <Card className="w-full bg-theme rounded-none">
        <CardHeader>
        <CardTitle className="text-2xl font-extrabold text-white">Subscription plan</CardTitle>
        </CardHeader>
        <CardContent className="">
        <p className="font-bold text-white">
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