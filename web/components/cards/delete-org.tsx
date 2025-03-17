"use client"
import { Button } from "../ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card"

export function DeleteOrganizationCard() {
    return (
        <Card className="w-full bg-white rounded-none border">
        <CardHeader>
            <CardTitle className='font-extrabold text-black'>delete organization</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-between items-center">
            <p className='font-bold text-black'>are you sure you want to delete this organization?</p>
            <Button variant={"destructive"} className='font-bold rounded-none'>
                delete organization
            </Button>
        </CardContent>
        </Card>
    )
}