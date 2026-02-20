import { Button } from "./ui/button";
import { Link } from "@tanstack/react-router";

export function PublicHeader({ slug }: { slug: string }) {
  return (
    <header className="w-full sticky top-0 z-50 border-b border-input bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-6xl mx-auto lg:px-0 px-4 h-16 flex items-center justify-between">
        <Link
          viewTransition
          to="/view/$slug"
          params={{ slug }}
          className="flex items-center gap-2"
        >
          <span className="font-bold text-xl tracking-tight capitalize">
            {slug.replace(/-/g, " ")}
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/view/$slug" params={{ slug }}>
              View jobs
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
