import { Session } from "@/features/auth/auth";
import { SignInButton } from "../auth/auth-buttons";
import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { Book, Menu, Sunset, Trees, X, Zap } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import React from "react";
import { cn } from "@/lib/utils";

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
    <header className="w-full sticky top-0 z-50 h-16 border border-b border-l-0 border-r-0 border-t-0 bg-background flex flex-row items-center justify-between">
      <div className="flex-row flex gap-2 items-center content-center align-middle">
        <Link to={"/"}>
          <h1 className="font-bold pl-4">LOOP</h1>
        </Link>
        <div className="flex-row gap-2 items-center content-center align-middle md:flex hidden">
          <Link className="font-medium text-gray-200" to={"/"}>
            home
          </Link>
          <Link className="font-medium text-gray-200" to={"/"}>
            support
          </Link>
          <Link className="font-medium text-gray-200" to={"/"}>
            blog
          </Link>
        </div>
      </div>
      <div className="flex-row gap-2 items-center md:flex hidden">
        {session?.user ? (
          <>
            <Button asChild className="h-16 px-8 font-semibold">
              <Link to={"/dashboard"}>Dashboard</Link>
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
          className="md:hidden z-50 text-black hover:text-white px-8 h-16 hover:bg-inherit rounded-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
        </Button>
      </div>
      <div
        className={cn(
          "fixed inset-0 bg-black z-40 flex flex-col items-center justify-center transition-all duration-300 ease-in-out md:hidden",
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
              className="text-2xl text-white transition-colors font-bold"
              onClick={() => setIsOpen(false)}
            >
              {item}
            </Link>
          ))}
          {session?.user ? (
            <>
              <Button asChild className="w-52">
                <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                  Dashboard
                </Link>
              </Button>
            </>
          ) : (
            <>
              <SignInButton />
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
