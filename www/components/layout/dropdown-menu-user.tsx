"use client"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu"
import Link from "next/link"
import { Button } from "../ui/button"
import { ChevronsUpDown, Settings2, LogOut} from "lucide-react"
import { signOut } from "next-auth/react"
import { Session } from "next-auth"
import { Separator } from "../ui/separator"

export function DropDownMenuUser({ session } : { session: Session | null }) {
    return (
        <>
        <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"outline"} className="w-full bg-inherit border-foreground/20 font-semibold">
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
                  {/* <DropdownMenuItem className="cursor-pointer" asChild>
                  <Link href={"/settings"} className="flex align-middle items-center font-semibold"><Settings2 className="size-4" />Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" asChild>
                  <Link href={"/billing"} className="flex align-middle items-center font-semibold"><Banknote className="size-4" />Billing</Link>
                  </DropdownMenuItem> */}
                  <div>
                  <Separator/>
                  </div>
                  <DropdownMenuItem onClick={(() => { signOut({ callbackUrl: "/"})})} className="cursor-pointer flex align-middle items-center font-semibold">
                        <LogOut className="size-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}