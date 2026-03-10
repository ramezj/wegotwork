import { useState, useEffect } from "react";
import { Session } from "@/features/auth/auth";
import { SignInButton } from "../auth/auth-buttons";
import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { Menu, X, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Header({ session }: { session: Session | null }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const navLinks = [
    { label: "Features", href: "/" },
    { label: "Pricing", href: "/" },
    { label: "About", href: "/" },
    { label: "Demo", href: "https://jobs.wegotwork.co/demo" },
  ];

  return (
    <div className="fixed top-5 inset-x-0 z-50 pointer-events-none">
      <div className="w-full lg:w-[80%] mx-auto px-4 pointer-events-auto">
        <header
          className={cn(
            "px-4 border bg-background overflow-hidden transition-all duration-300 ease-in-out w-full flex flex-col",
            open ? "rounded-none" : "rounded-lg",
          )}
        >
          {/* Top bar — always visible */}
          <div className="h-16 flex items-center justify-between shrink-0">
            {/* Logo + desktop nav links grouped on the left */}
            <div className="flex items-center gap-1">
              <Link
                to="/"
                className="text-xl font-semibold tracking-tight mr-2"
                onClick={() => setOpen(false)}
              >
                Hireark
              </Link>

              <nav className="hidden md:flex flex-row gap-1 items-center">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-md hover:bg-muted"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Desktop actions */}
            <div className="hidden md:flex flex-row gap-2 items-center">
              {session?.user ? (
                <>
                  <Button
                    variant="secondary"
                    asChild
                    className="font-semibold cursor-pointer"
                  >
                    <Link to="/dashboard">
                      Log Out <LogOut className="size-4 ml-1" />
                    </Link>
                  </Button>
                  <Button
                    variant="default"
                    asChild
                    className="font-semibold cursor-pointer"
                  >
                    <Link preload="render" to="/dashboard">
                      Open Dashboard
                    </Link>
                  </Button>
                </>
              ) : (
                <SignInButton />
              )}
            </div>

            {/* Mobile hamburger / close button */}
            <Button
              variant={"ghost"}
              className="md:hidden flex items-center justify-center size-9 relative"
              onClick={() => setOpen((prev) => !prev)}
              aria-label={open ? "Close menu" : "Open menu"}
            >
              <Menu
                className={cn(
                  "absolute size-5 transition-all duration-200 ease-in-out",
                  open
                    ? "scale-50 opacity-0 -rotate-90"
                    : "scale-100 opacity-100 rotate-0",
                )}
              />
              <X
                className={cn(
                  "absolute size-5 transition-all duration-200 ease-in-out",
                  open
                    ? "scale-100 opacity-100 rotate-0"
                    : "scale-50 opacity-0 rotate-90",
                )}
              />
            </Button>
          </div>

          {/* Mobile expanded nav — revealed as header grows */}
          <div
            className={cn(
              "md:hidden grid transition-all duration-300 ease-in-out",
              open
                ? "grid-rows-[1fr] opacity-100 pointer-events-auto"
                : "grid-rows-[0fr] opacity-0 pointer-events-none",
            )}
          >
            <div className="overflow-hidden flex flex-col">
              <div className="flex flex-col gap-2 pb-5">
                {/* Nav links */}
                <nav className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      to={link.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center py-2 rounded-md text-base font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                {/* Auth actions pinned to bottom */}
                <div className="flex flex-col gap-2 border-t pt-4">
                  {session?.user ? (
                    <>
                      <Button
                        variant="secondary"
                        asChild
                        className="w-full font-semibold"
                      >
                        <Link to="/dashboard" onClick={() => setOpen(false)}>
                          Log Out <LogOut className="size-4 ml-1" />
                        </Link>
                      </Button>
                      <Button
                        variant="default"
                        asChild
                        className="w-full font-semibold"
                      >
                        <Link
                          preload="render"
                          to="/dashboard"
                          onClick={() => setOpen(false)}
                        >
                          Open Dashboard
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <div className="w-full">
                      <SignInButton />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>
    </div>
  );
}
