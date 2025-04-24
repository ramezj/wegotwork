"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
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
    <div className="border-b-2 border-black bg-white sticky top-0 h-16 z-[9999]">
      <div className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center z-50 pl-4 text-2xl font-extrabold tracking-tighter text-black">
          <span className="text-2xl font-extrabold tracking-tighter text-black">wegotwork</span>
        </Link>
        <div className='justify-center items-center gap-4 hidden md:flex pl-4 align-middle'>
            {/* <NavigationMenuForNavbar /> */}
            <Link href={"/"} className="">
            <span className="text-lg font-bold tracking-tighter text-black">
            features
            </span>
            </Link>
            <Link target="_blank" href={`http://wegotwork.${process.env.NEXT_PUBLIC_URL}`} className="">
            <span className="text-lg font-bold tracking-tighter text-black">
            demo
            </span>
            </Link>
            <Link href={"/pricing"} className="">
            <span className="text-lg font-bold tracking-tighter text-black">
            pricing
            </span>
            </Link>
        </div>
        <div className="flex-1"></div>
        <div className="hidden md:block">
          {session?.user ? (
            <>
            {
              session?.user.currentOrganizationId === null
              ? 
              <>
              <Button variant="default" asChild className="border-l border-b border-black h-16 px-6 rounded-none hover:bg-black bg-background font-bold text-white text-base">
              <Link href="/dashboard">dashboard</Link>
              </Button>
              </>
              :
              <>
              <Button variant="default" asChild className="border-l border-b border-black h-16 px-6 rounded-none hover:bg-black bg-background font-bold text-white text-base">
              <Link href="/overview">dashboard</Link>
              </Button>
              </>
            }
            </>
          ) : (
            <Button asChild variant="default" className="border-l border-b border-black h-16 px-6 rounded-none hover:bg-black bg-background font-bold text-white text-base">
              <Link href="/auth">start hiring</Link>
            </Button>
          )}
        </div>
        {
          isOpen
          ?
          <Button
          variant="ghost"
          size="icon"
          className="md:hidden z-50 text-white hover:text-white border-l border-b border-black px-8 h-16 bg-background hover:bg-black rounded-none"
          onClick={() => setIsOpen(!isOpen)}>
          <X className="h-6 w-6" /> 
          </Button>
          :
          <Button
          variant="ghost"
          size="icon"
          className="md:hidden z-50 text-white hover:text-white border-l border-b border-black px-8 h-16 bg-background hover:bg-black rounded-none"
          onClick={() => setIsOpen(!isOpen)}>
          <Menu className="h-6 w-6" />
          </Button>
        }
        <div className={cn("fixed inset-0 bg-white z-40 flex flex-col items-center justify-center transition-all duration-300 ease-in-out md:hidden",
            isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
          )}
        >
          <nav className="flex flex-col items-center space-y-6 text-center">
            {["features", "demo", "pricing"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="text-2xl text-black transition-colors font-extrabold"
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
                className="text-2xl text-black transition-colors font-extrabold"
                onClick={() => setIsOpen(false)}>
                dashboard
                </Link>
                </>
                :
                <>
                <Link
                href={`/overview`}
                className="text-2xl text-black transition-colors font-extrabold"
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
              className="text-2xl text-black transition-colors font-extrabold"
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
