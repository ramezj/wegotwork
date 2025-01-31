"use client"
import React, {useState } from "react"
import { Button } from "./ui/button";
import { CreateInvitation } from "@/actions/invitations/create";
import { toast } from "sonner";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogDescription, DialogTitle, DialogFooter } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Loader2 } from "lucide-react";

export function CreateUserInvitation({ workspaceId} : { workspaceId: string}) {
    const [ loading, setLoading ] = useState<boolean>(false);
    const create_the_invitation = async (e:React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const res = await CreateInvitation(workspaceId);
        setLoading(false);
        toast(JSON.stringify(res?.invitation))
    }
    return (
        <Dialog>
      <DialogTrigger asChild>
      <Button>
        Create Invitation
      </Button>
      </DialogTrigger>
      <DialogContent onOpenAutoFocus={((e) => {e.preventDefault()})} className="text-left w-[90%] rounded-md bg-black">
        <DialogHeader>
          <DialogTitle className="text-left">Invite New Members</DialogTitle>
          <DialogDescription className="text-left">
          Invite team members, collaborate & hire together.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
        <form onSubmit={create_the_invitation} className="w-full">
        {
            loading
            ? 
            <>
            <Button type="submit" size={"sm"} disabled form="form" className="w-full"><Loader2 className="mr-1 h-4 w-4 animate-spin" />Create Invitation Link</Button>
            </>
            : 
            <>
            <Button type="submit" className="w-full" size={"sm"}>Create Invitation Link</Button>
            </>
          }
        </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    )
}