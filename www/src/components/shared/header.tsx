import { Session } from "@/features/auth/auth";
import { SignInButton } from "../auth/auth-buttons";
import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";

import React from "react";
import { cn } from "@/lib/utils";
import { authClient } from "@/features/auth/auth-client";

export default function Header({
  session,
  // isPending,
}: {
  session: Session | null;
  // isPending: boolean;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);
  return (
    <header className="w-full px-4 sticky top-0 z-50 h-16 border border-b border-l-0 border-r-0 border-t-0 backdrop-blur supports-backdrop-filter:bg-background/60 flex flex-row items-center justify-between">
      <div className="flex-row flex gap-2 items-center content-center align-middle">
        <Link to={"/"}>
          <h1 className="font-bold">Hirelou</h1>
        </Link>
        <div className="flex-row gap-2 items-center content-center align-middle md:flex hidden">
          <Link className="font-medium text-muted-foreground" to={"/"}>
            home
          </Link>
          <Link className="font-medium text-muted-foreground" to={"/"}>
            support
          </Link>
          <Link className="font-medium text-muted-foreground" to={"/"}>
            blog
          </Link>
        </div>
      </div>
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
              <Link to={"/dashboard"}>Open Dashboard</Link>
            </Button>
          </>
        ) : (
          <>
            <SignInButton />
          </>
        )}
      </div>
      <div className="md:hidden flex">
        <Button
          variant="default"
          size="icon"
          className="md:hidden z-50 hover:bg-accent text-primary px-8 h-16 rounded-md"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
        </Button>
      </div>
      <div
        className={cn(
          "fixed inset-0 bg-background z-40 flex flex-col items-center justify-center transition-all duration-300 ease-in-out md:hidden",
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full pointer-events-none",
        )}
      >
        <nav className="flex flex-col items-center space-y-6 text-center">
          {["Features", "Demo", "Pricing"].map((item) => (
            <Link
              key={item}
              to={`/`}
              className="text-xl text-primary transition-colors font-bold"
              onClick={() => setIsOpen(false)}
            >
              {item}
            </Link>
          ))}
          {session?.user ? (
            <>
              <Button asChild className="w-52 font-semibold text-xl">
                <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                  Dashboard
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button
                className="font-semibold w-52 text-xl"
                onClick={() => {
                  authClient.signIn.social({
                    provider: "google",
                    callbackURL: "/",
                  });
                }}
              >
                Sign In
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
