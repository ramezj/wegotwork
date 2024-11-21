"use client"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { useState } from "react"
import { CreateWorkspace } from "@/actions/workspace/create"

export function CreateWorkspaceForm() {
    const [ name, setName ] = useState<string>("");
    return (
        <>
        <form onSubmit={(() => {
            CreateWorkspace(name);
        })}>
            <Input value={name} onChange={((e) => {setName(e.target.value)})} />
            <Button type="submit">Submit</Button>
        </form>
        </>
    )
}