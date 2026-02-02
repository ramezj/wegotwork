import { Session } from "@/features/auth/auth";
import { SignInButton } from "../auth/auth-buttons";
import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

export default function Header({
  session,
  // isPending,
}: {
  session: Session | null;
  // isPending: boolean;
}) {
  return (
    <header className="w-full sticky top-0 z-50 h-16 border border-b border-l-0 border-r-0 bg-background flex flex-row items-center justify-between">
      <div className="flex-row flex gap-2 items-center content-center align-middle">
        <Link to={"/"}>
          <h1 className="font-bold pl-4">LOOP</h1>
        </Link>
      </div>
      <div className="flex-row gap-2 items-center md:flex hidden">
        <Link className="font-medium" to={"/"}>
          home
        </Link>
        <Link className="font-medium" to={"/"}>
          support
        </Link>
        <Link className="font-medium" to={"/"}>
          blog
        </Link>
        {/* {isPending && <SignInButton />} */}
        {session?.user ? (
          <>
            <Button asChild className="h-16 px-8 font-semibold">
              <Link to={"/dashboard"}>Dashboard</Link>
            </Button>
          </>
        ) : (
          // !isPending && (
          <>
            <SignInButton />
          </>
          // )
        )}
      </div>
      <div className="md:hidden flex">
        <Sheet>
          <SheetTrigger asChild>
            <Button className="h-16 px-6!">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">Hello World</SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
