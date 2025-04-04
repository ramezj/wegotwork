'use client'

import Link from "next/link"
import { Home, Users, Banknote, Briefcase, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from "@/components/ui/sheet"
import { redirect, usePathname } from "next/navigation"
import { Session } from "@/lib/auth-client"
import { Separator } from "./ui/separator"
import { DropDownMenuUser } from "./dropdown-menu"
import { Menu } from "lucide-react"

export default function LayoutNavigation({ children, session, organization }: { children: React.ReactNode; session: Session, organization: string }) {
  if(!session.user) {
    redirect('/');
  } 
  const path = usePathname();
    return (
      <div className="grid min-h-screen w-full md:grid-cols-[200px_1fr] lg:grid-cols-[250px_1fr]">
        <div className="hidden border-r border-black bg-white md:block">
          <div className="flex h-full max-h-screen flex-col gap-2 sticky top-0 z-50 bg-white">
            <div className="flex h-16 items-center border-b border-black bg-white px-3 lg:h-16 text-center justify-center">
            <Link href="/" className="flex items-center z-50">
            <span className="text-2xl tracking-tighter text-black font-extrabold">wegotwork</span>
            </Link>
            </div>
            <div className="flex-1 ">
              <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-2 mt-1">
                <Link href="/overview" className={`${path.includes('/overview') ? ' bg-[#F2EFE8] text-black border !border-black' : ''} font-extrabold flex items-center gap-3 rounded-none px-3 py-2 text-black hover:bg-[#F2EFE8] border border-white hover:border-black hover:text-black transition-all duration-200`}>
                 <Home className="size-4" />
                  overview
                </Link>
                <Link href="/jobs" className={`${path.includes('/jobs') ? ' bg-[#F2EFE8] text-black border !border-black' : ''} font-extrabold flex items-center gap-3 rounded-none px-3 py-2 text-black hover:bg-[#F2EFE8] border border-white hover:border-black hover:text-black transition-all duration-200`}>
                  <Briefcase className="h-4 w-4" />
                  jobs
                </Link>
                <Link href="/applicants" className={`${path.includes('/applicants') ? ' bg-[#F2EFE8] text-black border !border-black' : ''} font-extrabold flex items-center gap-3 rounded-none px-3 py-2 text-black hover:bg-[#F2EFE8] border border-white hover:border-black hover:text-black transition-all duration-200`}>
                <Users className="h-4 w-4" />
                  applicants
                </Link>
                <Link href="/billing" className={`${path.includes('/billing') ? ' bg-[#F2EFE8] text-black border !border-black' : ''} font-extrabold flex items-center gap-3 rounded-none px-3 py-2 text-black hover:bg-[#F2EFE8] border border-white hover:border-black hover:text-black transition-all duration-200`}>
                <Banknote className="h-4 w-4" />
                  billing
                </Link>
                <Separator />
                <Link href="/members" className={`${path.includes('/members') ? ' bg-[#F2EFE8] text-black border !border-black' : ''} font-extrabold flex items-center gap-3 rounded-none px-3 py-2 text-black hover:bg-[#F2EFE8] border border-white hover:border-black hover:text-black transition-all duration-200`}>
                <Users className="h-4 w-4" />
                  members
                </Link>
                <Link href="/settings" className={`${path.includes('/settings') ? ' bg-[#F2EFE8] text-black border !border-black' : ''} font-extrabold flex items-center gap-3 rounded-none px-3 py-2 text-black hover:bg-[#F2EFE8] border border-white hover:border-black hover:text-black transition-all duration-200`}>
                <Settings className="h-4 w-4" />
                  settings
                </Link>
              </nav>
            </div>
            <div className="p-4 w-full flex gap-2">
              <DropDownMenuUser session={session} />
            </div>
          </div>
        </div>
        <div className="flex flex-col sticky">
          <header className="z-50 flex h-16 items-center gap-4 border-b border-black bg-white px-3 lg:h-16 sticky top-0 bg-background">
            <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0 md:hidden text-white hover:text-white p-8 bg-black hover:bg-black rounded-none -ml-4">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
              <SheetContent side="left" className="flex flex-col bg-white">
              <SheetTitle>
                <SheetClose asChild className="top-4">
                  <Link href="/" className="px-2 text-2xl tracking-tighter text-black font-extrabold">
                  lou careers
                  </Link>
                  </SheetClose>
                </SheetTitle>
                <nav className="grid gap-3 text-lg font-medium mt-1">
                <SheetClose asChild>
                <Link href="/overview" className={`${path.includes('/overview') ? 'bg-black text-white' : ''} font-extrabold flex items-center gap-3 rounded-none px-3 py-2 text-black transition-all hover:text-white hover:bg-black duration-200`}>
                 <Home className="size-4" />
                  overview
                </Link>
                  </SheetClose>
                  <SheetClose asChild>
                  <Link href="/jobs" className={`${path.includes('/jobs') ? 'bg-black text-white' : ''} font-extrabold flex items-center gap-3 rounded-none px-3 py-2 text-black transition-all hover:text-white hover:bg-black duration-200`}>
                  <Briefcase className="h-4 w-4" />
                  jobs
                </Link>
                  </SheetClose>
                  <SheetClose asChild>
                  <Link href="/applicants" className={`${path.includes('/applicants') ? 'bg-black text-white' : ''} font-extrabold flex items-center gap-3 rounded-none px-3 py-2 text-black transition-all hover:text-white hover:bg-black duration-200`}>
                  <Users className="h-4 w-4" />
                    applicants
                  </Link>
                  </SheetClose>
                  <SheetClose asChild>
                  <Link href="/billing" className={`${path.includes('/billing')? 'bg-black text-white' : ''} font-extrabold flex items-center gap-3 rounded-none px-3 py-2 text-black transition-all hover:text-white hover:bg-black duration-200`}>
                  <Banknote className="h-4 w-4" />
                    billing
                  </Link>
                  </SheetClose>
                  <Separator />
                  <SheetClose asChild>
                  <Link href="/members" className={`${path.includes('/members') ? 'bg-black text-white' : ''} font-extrabold flex items-center gap-3 rounded-none px-3 py-2 text-black transition-all hover:text-white hover:bg-black duration-200`}>
                  <Users className="h-4 w-4" />
                    members
                  </Link>
                  </SheetClose>
                  <SheetClose asChild>
                  <Link href="/settings" className={`${path.includes('/settings') ? 'bg-black text-white' : ''} font-extrabold flex items-center gap-3 rounded-none px-3 py-2 text-black transition-all hover:text-white hover:bg-black duration-200`}>
                  <Settings className="h-4 w-4" />
                    settings
                  </Link>
                  </SheetClose>
                </nav>
                <div className="w-full flex gap-2 pt-4 bottom-0 mt-auto">
                <DropDownMenuUser session={session} />
              </div>
              </SheetContent>
            </Sheet>
            <div className="w-full flex-1">
            </div>
            <div className="flex-1"></div> 
          </header>
            {children}
        </div>
      </div>
    )
}