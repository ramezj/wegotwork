'use client'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from "@/components/ui/sheet"
// import { Toggle } from "./toggle"
import { usePathname } from "next/navigation"
import { DollarSignIcon, Laptop } from "lucide-react"
// import { Organization } from "@prisma/client"
// import { TwitterLogoIcon } from "@radix-ui/react-icons"
import { NavigationMenuForNavbar } from "../navigation-menu"
import { Session } from "next-auth"

function useLastPathSegment() {
  const pathname = usePathname();
  const segments = pathname.split('/');
  return segments[segments.length - 1];  // Returns the last segment of the path
}

interface Props {
  session?: Session | null
}

export function Navigation(props: Props) {
  const path = useLastPathSegment();
  return (
    <div className="flex w-full flex-col">
      <header className="sticky top-2 mt-8 flex h-16 items-center gap-4 px-4 z-50 md:mx-12 mx-4 rounded-xl border border-foreground/20 backdrop-blur-lg">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link href="/" className="flex items-center text-lg font-bold italic">
          heliup
          </Link>
         <NavigationMenuForNavbar />
        </nav>
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
          <SheetContent side="left" className="flex flex-col dark:bg-black bg-white">
            <SheetTitle>
              <SheetClose asChild>
                <Link href="/" className="px-2 flex items-center text-lg font-bold justify-center italic">
                  heliup
                </Link>
                </SheetClose>
                </SheetTitle>
                <nav className="grid gap-3 text-lg font-medium mt-1">
                <SheetClose asChild>
                <Link href='https://demo.heliup.xyz' className={`${path == 'jobs' ? 'bg-muted/50 text-foreground' : ' text-muted-foreground'} flex items-center gap-3 rounded-lg px-2 py-2 text-primary transition-all hover:text-primary hover:bg-muted/50 duration-200 font-medium`}>
                <Laptop className="h-4 w-4" />
                Features
                </Link>
                </SheetClose>
                <SheetClose asChild>
                <Link href='https://demo.heliup.xyz' className={`${path == 'jobs' ? 'bg-muted/50 text-foreground' : ' text-muted-foreground'} flex items-center gap-3 rounded-lg px-2 py-2 text-primary transition-all hover:text-primary hover:bg-muted/50 duration-200 font-medium`}>
                <Laptop className="h-4 w-4" />
                Demo
                </Link>
                </SheetClose>
                <SheetClose asChild>
                <Link href='/pricing' className={`${path == 'applicants' ? 'bg-muted/50 text-foreground' : ' text-muted-foreground'} flex items-center gap-3 rounded-lg px-2 py-2 text-primary transition-all hover:text-primary hover:bg-muted/50 duration-200 font-medium`}>
                <DollarSignIcon className="h-4 w-4" />
                Pricing
                </Link>
                </SheetClose>
              </nav>
            </SheetContent>
        </Sheet>
        <div className="flex w-full items-center gap-3">
          <div className="ml-auto align-middle flex gap-3">
            {/* <Toggle /> */}
          {
            props.session 
            ? 
            <>
                <Button variant="default" asChild className="duration-200">
                  <Link href='/pick-workspace'>
                  Dashboard
                  </Link>
                  </Button>
            </>
            :
            <>
                  <Button variant="outline" asChild className="duration-200">
                  <Link href='/auth'>
                  Login
                  </Link>
                  </Button>
                  <Button variant="default" asChild className="duration-200">
                  <Link href='/auth'>
                  Start for free
                  </Link>
                  </Button>
            </>
          }
          </div>
        </div>
      </header>
    </div>
  )
}
