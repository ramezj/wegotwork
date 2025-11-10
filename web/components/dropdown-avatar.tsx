"use client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import Link from "next/link";
import { Button } from "./ui/button";
import { ChevronsUpDown, Settings2, LogOut } from "lucide-react";
import { signOut } from "@/lib/auth-client";
import { Session } from "@/lib/auth-client";
import { Separator } from "./ui/separator";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function DropdownAvatar({ session }: { session: Session | null }) {
  const signUserOut = async () => {
    await signOut({
      fetchOptions: {
        onError: (error) => {
          console.log(error);
        },
        onSuccess: () => {
          redirect("/");
        },
      },
    });
  };
  const redirectToDashboard = async () => {
    redirect("/dashboard");
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer !rounded-none dark:!bg-white bg-gray-200 text-black">
            <AvatarImage src={undefined} />
            <AvatarFallback className="rounded-none dark:bg-white bg-gray-200 text-black border border-foreground/20 border-dashed">
              {session?.user.name?.charAt(0) ?? "?"}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          // By default, Radix DropdownMenuContent uses a portal to avoid clipping. If you override this, set portalled={true}.
          side="bottom"
          align="end"
          sideOffset={8}
          className="space-y-2 mt-4 bg-theme !rounded-none border-dashed border-foreground/20"
        >
          <DropdownMenuItem
            onSelect={redirectToDashboard}
            className="cursor-pointer rounded-none"
          >
            <Settings2 className="size-4" />
            Switch Organization
          </DropdownMenuItem>
          <div>
            <Separator className="-my-1" />
          </div>
          <DropdownMenuItem
            onClick={signUserOut}
            className="cursor-pointer rounded-none"
          >
            <LogOut className="size-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
