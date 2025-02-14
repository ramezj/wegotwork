"use client"
import { Button } from "./ui/button"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog"
import { Prisma } from "@prisma/client"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { CalendarDays } from "lucide-react"
import { formatRole } from "@/lib/format-role"

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
          <DialogTitle className="">Manage Team Member</DialogTitle>
          <DialogDescription>View and manage team member details and permissions.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={WorkspaceUser.user.image!} alt="User Avatar" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h4 className="text-lg font-semibold">{WorkspaceUser.user.name}</h4>
              <p className="text-sm text-muted-foreground">{WorkspaceUser.user.email}</p>
              <p className="text-sm font-medium">{formatRole(WorkspaceUser.role)}</p>
            </div>
          </div>
        </div>
        <DialogFooter>
        <Button variant={"destructive"} className="w-full">
          Revoke Access
        </Button>
        </DialogFooter>
        </DialogContent>
        </Dialog>
        </>
    )
}