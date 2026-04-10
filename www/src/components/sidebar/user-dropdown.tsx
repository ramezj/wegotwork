import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Session } from "@/features/auth/auth";
import { authClient } from "@/features/auth/auth-client";
import { ChevronsUpDown } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import { SidebarMenuButton } from "../ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function UserDropdown({ session }: { session: Session }) {
  const router = useRouter();
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild suppressHydrationWarning>
          <SidebarMenuButton
            size={"lg"}
            variant={"outline"}
            className="border bg-background text-primary hover:bg-background hover:text-primary"
          >
            <Avatar className="h-8 w-8 bg-primary rounded-none">
              <AvatarFallback className="bg-primary rounded-none text-primary-foreground font-light">
                {session.user.name[0].charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{session.user.name}</span>
              <span className="truncate text-xs text-muted-foreground">
                {session.user.email}
              </span>
            </div>
            <ChevronsUpDown className="ml-auto size-4" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="top"
          className="shadow-none DropdownMenuContent"
        >
          <DropdownMenuItem>
            <span>Account</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>Billing</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={async () => {
              await authClient.signOut();
              router.navigate({ to: "/" });
            }}
          >
            <span>Log Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
