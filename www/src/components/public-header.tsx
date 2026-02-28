import { Button } from "./ui/button";
import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { viewOrganizationBySlugQueryOptions } from "@/features/queries/organization";
import { ArrowRight } from "lucide-react";

export function PublicHeader({ slug }: { slug: string }) {
  const { data } = useSuspenseQuery(viewOrganizationBySlugQueryOptions(slug));
  return (
    <header className="w-full px-4 h-16 rounded-lg border backdrop-blur supports-backdrop-filter:bg-background/60 flex flex-row items-center justify-between">
      <Link
        viewTransition
        to="/view/$slug"
        params={{ slug }}
        className="flex items-center gap-2"
      >
        <span className="text-xl font-semibold tracking-tight">
          {data.organization?.name}
        </span>
      </Link>
      <div className="flex items-center gap-4">
        {data.organization?.website && (
          <Button variant="default" className="group" asChild>
            <Link to={data.organization?.website} target="_blank">
              Visit Website
              <ArrowRight className="text-white duration-100 group-hover:-rotate-45" />
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
}
