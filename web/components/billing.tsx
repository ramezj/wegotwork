"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"

export function BillingCard() {
    return (
        <>
        <Card className="w-full dark:bg-theme bg-gray-200 rounded-none border-dashed">
        <CardHeader>
        <CardTitle className="text-2xl font-extrabold text-foreground">Subscription plan</CardTitle>
        </CardHeader>
        <CardContent className="">
        <p className="font-bold text-foreground">
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