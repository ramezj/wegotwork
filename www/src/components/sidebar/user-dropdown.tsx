import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Session } from "@/features/auth/auth";
import { authClient } from "@/features/auth/auth-client";
import { ChevronUp, Users2 } from "lucide-react";
import { useRouter } from "@tanstack/react-router";

export default function UserDropdown({ session }: { session: Session }) {
  const router = useRouter();
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild suppressHydrationWarning>
          <Button variant={"outline"} className="w-full py-4">
            <Users2 /> {session.user.name}
            <ChevronUp className="ml-auto" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="top"
          className="w-[--radix-dropdown-menu-trigger-width] DropdownMenuContent"
        >
          <DropdownMenuItem className="hover:bg-input/30!">
            <span>Account</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-input/30!">
            <span>Billing</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="hover:bg-input/30!"
            onClick={async () => {
              await authClient.signOut();
              router.navigate({ to: "/" });
            }}
          >
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
