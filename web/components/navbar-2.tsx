"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Session } from "@/lib/auth-client"

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
    <div className="border-b border-dashed bg-black sticky top-0 h-16 z-50">
      <div className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center z-50 pl-4 text-2xl font-medium tracking-tighter text-white">
          <span className="text-2xl font-medium tracking-tighter text-white">wegotwork</span>
        </Link>
        <div className='justify-center items-center gap-4 hidden md:flex pl-4 align-middle'>
            <Link href={"/"} className="">
            <span className="text-lg font-medium tracking-tighter text-white">
            features
            </span>
            </Link>
            <Link target="_blank" href={`http://demo.${process.env.NEXT_PUBLIC_URL}`} className="">
            <span className="text-lg font-medium tracking-tighter text-white">
            demo
            </span>
            </Link>
            <Link href={"/pricing"} className="">
            <span className="text-lg font-medium tracking-tighter text-white">
            pricing
            </span>
            </Link>
        </div>
        <div className="flex-1"></div>
        <div className="hidden md:block">
            <Button variant="default" asChild className="mr-4 px-8 rounded-none font-medium text-base align-middle">
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
          {/* {session?.user ? (
            <>
            {
              session?.user.currentOrganizationId === null
              ? 
              <>
              <Button variant="default" asChild className="h-16 px-6 rounded-none font-medium text-base">
              <Link href="/dashboard">Dashboard</Link>
              </Button>
              </>
              :
              <>
              <Button variant="default" asChild className="h-16 px-6 rounded-none font-medium text-base">
              <Link href="/overview">Dashboard</Link>
              </Button>
              </>
            }
            </>
          ) : (
            <Button asChild variant="default" className="h-16 px-6 rounded-none font-medium text-base">
              <Link href="/auth">Start Hiring</Link>
            </Button>
          )} */}
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
            {["features", "demo", "pricing"].map((item) => (
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
                dashboard
                </Link>
                </>
                :
                <>
                <Link
                href={`/overview`}
                className="text-2xl text-white transition-colors font-medium"
                onClick={() => setIsOpen(false)}>
                dashboard
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
              start hiring
              </Link>
              </>
            }
          </nav>
        </div>
      </div>
    </div>
  );
  
}
