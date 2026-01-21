import { Session } from "@/lib/auth";
import { SignInButton } from "../auth/auth-buttons";
import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

export default function Header({
  session,
  isPending,
}: {
  session: Session | null;
  isPending: boolean;
}) {
  return (
    <header className="w-full sticky top-0 z-50 p-4 border border-b border-l-0 border-r-0 flex flex-row items-center justify-between">
      <div className="flex-row flex gap-2 items-center content-center align-middle">
        <h1 className="font-bold">wegotwork</h1>
      </div>
      <div className="flex-row gap-2 items-center md:flex hidden">
        <Link className="font-medium" to={"/"}>
          home
        </Link>
        <Link className="font-medium" to={"/"}>
          resources
        </Link>
        <Link className="font-medium" to={"/"}>
          support
        </Link>
        <Link className="font-medium" to={"/"}>
          blog
        </Link>
        {isPending && <SignInButton />}
        {session?.user ? (
          <>
            <Button asChild>
              <Link to={"/"}>dashboard</Link>
            </Button>
          </>
        ) : (
          !isPending && (
            <>
              <SignInButton />
            </>
          )
        )}
      </div>
      <div className="md:hidden flex">
        <Sheet>
          <SheetTrigger asChild>
            <Button size={"icon"}>
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">Hello World</SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
