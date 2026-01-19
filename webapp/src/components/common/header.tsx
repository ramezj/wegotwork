import { Session } from "@/lib/auth";
import LoginButton from "../auth/login-button";
import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";

export default function Header({ session }: { session: Session | null }) {
  return (
    <header className="w-full sticky top-0 z-50 p-4 border border-b border-l-0 border-r-0 flex flex-row items-center justify-between">
      <div className="flex-row flex gap-2 items-center content-center align-middle">
        <h1 className="font-bold">wegotwork</h1>
        <Link className="font-medium" to={"/organization/manage"}>
          pricing
        </Link>
        <Link className="font-medium" to={"/organization/manage"}>
          resources
        </Link>
        <Link className="font-medium" to={"/organization/manage"}>
          support
        </Link>
        <Link className="font-medium" to={"/organization/manage"}>
          blog
        </Link>
      </div>
      <div className="flex-row gap-2 items-center md:flex hidden">
        {/* <Link className="font-medium" to={"/organization/manage"}>
          Pricing
        </Link>
        <Link className="font-medium" to={"/organization/manage"}>
          Resources
        </Link>
        <Link className="font-medium" to={"/organization/manage"}>
          Support
        </Link>
        <Link className="font-medium" to={"/organization/manage"}>
          Blog
        </Link> */}
      </div>
      <div>
        {session?.user ? (
          <>
            {session.session.activeOrganizationId &&
            session.session.activeOrganizationSlug ? (
              <Button asChild>
                <Link
                  to={"/$slug/dash"}
                  params={{ slug: session.session.activeOrganizationSlug }}
                >
                  Dashboard
                </Link>
              </Button>
            ) : (
              <Button asChild>
                <Link to={"/organization/manage"}>Dashboard</Link>
              </Button>
            )}
          </>
        ) : (
          <>
            <LoginButton />
          </>
        )}
      </div>
    </header>
  );
}
