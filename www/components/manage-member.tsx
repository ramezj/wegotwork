"use client"
import { Button } from "./ui/button"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog"

export function ManageMember() {
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
          <DialogTitle className="">Manage User</DialogTitle>
          <DialogDescription className="text-left">
          Description Here.
          </DialogDescription>
        </DialogHeader>
        Header Here.
        <DialogFooter>
        Footer Here.
        </DialogFooter>
      </DialogContent>
    </Dialog>
        </>
    )
}