import { Session } from "@/features/auth/auth";
import { SignInButton } from "../auth/auth-buttons";
import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { NavSidebar } from "./nav-sidebar";

export default function Header({ session }: { session: Session | null }) {
  return (
    <header className="w-full px-4 h-16 rounded-lg border backdrop-blur supports-backdrop-filter:bg-background/60 flex flex-row items-center justify-between">
      <div className="flex-row flex gap-2 items-baseline content-center align-middle">
        <Link to={"/"} className="text-xl font-semibold tracking-tight">
          loux
        </Link>
        <div className="flex-row gap-2 items-baseline content-center align-middle md:flex hidden">
          <Link className="font-medium text-muted-foreground" to={"/"}>
            features
          </Link>
          <Link className="font-medium text-muted-foreground" to={"/"}>
            pricing
          </Link>
          <Link className="font-medium text-muted-foreground" to={"/"}>
            about
          </Link>
        </div>
      </div>

      {/* Desktop actions */}
      <div className="flex-row gap-2 items-center md:flex hidden">
        {session?.user ? (
          <>
            <Button
              variant={"secondary"}
              asChild
              className="font-semibold cursor-pointer"
            >
              <Link to={"/dashboard"}>Log Out</Link>
            </Button>
            <Button
              variant={"default"}
              asChild
              className="font-semibold cursor-pointer"
            >
              <Link preload="render" to={"/dashboard"}>
                Open Dashboard
              </Link>
            </Button>
          </>
        ) : (
          <SignInButton />
        )}
      </div>

      {/* Mobile sidebar */}
      <div className="md:hidden flex">
        <NavSidebar session={session} />
      </div>
    </header>
  );
}
