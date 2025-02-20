"use client"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu"
import Link from "next/link"
import { Button } from "./ui/button"
import { ChevronsUpDown, Settings2, LogOut} from "lucide-react"
import { signOut } from "@/lib/auth-client"
import { Session } from "@/lib/auth-client"
import { Separator } from "./ui/separator"
import { redirect } from "next/navigation"

export function DropDownMenuUser({ session } : { session: Session | null }) {
    return (
        <>
        <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant={"outline"} className="w-full bg-inherit border-foreground/20 font-semibold p-3">
                    {session?.user?.name}
                    <ChevronsUpDown className="ml-auto size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width] bg-background space-y-2"
                >
                  <DropdownMenuItem className="cursor-pointer" asChild>
                  <Link href={"/dashboard"} className="flex align-middle items-center font-semibold"><Settings2 className="size-4" />Switch Workspace</Link>
                  </DropdownMenuItem>
                  <div>
                  <Separator className="-my-1"/>
                  </div>
                  <DropdownMenuItem onClick={(() => { signOut({fetchOptions: redirect('/') })})} className="cursor-pointer flex align-middle items-center font-semibold">
                        <LogOut className="size-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}