'use client'

import Link from "next/link"
import { Home, Users, Banknote, Briefcase, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from "@/components/ui/sheet"
import { redirect, usePathname } from "next/navigation"
import { Session } from "@/lib/auth-client"
import { Separator } from "./ui/separator"
import { DropDownMenuUser } from "./dropdown-menu"

export default function LayoutNavigation({ children, session, organization }: { children: React.ReactNode; session: Session, organization: string }) {
  if(!session.user) {
    redirect('/');
  } 
  const path = usePathname();
    return (
      <div className="grid min-h-screen w-full md:grid-cols-[200px_1fr] lg:grid-cols-[250px_1fr]">
        <div className="hidden border-r md:block">
          <div className="flex h-full max-h-screen flex-col gap-2 sticky top-0 z-50">
            <div className="flex h-16 items-center border-b px-3 lg:h-16 text-center justify-center">
            <Link href='/' className="flex items-center justify-center align-middle">
              <span className="font-bold text-lg italic align-middle">heliup</span>
            </Link>
            </div>
            <div className="flex-1 ">
              <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-2 mt-1">
                <Link href={`/${organization}/overview`} className={`${path.includes('/overview') ? 'bg-accent text-foreground' : ' text-muted-foreground'} font-semibold flex items-center gap-3 rounded-md px-3 py-2 text-primary transition-all hover:text-primary hover:bg-accent duration-200`}>
                 <Home className="size-4" />
                  Overview
                </Link>
                <Link href={`/${organization}/jobs`} className={`${path.includes('/jobs') ? 'bg-accent text-foreground' : ' text-muted-foreground'} font-semibold flex items-center gap-3 rounded-md px-3 py-2 text-primary transition-all hover:text-primary hover:bg-accent duration-200`}>
                  <Briefcase className="h-4 w-4" />
                  Jobs
                </Link>
                <Link href={`/${organization}/applicants`} className={`${path.includes('/applicants') ? 'bg-accent text-foreground' : ' text-muted-foreground'} font-semibold flex items-center gap-3 rounded-md px-3 py-2 text-primary transition-all hover:text-primary hover:bg-accent duration-200`}>
                <Users className="h-4 w-4" />
                  Applicants
                </Link>
                <Link href={`/${organization}/billing`} className={`${path.includes('/billing')? 'bg-accent text-foreground' : ' text-muted-foreground'} font-semibold flex items-center gap-3 rounded-md px-3 py-2 text-primary transition-all hover:text-primary hover:bg-accent duration-200`}>
                <Banknote className="h-4 w-4" />
                  Billing
                </Link>
                <Separator />
                <Link href={`/${organization}/members`} className={`${path.includes('/members') ? 'bg-accent text-foreground' : ' text-muted-foreground'} font-semibold flex items-center gap-3 rounded-md px-3 py-2 text-primary transition-all hover:text-primary hover:bg-accent duration-200`}>   
                <Users className="h-4 w-4" />
                  Members
                </Link>
                <Link href={`/${organization}/settings`} className={`${path.includes('/settings') ? 'bg-accent text-foreground' : ' text-muted-foreground'} font-semibold flex items-center gap-3 rounded-md px-3 py-2 text-primary transition-all hover:text-primary hover:bg-accent duration-200`}>   
                <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </nav>
            </div>
            <div className="p-4 w-full flex gap-2">
              <DropDownMenuUser session={session} />
            </div>
          </div>
        </div>
        <div className="flex flex-col sticky">
          <header className="z-50 flex h-16 items-center gap-4 border-b px-3 lg:h-16 sticky top-0 bg-background">
            <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0 md:hidden">
              <svg strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
              <path d="M3 5H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
              <path d="M3 12H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
              <path d="M3 19H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
              <SheetContent side="left" className="flex flex-col bg-background">
              <SheetTitle>
                <SheetClose asChild>
                  <Link href="/" className="px-2 flex items-center text-lg font-bold italic justify-center">
                    heliup
                  </Link>
                  </SheetClose>
                </SheetTitle>
                <nav className="grid gap-3 text-lg font-medium mt-1">
                <SheetClose asChild>
                <Link href={`/${organization}/overview`} className={`${path.includes('/overview') ? 'bg-accent text-foreground' : ' text-muted-foreground'} font-semibold flex items-center gap-3 rounded-md px-3 py-2 text-primary transition-all hover:text-primary hover:bg-accent duration-200`}>
                 <Home className="size-4" />
                  Overview
                </Link>
                  </SheetClose>
                  <SheetClose asChild>
                  <Link href={`/${organization}/jobs`} className={`${path.includes('/jobs') ? 'bg-accent text-foreground' : ' text-muted-foreground'} font-semibold flex items-center gap-3 rounded-md px-3 py-2 text-primary transition-all hover:text-primary hover:bg-accent duration-200`}>
                  <Briefcase className="h-4 w-4" />
                  Jobs
                </Link>
                  </SheetClose>
                  <SheetClose asChild>
                  <Link href={`/${organization}/applicants`} className={`${path.includes('/applicants') ? 'bg-accent text-foreground' : ' text-muted-foreground'} font-semibold flex items-center gap-3 rounded-md px-3 py-2 text-primary transition-all hover:text-primary hover:bg-accent duration-200`}>
                  <Users className="h-4 w-4" />
                    Applicants
                  </Link>
                  </SheetClose>
                  <SheetClose asChild>
                  <Link href={`/${organization}/billing`} className={`${path.includes('/billing')? 'bg-accent text-foreground' : ' text-muted-foreground'} font-semibold flex items-center gap-3 rounded-md px-3 py-2 text-primary transition-all hover:text-primary hover:bg-accent duration-200`}>
                  <Banknote className="h-4 w-4" />
                    Billing
                  </Link>
                  </SheetClose>
                  <Separator />
                  <SheetClose asChild>
                  <Link href={`/${organization}/members`} className={`${path.includes('/members') ? 'bg-accent text-foreground' : ' text-muted-foreground'} font-semibold flex items-center gap-3 rounded-md px-3 py-2 text-primary transition-all hover:text-primary hover:bg-accent duration-200`}>
                  <Users className="h-4 w-4" />
                    Members
                  </Link>
                  </SheetClose>
                  <SheetClose asChild>
                  <Link href={`/${organization}/settings`} className={`${path.includes('/settings') ? 'bg-accent text-foreground' : ' text-muted-foreground'} font-semibold flex items-center gap-3 rounded-md px-3 py-2 text-primary transition-all hover:text-primary hover:bg-accent duration-200`}>
                  <Settings className="h-4 w-4" />
                    Settings
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