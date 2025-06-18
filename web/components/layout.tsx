'use client'

import Link from "next/link"
import { Home, Users, Banknote, Briefcase, Settings, Tags } from "lucide-react"
import { HomeIcon } from "./icons/Home-Icon"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from "@/components/ui/sheet"
import { redirect, usePathname } from "next/navigation"
import { Session } from "@/lib/auth-client"
import { Separator } from "./ui/separator"
import { DropDownMenuUser } from "./dropdown-menu"
import { Menu } from "lucide-react"
import { NavUser } from "./testing/nav-user"
import { CustomSidebarItem } from "./sidebar-item"
export default function LayoutNavigation({ children, session, organization }: { children: React.ReactNode; session: Session, organization: string }) {
  if(!session.user) {
    redirect('/');
  } 
  const path = usePathname();
    return (
      <div className="grid min-h-screen w-full md:grid-cols-[200px_1fr] lg:grid-cols-[260px_1fr]">
        <div className="hidden border-r border-white/20 bg-black md:block">
          <div className="flex h-full max-h-screen flex-col gap-2 sticky top-0 z-50 bg-black">
            <div className="flex h-16 items-center border-b border-white/20 bg-black px-3 lg:h-16 text-center justify-center">
            <Link href="/" className="flex items-center z-50">
            <span className="text-2xl tracking-tighter text-white font-extrabold">wegotwork</span>
            </Link>
            </div>
            <div className="flex-1 ">
              <nav className="grid items-start px-3 text-sm font-medium gap-2 mt-1">
                <Button asChild variant="ghost" className={` ${path.includes('/overview') ? "bg-accent" : ""} !text-start justify-start w-full rounded-none`}>
                  <Link href='/overview'>
                  <Home className="size-4" />
                  Overview
                  </Link>
                </Button>
                <Button asChild variant="ghost" className={` ${path.includes('/jobs') ? "bg-accent" : ""} !text-start justify-start w-full rounded-none`}>
                  <Link href='/jobs'>
                  <Briefcase className="size-4" />
                  Jobs
                  </Link>
                </Button>
                <Button asChild variant="ghost" className={` ${path.includes('/applicants') ? "bg-accent" : ""} !text-start justify-start w-full rounded-none`}>
                <Link href='/applicants'>
                <Users className="h-4 w-4" />
                  Applicants
                </Link>
                </Button>
                <Button asChild variant="ghost" className={` ${path.includes('/categories') ? "bg-accent" : ""} !text-start justify-start w-full rounded-none`}>
                <Link href='/categories'>
                <Tags className="h-4 w-4" />
                  Categories
                </Link>
                </Button>
                <Button asChild variant="ghost" className={` ${path.includes('/billing') ? "bg-accent" : ""} !text-start justify-start w-full rounded-none`}>
                <Link href='/billing'>
                <Banknote className="h-4 w-4" />
                  Billing
                </Link>
                </Button>
                <Separator />
                <Button asChild variant="ghost" className={` ${path.includes('/members') ? "bg-accent" : ""} !text-start justify-start w-full rounded-none`}>
                <Link href='/members'>
                <Users className="h-4 w-4" />
                  Members
                </Link>
                </Button>
                <Button asChild variant="ghost" className={` ${path.includes('/settings') ? "bg-accent" : ""} !text-start justify-start w-full rounded-none`}>
                <Link href='/settings'>
                <Settings className="h-4 w-4" />
                  Settings
                </Link>
                </Button>
              </nav>
            </div>
            <div className="p-4 w-full flex gap-2">
              {/* <NavUser session={session} /> */}
              <DropDownMenuUser session={session} />
            </div>
          </div>
        </div>
        <div className="flex flex-col sticky">
          <header className="z-50 flex h-16 items-center gap-4 border-b border-white/20 bg-black px-3 lg:h-16 sticky top-0">
            <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0 md:hidden text-white hover:text-white p-8 bg-black hover:bg-black rounded-none -ml-4">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
              <SheetContent side="left" className="flex flex-col bg-black">
              <SheetTitle>
                <SheetClose asChild className="top-4">
                  <Link href="/" className="px-2 text-2xl tracking-tighter text-black font-extrabold">
                  <span className="text-2xl tracking-tighter text-white font-extrabold">wegotwork</span>
                  </Link>
                  </SheetClose>
                </SheetTitle>
                <nav className="grid gap-3 text-lg font-medium mt-1">
                  <SheetClose asChild>
                  <Button className="w-full justify-start text-left px-3 py-4" variant={"ghost"} asChild>
                  <Link href="/overview" className={` ${path.includes('/overview') ? "bg-accent" : ""} w-full justify-start items-center gap-3 px-3 py-2 flex text-left rounded-none`}>
                  <Home className="size-4" />
                  Overview
                  </Link>
                  </Button>
                  </SheetClose>
                  <SheetClose asChild>
                  <Button className="w-full justify-start text-left px-3 py-2" variant={"ghost"} asChild>
                  <Link href="/jobs" className={` ${path.includes('/jobs') ? "bg-accent" : ""} w-full justify-start items-center gap-3 px-3 py-2 flex text-left rounded-none`}>
                  <Briefcase className="h-4 w-4" />
                  Jobs
                  </Link>
                  </Button>
                  </SheetClose>
                  <SheetClose asChild>
                  <Button className="w-full justify-start text-left px-3 py-2" variant={"ghost"} asChild>
                  <Link href="/applicants" className={` ${path.includes('/applicants') ? "bg-accent" : ""} w-full justify-start items-center gap-3 px-3 py-2 flex text-left rounded-none`}>
                  <Users className="h-4 w-4" />
                  Applicants
                  </Link>
                  </Button>
                  </SheetClose>
                  <SheetClose asChild>
                  <Button className="w-full justify-start text-left px-3 py-2" variant={"ghost"} asChild>
                  <Link href="/categories" className={` ${path.includes('/categories') ? "bg-accent" : ""} w-full justify-start items-center gap-3 px-3 py-2 flex text-left rounded-none`}>
                  <Tags className="h-4 w-4" />
                  Categories
                  </Link>
                  </Button>
                  </SheetClose>
                  <SheetClose asChild>
                  <Button className="w-full justify-start text-left px-3 py-2" variant={"ghost"} asChild>
                  <Link href="/billing" className={` ${path.includes('/billing') ? "bg-accent" : ""} w-full justify-start items-center gap-3 px-3 py-2 flex text-left rounded-none`}>
                  <Banknote className="h-4 w-4" />
                    Billing
                  </Link>
                  </Button>
                  </SheetClose>
                  <Separator />
                  <SheetClose asChild>
                  <Button className="w-full justify-start text-left px-3 py-2" variant={"ghost"} asChild>
                  <Link href="/members" className={` ${path.includes('/members') ? "bg-accent" : ""} w-full justify-start items-center gap-3 px-3 py-2 flex text-left rounded-none`}>
                  <Users className="h-4 w-4" />
                    Members
                  </Link>
                  </Button>
                  </SheetClose>
                  <SheetClose asChild>
                  <Button className="w-full justify-start text-left px-3 py-2" variant={"ghost"} asChild>
                  <Link href="/settings" className={` ${path.includes('/settings') ? "bg-accent" : ""} w-full justify-start items-center gap-3 px-3 py-2 flex text-left rounded-none`}>
                  <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                  </Button>
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