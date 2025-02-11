"use client"
import { Button } from "./ui/button"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog"
import { Prisma } from "@prisma/client"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

type WorkspaceUserWithUser = Prisma.WorkspaceUserGetPayload<{
    include: {
        user: true
    }
}>

export function ManageMember({ WorkspaceUser } : { WorkspaceUser: WorkspaceUserWithUser }) {
    return (
        <>
        <Dialog>
      <DialogTrigger asChild>
      <Button variant={"outline"}>
        Manage
      </Button>
      </DialogTrigger>
      <DialogContent onOpenAutoFocus={((e) => {e.preventDefault()})} className="w-[90%] rounded-md bg-black">
        <DialogHeader>
          <DialogTitle className="">Manage {WorkspaceUser.user.name}</DialogTitle>
          <DialogDescription className="text-left">
          Description Here.
          </DialogDescription>
        </DialogHeader>
        <Avatar>
        <AvatarImage src={WorkspaceUser.user.image!} />
        <AvatarFallback>OM</AvatarFallback>
        </Avatar>
        <DialogFooter>
        Footer Here.
        </DialogFooter>
      </DialogContent>
    </Dialog>
        </>
    )
}