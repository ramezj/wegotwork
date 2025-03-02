"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronDown, Menu, X } from "lucide-react"
import { NavigationMenuForNavbar } from "./navgiation-menu"
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Session } from "@/lib/auth-client"
import { NavigationMenuLink } from "@/components/ui/navigation-menu"

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
    <div className="border-b border-black bg-white">
      <div className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center z-50 pl-4">
          <span className="text-2xl font-extrabold tracking-tighter text-black">heliup</span>
        </Link>
        <div>
          <NavigationMenuForNavbar />
        </div>
        <div className="hidden md:block">
          {session?.user ? (
            // <Button variant="default" asChild className="border-l py-8 rounded-none hover:bg-[#7bf7f7] font-bold text-black text-base">
            //   <Link href="/dashboard">dashboard</Link>
            // </Button>
            <Button variant="default" asChild className="border-l py-8 rounded-none hover:bg-black bg-black font-bold text-white text-base">
            <Link href="/dashboard">dashboard</Link>
            </Button>
          ) : (
            <Button asChild variant="default" className="border-l py-8 rounded-none hover:bg-[#7bf7f7] font-bold text-black">
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
          className="md:hidden z-50 text-white hover:text-white p-8 bg-black hover:bg-black rounded-none"
          onClick={() => setIsOpen(!isOpen)}>
          <X className="h-6 w-6" /> 
          </Button>
          :
          <Button
          variant="ghost"
          size="icon"
          className="md:hidden z-50 text-white hover:text-white border-l p-8 bg-black hover:bg-black rounded-none"
          onClick={() => setIsOpen(!isOpen)}>
          <Menu className="h-6 w-6" />
          </Button>
        }
        <div
          className={cn(
            "fixed inset-0 bg-black z-40 flex flex-col items-center justify-center transition-all duration-300 ease-in-out md:hidden",
            isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
          )}
        >
          <nav className="flex flex-col items-center space-y-8 text-center">
            {["Features", "Demo", "Pricing"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="text-2xl font-medium text-white hover:text-white/80 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
  
}
