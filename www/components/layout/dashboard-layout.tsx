'use client'

import Link from "next/link"
import { Home, Users, BriefcaseBusiness, Settings2, Banknote, LogOut, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from "@/components/ui/sheet"
import { redirect, usePathname } from "next/navigation"
import { Session } from "next-auth"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { signOut } from "next-auth/react"
import { Separator } from "../ui/separator"

export default function LayoutNavigation({ children, session, params }: { children: React.ReactNode; session: Session, params: {workspace: string} }) {
  if(!session) {
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
                <Link href={`/${params.workspace}/overview`} className={`${path.includes('/overview') ? 'bg-accent text-foreground' : ' text-muted-foreground'} font-semibold flex items-center gap-3 rounded-md px-3 py-2 text-primary transition-all hover:text-primary hover:bg-accent duration-200`}>
                 <div className="border rounded-md border-foreground/30 dark:bg-black p-1 bg-white">
                 <Home className="size-4" />
                 </div>
                  Overview
                </Link>
                <Link href={`/${params.workspace}/jobs`} className={`${path.includes('/jobs') ? 'bg-accent text-foreground' : ' text-muted-foreground'} font-semibold flex items-center gap-3 rounded-md px-3 py-2 text-primary transition-all hover:text-primary hover:bg-accent duration-200`}>
                <div className="border border-foreground/30 rounded-md dark:bg-black p-1 bg-white">
                  <BriefcaseBusiness className="h-4 w-4" />
                  </div>
                  Jobs
                </Link>
                <Link href={`/${params.workspace}/applicants`} className={`${path.includes('/applicants') ? 'bg-accent text-foreground' : ' text-muted-foreground'} font-semibold flex items-center gap-3 rounded-md px-3 py-2 text-primary transition-all hover:text-primary hover:bg-accent duration-200`}>
                <div className="border border-foreground/30 rounded-md dark:bg-black p-1 bg-white">
                <Users className="h-4 w-4" />
                </div>
                  Applicants
                </Link>
                <Link href={`/${params.workspace}/billing`} className={`${path.includes('/billing')? 'bg-accent text-foreground' : ' text-muted-foreground'} font-semibold flex items-center gap-3 rounded-md px-3 py-2 text-primary transition-all hover:text-primary hover:bg-accent duration-200`}>
                <div className="border border-foreground/30 rounded-md dark:bg-black p-1 bg-white">
                <Banknote className="h-4 w-4" />
                </div>
                  Billing
                </Link>
                <Separator />
                <Link href={`/${params.workspace}/settings`} className={`${path.includes('/settings') ? 'bg-accent text-foreground' : ' text-muted-foreground'} font-semibold flex items-center gap-3 rounded-md px-3 py-2 text-primary transition-all hover:text-primary hover:bg-accent duration-200`}>
                <div className="border border-foreground/30 rounded-md dark:bg-black p-1 bg-white">     
                <Settings2 className="h-4 w-4" />
                </div>
                  Settings
                </Link>
              </nav>
            </div>
            <div className="p-4 w-full flex gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"outline"} className="w-full bg-inherit border-foreground/20">
                    {session.user?.name}
                    <ChevronsUpDown className="ml-auto size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width] bg-background space-y-2"
                >
                  <DropdownMenuItem className="cursor-pointer" asChild>
                  <Link href={"/settings"} className="flex align-middle items-center"><Settings2 className="size-4 mr-2" />Switch Workspace</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" asChild>
                  <Link href={"/settings"} className="flex align-middle items-center"><Settings2 className="size-4 mr-2" />Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" asChild>
                  <Link href={"/billing"} className="flex align-middle items-center"><Banknote className="size-4 mr-2" />Billing</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(() => { signOut({ callbackUrl: "/"})})} className="cursor-pointer">
                    <span className="flex align-middle items-center"><LogOut className="size-4 mr-2" />Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
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
                  <Link href={`/${params.workspace}/overview`} className={`${path.includes('/overview') ? 'bg-accent text-foreground' : ' text-muted-foreground'} font-semibold flex items-center gap-3 rounded-md px-3 py-2 text-primary transition-all hover:text-primary hover:bg-accent duration-200`}>
                 <div className="border rounded-md border-foreground/30 dark:bg-black p-1 bg-white">
                 <Home className="size-4" />
                 </div>
                  Overview
                </Link>
                  </SheetClose>
                  <SheetClose asChild>
                  <Link href={`/${params.workspace}/jobs`} className={`${path.includes('/jobs') ? 'bg-accent text-foreground' : ' text-muted-foreground'} font-semibold flex items-center gap-3 rounded-md px-3 py-2 text-primary transition-all hover:text-primary hover:bg-accent duration-200`}>
                  <div className="border border-foreground/30 rounded-md dark:bg-black p-1 bg-white">
                  <BriefcaseBusiness className="h-4 w-4" />
                  </div>
                  Jobs
                </Link>
                  </SheetClose>
                  <SheetClose asChild>
                  <Link href={`/${params.workspace}/applicants`} className={`${path.includes('/applicants') ? 'bg-accent text-foreground' : ' text-muted-foreground'} font-semibold flex items-center gap-3 rounded-md px-3 py-2 text-primary transition-all hover:text-primary hover:bg-accent duration-200`}>
                  <div className="border border-foreground/30 rounded-md dark:bg-black p-1 bg-white">
                  <Users className="h-4 w-4" />
                  </div>
                    Applicants
                  </Link>
                  </SheetClose>
                  <SheetClose asChild>
                  <Link href={`/${params.workspace}/billing`} className={`${path.includes('/billing')? 'bg-accent text-foreground' : ' text-muted-foreground'} font-semibold flex items-center gap-3 rounded-md px-3 py-2 text-primary transition-all hover:text-primary hover:bg-accent duration-200`}>
                  <div className="border border-foreground/30 rounded-md dark:bg-black p-1 bg-white">
                  <Banknote className="h-4 w-4" />
                  </div>
                    Billing
                  </Link>
                  </SheetClose>
                  <Separator />
                  <SheetClose asChild>
                  <Link href={`/${params.workspace}/settings`} className={`${path.includes('/settings') ? 'bg-accent text-foreground' : ' text-muted-foreground'} font-semibold flex items-center gap-3 rounded-md px-3 py-2 text-primary transition-all hover:text-primary hover:bg-accent duration-200`}>
                  <div className="border border-foreground/30 rounded-md dark:bg-black p-1 bg-white">     
                  <Settings2 className="h-4 w-4" />
                  </div>
                    Settings
                  </Link>
                  </SheetClose>
                </nav>
                <div className="w-full flex gap-2 pt-4 bottom-0 mt-auto">
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"outline"} className="w-full bg-inherit border-foreground/20">
                    {session.user?.name}
                    <ChevronsUpDown className="ml-auto size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width] bg-background space-y-2">
                    <DropdownMenuItem className="cursor-pointer" asChild>
                  <Link href={"/settings"} className="flex align-middle items-center"><Settings2 className="size-4 mr-2" />Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" asChild>
                  <Link href={"/billing"} className="flex align-middle items-center"><Banknote className="size-4 mr-2" />Billing</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(() => { signOut({ callbackUrl: "/" })})} className="cursor-pointer">
                    <span className="flex align-middle items-center"><LogOut className="size-4 mr-2" />Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
                </div>
              </SheetContent>
            </Sheet>
            <div className="w-full flex-1">
            </div>
            <div className="flex-1"></div> 
            {/* <div className="ml-auto">
              {
                session.user?.isPremium === false &&
                <>
                <Button asChild className="bg-inherit" variant={"outline"}>
                <Link href="/billing">
                <Gem className="size-4 mr-2"/>
                Upgrade to Professional
                </Link>
                </Button>
                </>
              }
            </div> */}
          </header>
            {children}
        </div>
      </div>
    )
}