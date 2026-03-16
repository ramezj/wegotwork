import { Session } from "@/features/auth/auth";
import { SignInButton } from "../auth/auth-buttons";
import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import { HeaderBase } from "./header-base";

export default function Header({ session }: { session: Session | null }) {
  const navLinks = [
    { label: "features", href: "/" },
    { label: "pricing", href: "/" },
    { label: "about", href: "/" },
  ];

  const logo = (
    <Link to="/" className="text-xl font-semibold tracking-tight mr-2">
      loux
    </Link>
  );

  const desktopNav = navLinks.map((link) => (
    <Link
      key={link.label}
      to={link.href}
      className="text-xl font-medium tracking-tight text-muted-foreground hover:text-foreground transition-colors"
    >
      {link.label}
    </Link>
  ));

  const authActions = session?.user ? (
    <>
      <Button variant="secondary" asChild className="font-semibold cursor-pointer ">
        <Link to="/dashboard">
          Log Out <LogOut className="size-4 ml-1" />
        </Link>
      </Button>
      <Button variant="default" asChild className="font-semibold cursor-pointer ">
        <Link preload="render" to="/dashboard">
          Open Dashboard
        </Link>
      </Button>
    </>
  ) : (
    <SignInButton />
  );

  const mobileNav = navLinks.map((link) => (
    <Link
      key={link.label}
      to={link.href}
      className="flex items-center py-2 rounded-md text-base font-medium text-foreground hover:bg-muted transition-colors"
    >
      {link.label}
    </Link>
  ));

  const mobileActions = session?.user ? (
    <>
      <Button variant="secondary" asChild className="w-full font-semibold ">
        <Link to="/dashboard">
          Log Out <LogOut className="size-4 ml-1" />
        </Link>
      </Button>
      <Button variant="default" asChild className="w-full font-semibold ">
        <Link preload="render" to="/dashboard">
          Open Dashboard
        </Link>
      </Button>
    </>
  ) : (
    <SignInButton className="w-full" />
  );

  return (
    <div className="fixed top-6 inset-x-0 z-50 pointer-events-none mb-8">
      <div className="w-full lg:w-[80%] mx-auto px-4 pointer-events-auto">
        <HeaderBase
          logo={logo}
          desktopNav={desktopNav}
          desktopActions={authActions}
          mobileNav={mobileNav}
          mobileActions={mobileActions}
        />
      </div>
    </div>
  );
}
