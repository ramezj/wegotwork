import { Button } from "./ui/button";
import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ThemeToggle } from "./theme-toggle";
import { viewOrganizationBySlugQueryOptions } from "@/features/queries/organization";
import { HeaderBase } from "./shared/header-base";

export function PublicHeader({ slug }: { slug: string }) {
  const { data } = useSuspenseQuery(viewOrganizationBySlugQueryOptions(slug));

  const logo = (
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
  );

  const actions = (
    <>
      {/* <ThemeToggle /> */}
      {/* {data.organization?.linkedIn && (
        <Button variant="default" size="icon" className="group" asChild>
          <Link to={data.organization?.linkedIn} target="_blank">
            <LinkedInIcon className="size-4" />
          </Link>
        </Button>
      )} */}
      {data.organization?.website && (
        <Button variant="default" className="group " asChild>
          <Link to={data.organization?.website} target="_blank">
            Visit Website
          </Link>
        </Button>
      )}
    </>
  );

  return <HeaderBase logo={logo} desktopActions={actions} />;
}
