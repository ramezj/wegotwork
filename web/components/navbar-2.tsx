"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Session } from "@/lib/auth-client"
import { ModeToggle } from "./mode-toggle"

export function Navbar({ session } : { session: Session | null}) {
  const [isOpen, setIsOpen] = React.useState(false)
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])
  return (
    // add overflow-hidden if not the white button.
    <div className="border-b border-foreground/20 border-dashed dark:bg-black bg-white sticky top-0 h-16 z-50">
      <div className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center z-50 pl-4 text-2xl font-medium tracking-tighter dark:text-white text-black">
          <span className="text-2xl font-medium tracking-tighter dark:text-white text-black">wegotwork</span>
        </Link>
        <div className='justify-center items-center gap-4 hidden md:flex pl-4 align-middle'>
            <Link href={"/"} className="">
            <span className="text-lg font-medium tracking-tighter dark:text-white text-black">
            features
            </span>
            </Link>
            <Link target="_blank" href={`http://demo.${process.env.NEXT_PUBLIC_URL}`} className="">
            <span className="text-lg font-medium tracking-tighter dark:text-white text-black">
            demo
            </span>
            </Link>
            <Link href={"/pricing"} className="">
            <span className="text-lg font-medium tracking-tighter dark:text-white text-black">
            pricing
            </span>
            </Link>
        </div>
        <div className="flex-1"></div>
        <div className="hidden md:block">
            {/* <ModeToggle /> */}
            <Button variant="default" asChild className="h-16 px-8 bg-blueColor hover:bg-blueColor text-white rounded-none border-b font-medium text-base align-middle">
            {session?.user ? (
              session.user.currentOrganizationId === null ? (
                <Link href="/dashboard">
                Dashboard
                </Link>
              ) : (
                <Link href="/overview">
                Dashboard
                </Link>
              )
            ) : (
              <Link href="/auth">
               Get Started
              </Link>
            )}
          </Button>
        </div>
        {
          isOpen
          ?
          <Button
          variant="ghost"
          size="icon"
          className="md:hidden z-50 text-white hover:text-white px-8 h-16 bg-black hover:bg-black rounded-none"
          onClick={() => setIsOpen(!isOpen)}>
          <X className="h-6 w-6" /> 
          </Button>
          :
          <Button
          variant="ghost"
          size="icon"
          className="md:hidden z-50 text-white hover:text-white px-8 h-full bg-inherit hover:bg-inherit rounded-none"
          onClick={() => setIsOpen(!isOpen)}>
          <Menu className="h-6 w-6" />
          </Button>
        }
        <div className={cn("fixed inset-0 bg-black z-40 flex flex-col items-center justify-center transition-all duration-300 ease-in-out md:hidden",
            isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
          )}
        >
          <nav className="flex flex-col items-center space-y-6 text-center">
            {["Features", "Demo", "Pricing"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="text-2xl text-white transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                {item}
              </Link>
            ))}
            {
              session?.user
              ? 
              <>
              {
                session?.user.currentOrganizationId === null 
                ? 
                <>
                <Link
                href={`/dashboard`}
                className="text-2xl text-white transition-colors font-medium"
                onClick={() => setIsOpen(false)}>
                Dashboard
                </Link>
                </>
                :
                <>
                <Link
                href={`/overview`}
                className="text-2xl text-white transition-colors font-medium"
                onClick={() => setIsOpen(false)}>
                Dashboard
                </Link>
                </>
              }
              </>
              :
              <>
              <Link
              href={`/auth`}
              className="text-2xl text-white transition-colors font-medium"
              onClick={() => setIsOpen(false)}>
              Start Hiring
              </Link>
              </>
            }
          </nav>
        </div>
      </div>
    </div>
  );
  
}
