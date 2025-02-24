"use client"
import { Button } from "../ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card"

export function DeleteOrganizationCard() {
    return (
        <Card className="w-full bg-background">
        <CardHeader>
            <CardTitle>Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-between items-center">
            <p>Are you sure you want to delete this organization?</p>
            <Button variant={"destructive"}>
                Delete Organization
            </Button>
        </CardContent>
        </Card>
    )
}