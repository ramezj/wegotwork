"use client"
import { Button } from "./ui/button"
import { Delete } from "lucide-react"
import { DeleteWorkspace } from "@/actions/workspace/delete-workspace"
import { useState } from "react"
import { toast } from "sonner"

interface props {
    workspaceId: string
}

export function DeleteWorkspaceButton(props: props) {
    const [ loading, setLoading ] = useState<boolean>(false);
    const delete_workspace = async () => {
        setLoading(true);
        const del = await DeleteWorkspace(props.workspaceId);
        setLoading(false);
        if(del?.success) {
            toast('Workspace Deleted');
        } else {
            toast("Permission needed")
        }
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