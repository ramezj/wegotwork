"use client"
import { Button } from "../ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card"
import Balancer from "react-wrap-balancer"

export function DeleteOrganizationCard() {
    return (
        <Card className="w-full bg-white rounded-none border">
        <CardHeader>
            <CardTitle className='font-extrabold text-black'>delete organization</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h1 className='font-bold text-black w-fit sm:text-base text-sm'>
                {/* once deleted, this organization and all its associated data will be permanently removed. this action cannot be undone. */}
                are you sure you want to delete this organization?
            </h1>
            <Button variant={"destructive"} className='font-bold rounded-none'>
                delete organization
            </Button>
        </CardContent>
        </Card>
    )
}