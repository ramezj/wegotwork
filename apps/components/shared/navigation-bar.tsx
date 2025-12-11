"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function NavigationBar() {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleMenu = () => {
    if (isOpen) {
      document.body.style.overflow = "unset";
    } else {
      document.body.style.overflow = "hidden";
    }
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    document.body.style.overflow = "unset";
    setIsOpen(false);
  };

  return (
    // add overflow-hidden if not the white button.
    <div className="border-b border-foreground/20 border-dashed dark:bg-black bg-white sticky top-0 h-16 z-50">
      <div className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center z-50 pl-4 text-2xl font-medium tracking-tighter dark:text-white text-black"
          onClick={closeMenu}
        >
          <span className="text-2xl font-extrabold tracking-tight dark:text-white text-black">
            wegotwork
          </span>
        </Link>
        <div className="justify-center items-center gap-4 hidden md:flex pl-4 align-middle">
          <Link href={"/"} className="">
            <span className="text-lg font-bold tracking-tight dark:text-white text-black">
              features
            </span>
          </Link>
          <Link
            target="_blank"
            href={`http://demo.${process.env.NEXT_PUBLIC_URL}`}
            className=""
          >
            <span className="text-lg font-bold tracking-tight dark:text-white text-black">
              demo
            </span>
          </Link>
          <Link href={"/pricing"} className="">
            <span className="text-lg font-bold tracking-tight dark:text-white text-black">
              pricing
            </span>
          </Link>
        </div>
        <div className="flex-1"></div>
        <div className="hidden md:block">
          {/* <ModeToggle /> */}
          <Button
            variant="default"
            asChild
            className="h-16 px-8 bg-white hover:bg-white text-black rounded-none border-b font-bold text-base align-middle"
          >
            {/* {session?.user ? (
              session.user.currentOrganizationId === null ? (
                <Link href="/dashboard">Dashboard</Link>
              ) : (
                <Link href="/overview">Dashboard</Link>
              )
            ) : (
              <Link href="/auth">Get Started</Link>
            )} */}
            <Link href="/auth">Get Started</Link>
          </Button>
        </div>
        {isOpen ? (
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden z-50 text-white hover:text-white px-8 h-16 bg-black hover:bg-black rounded-none"
            onClick={toggleMenu}
          >
            <X className="h-6 w-6 text-white" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden z-50 text-white hover:text-white px-8 h-full bg-inherit hover:bg-inherit rounded-none"
            onClick={toggleMenu}
          >
            <Menu className="h-6 w-6 text-white" />
          </Button>
        )}
        <div
          className={cn(
            "fixed inset-0 bg-black z-40 flex flex-col items-center justify-center transition-all duration-300 ease-in-out md:hidden",
            isOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-full pointer-events-none"
          )}
        >
          <nav className="flex flex-col items-center space-y-6 text-center">
            {["Features", "Demo", "Pricing"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="text-2xl text-white transition-colors font-bold"
                onClick={closeMenu}
              >
                {item}
              </Link>
            ))}
            {/* {session?.user ? (
              <>
                {session?.user.currentOrganizationId === null ? (
                  <>
                    <Link
                      href={`/dashboard`}
                      className="text-2xl text-white transition-colors font-bold"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href={`/overview`}
                      className="text-2xl text-white transition-colors font-bold"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </>
                )}
              </>
            ) : (
              <>
                <Link
                  href={`/auth`}
                  className="text-2xl text-white transition-colors font-bold"
                  onClick={() => setIsOpen(false)}
                >
                  Start Hiring
                </Link>
              </>
            )} */}
            <Link
              href={`/auth`}
              className="text-2xl text-white transition-colors font-bold"
              onClick={closeMenu}
            >
              Start Hiring
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
