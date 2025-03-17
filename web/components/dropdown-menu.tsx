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
  const signUserOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          redirect('/');
        }
      }
     })
  }
    return (
        <>
        <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant={"outline"} className="w-full bg-inherit rounded-none border border-black text-black font-extrabold hover:bg-white hover:text-black p-3">
                    {session?.user?.name}
                    <ChevronsUpDown className="ml-auto size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width] bg-white border border-black text-black space-y-2 rounded-none"
                >
                  <DropdownMenuItem className="cursor-pointer hover:!bg-black hover:text-white !rounded-none" asChild>
                  <Link href={"/dashboard"} 
                  className="flex align-middle items-center font-extrabold !hover:bg-black hover:text-white !rounded-none">
                  <Settings2 className="size-4" />
                  switch organization
                  </Link>
                  </DropdownMenuItem>
                  <div>
                  <Separator className="-my-1"/>
                  </div>
                  <DropdownMenuItem onClick={signUserOut} 
                  className="cursor-pointer flex align-middle items-center font-extrabold hover:!bg-black hover:text-white !rounded-none">
                  <LogOut className="size-4" />
                  logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}