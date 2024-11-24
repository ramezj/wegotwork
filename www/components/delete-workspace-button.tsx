"use client"
import { Button } from "./ui/button"
import { Delete } from "lucide-react"
import { DeleteWorkspace } from "@/actions/workspace/delete-workspace"
import { useState } from "react"

interface props {
    workspaceId: string
}

export function DeleteWorkspaceButton(props: props) {
    const [ loading, setLoading ] = useState<boolean>(false);
    const delete_workspace = async () => {
        setLoading(true);
        const del = await DeleteWorkspace(props.workspaceId);
        setLoading(false);
        console.log(del);
    }
    return (
    <Button onClick={delete_workspace}>
    {
        loading 
        ? <>Loading</>
        : <>Delete</>
    } 
    </Button>
    )
}