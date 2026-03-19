import { ReactNode, useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";

interface HeaderBaseProps {
  logo: ReactNode;
  desktopNav?: ReactNode;
  desktopActions?: ReactNode;
  mobileNav?: ReactNode;
  mobileActions?: ReactNode;
  className?: string;
  onOpenChange?: (open: boolean) => void;
}

export function HeaderBase({
  logo,
  desktopNav,
  desktopActions,
  mobileNav,
  mobileActions,
  className,
  onOpenChange,
}: HeaderBaseProps) {
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    onOpenChange?.(open);
  }, [open, onOpenChange]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (
        open &&
        headerRef.current &&
        !headerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [open]);

  const hasMobileMenu = mobileNav || mobileActions;

  return (
    <header
      ref={headerRef}
      className={cn(
        "px-4 border bg-background/60 backdrop-blur-md overflow-hidden transition-all duration-300 ease-in-out w-full flex flex-col",
        open ? "rounded-lg" : "rounded-lg",
        className,
      )}
    >
      {/* Top bar */}
      <div className="h-16 flex items-center justify-between shrink-0">
        {/* Left side: Logo + Desktop Nav */}
        <div className="flex items-center gap-1" onClick={() => setOpen(false)}>
          {logo}
          {desktopNav && (
            <nav className="hidden md:flex flex-row gap-2 items-center">
              {desktopNav}
            </nav>
          )}
        </div>

        {/* Right side: Desktop Actions + Mobile Toggle */}
        <div className="flex items-center gap-2">
          {desktopActions && (
            <div className="hidden md:flex flex-row gap-2 items-center">
              {desktopActions}
            </div>
          )}

          {hasMobileMenu && (
            <Button
              variant={"ghost"}
              className="md:hidden flex items-center justify-center size-9 relative"
              onClick={() => setOpen((prev) => !prev)}
              aria-label={open ? "Close menu" : "Open menu"}
            >
              <Menu
                className={cn(
                  "absolute size-5 transition-all duration-200 ease-in-out",
                  open
                    ? "scale-50 opacity-0 -rotate-90"
                    : "scale-100 opacity-100 rotate-0",
                )}
              />
              <X
                className={cn(
                  "absolute size-5 transition-all duration-200 ease-in-out",
                  open
                    ? "scale-100 opacity-100 rotate-0"
                    : "scale-50 opacity-0 rotate-90",
                )}
              />
            </Button>
          )}
        </div>
      </div>

      {/* Mobile expanded nav */}
      {hasMobileMenu && (
        <div
          className={cn(
            "md:hidden grid transition-all duration-300 ease-in-out",
            open
              ? "grid-rows-[1fr] opacity-100 pointer-events-auto"
              : "grid-rows-[0fr] opacity-0 pointer-events-none",
          )}
        >
          <div 
            className="overflow-hidden flex flex-col"
            onClick={(e) => {
              const target = e.target as HTMLElement;
              if (target.closest("a")) {
                setOpen(false);
              }
            }}
          >
            <div className="flex flex-col gap-2 pb-5">
              {mobileNav && (
                <nav className="flex flex-col gap-1">
                  {mobileNav}
                </nav>
              )}
              {mobileActions && (
                <div className={cn(
                  "flex flex-col gap-2",
                  mobileNav ? "border-t pt-4" : "pt-2"
                )}>
                  {mobileActions}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
