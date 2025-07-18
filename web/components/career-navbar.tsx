"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronDown, Menu, X } from "lucide-react"
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Session } from "@/lib/auth-client"
import { NavigationMenuLink } from "@/components/ui/navigation-menu"
import { Organization } from "@prisma/client"
import { Prisma } from "@prisma/client"

type OrganizationWithJobs = Prisma.OrganizationGetPayload<{
  include: {
    categories: {
      include: {
          jobs: {
              include: {
                  category: true
              }
          }
      }
    },
    jobs: {
      include: {
          category: true
      }
    }
  }
}>

export function CareerNavbar({ organization } : { organization: OrganizationWithJobs}) {
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
    <div className="border-b border-foreground/20 border-dashed h-16 bg-black sticky top-0">
      <div className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center z-50 pl-4">
          <span className="text-2xl font-extrabold tracking-tight text-white">{organization.name}</span>
        </Link>
        {/* <div className="">
        <Button asChild variant="default" className="border-l border-b border-white/20 h-16 rounded-none text-base">
              <Link href={`${organization.website === null ? "https://wegotwork.co" : organization.website}`}>Visit Website</Link>
            </Button>
        </div> */}

        {/* {
          isOpen
          ?
          <Button
          variant="ghost"
          size="icon"
          className="md:hidden z-50 text-white hover:text-white border-l p-8 bg-black hover:bg-black rounded-none"
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
        } */}
        
        <div className={cn("fixed inset-0 bg-white z-40 flex flex-col items-center justify-center transition-all duration-300 ease-in-out md:hidden",
            isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
          )}
        >
          <nav className="flex flex-col items-center space-y-8 text-center">
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
              <Link
              href={`/dashboard`}
              className="text-2xl text-black transition-colors font-extrabold"
              onClick={() => setIsOpen(false)}>
              start hiring
              </Link>
          </nav>
        </div>
      </div>
    </div>
  );
  
}
