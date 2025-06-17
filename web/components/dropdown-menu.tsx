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
        onError: (error) => {
          console.log(error);
        },
        onSuccess: () => {
          redirect('/');
        }
      }
     })
  }
  const redirectToDashboard = async () => {
    redirect("/dashboard");
  }
    return (
        <>
        <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant={"outline"} className="w-full bg-theme rounded-none">
                    {session?.user?.name}
                    <ChevronsUpDown className="ml-auto size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width] space-y-2 bg-theme mb-1 rounded-none"
                >
                  <DropdownMenuItem onSelect={redirectToDashboard} className="font-extrabold cursor-pointer rounded-none">
                  <Settings2 className="size-4" />
                  Switch Organization
                  </DropdownMenuItem>
                  <div>
                  <Separator className="-my-1"/>
                  </div>
                  <DropdownMenuItem onClick={signUserOut} 
                  className="cursor-pointer font-extrabold rounded-none">
                  <LogOut className="size-4" />
                  Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}