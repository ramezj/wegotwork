import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

interface FooterProps {
  className?: string;
}

const footerLinks = [
  { label: "features", href: "/features" },
  { label: "pricing", href: "/pricing" },
];

export function Footer({ className }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "flex w-full items-center justify-between border bg-secondary px-5 rounded-md h-14",
        className,
      )}
    >
      {/* Brand */}
      <Link
        to="/"
        viewTransition
        className="text-base font-medium tracking-tight shrink-0"
      >
        Minstra
      </Link>

      {/* Nav */}
      {/* <nav className="hidden sm:flex flex-row gap-1 items-center">
        {footerLinks.map((link) => (
          <Link
            key={link.label}
            to={link.href}
            viewTransition
            className="text-sm font-normal tracking-tight text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-accent"
          >
            {link.label}
          </Link>
        ))}
      </nav> */}

      {/* Copyright */}
      <p className="text-xs font-normal text-muted-foreground shrink-0">
        © {year} Minstra
      </p>
    </footer>
  );
}
