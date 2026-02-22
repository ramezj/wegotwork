import { Button } from "./ui/button";
import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { viewOrganizationBySlugQueryOptions } from "@/features/queries/organization";
import { ArrowRight, Bell, Moon } from "lucide-react";

export function PublicHeader({ slug }: { slug: string }) {
  const { data } = useSuspenseQuery(viewOrganizationBySlugQueryOptions(slug));
  return (
    <header className="w-full px-4 sticky top-0 z-50 border-b border-input bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-6xl mx-auto h-16 flex items-center justify-between">
        <Link
          viewTransition
          to="/view/$slug"
          params={{ slug }}
          className="flex items-center gap-2"
        >
          <span className="text-xl font-medium tracking-tight">
            {data.organization?.name}
          </span>
        </Link>
        <div className="flex items-center gap-4">
          {data.organization?.website && (
            <Button variant="outline" size="sm" className="group" asChild>
              <Link to={data.organization?.website} target="_blank">
                Visit Website
                <ArrowRight className="text-white duration-100 group-hover:-rotate-45" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
