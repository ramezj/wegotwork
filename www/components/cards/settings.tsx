"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Settings } from "lucide-react"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Workspace } from "@prisma/client"
import { useState } from "react"

export function SettingsCard({ workspace } : { workspace: Workspace}) {
    const [ current, setCurrent ] = useState<Workspace>(workspace);
    return (
        <>
        <Card className="w-full bg-background">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">
        Settings
        </CardTitle>
        <Settings className="size-4" />
        </CardHeader>
        <CardContent>
        <div className="space-y-4">
        <div className="space-y-2">
        <Label>Workspace Name</Label>
        <Input placeholder="Workspace name" value={current.name} onChange={((e) => { setCurrent((previous) => ({...previous, name: e.target.value}))})}></Input>
        </div>
        <div className="space-y-2">
        <Label>Workspace Slug</Label>
        <Input placeholder="Workspace slug" value={current.slug} onChange={(() => {})}></Input>
        </div>
        </div>
        </CardContent>
        </Card>
        </>
    )
}