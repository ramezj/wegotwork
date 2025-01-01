"use client"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu"
import Link from "next/link"
import { Button } from "../ui/button"
import { ChevronsUpDown, Settings2, Banknote, LogOut} from "lucide-react"
import { signOut } from "next-auth/react"
import { Session } from "next-auth"

export function DropDownMenuUser({ session } : { session: Session | null }) {
    return (
        <>
        <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"outline"} className="w-full bg-inherit border-foreground/20 font-bold">
                    {session?.user?.name}
                    <ChevronsUpDown className="ml-auto size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width] bg-background space-y-2"
                >
                  <DropdownMenuItem className="cursor-pointer" asChild>
                  <Link href={"/settings"} className="flex align-middle items-center"><Settings2 className="size-4 mr-2" />Switch Workspace</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" asChild>
                  <Link href={"/settings"} className="flex align-middle items-center"><Settings2 className="size-4 mr-2" />Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" asChild>
                  <Link href={"/billing"} className="flex align-middle items-center"><Banknote className="size-4 mr-2" />Billing</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(() => { signOut({ callbackUrl: "/"})})} className="cursor-pointer">
                    <span className="flex align-middle items-center"><LogOut className="size-4 mr-2" />Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}