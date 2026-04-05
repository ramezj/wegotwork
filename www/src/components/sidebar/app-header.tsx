import { SidebarTrigger } from "@/components/ui/sidebar";
import { useNavigate, useMatches } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { BellIcon, LogOut } from "lucide-react";
import { auth } from "@/features/auth/auth";
import { authClient } from "@/features/auth/auth-client";
import { ThemeToggle } from "../theme-toggle";
// import { ThemeToggle } from "../theme-toggle";

export function AppHeader() {
  const matches = useMatches();

  const getTitle = () => {
    // const routeId = matches[matches.length - 1]?.routeId;

    // if (routeId?.includes("/jobs")) {
    //   return "Jobs";
    // }

    // if (routeId?.includes("/applicants")) {
    //   return "Applicants";
    // }
    // if (routeId?.includes("/candidates")) {
    //   return "Candidates";
    // }
    // if (routeId === "/$slug/_layout/") {
    //   return "Dashboard";
    // }
    // if (routeId.includes("/pipelines/")) {
    //   return "Pipelines";
    // }
    // if (routeId.includes("/categories")) {
    //   return "Categories";
    // }
    // if (routeId.includes("/offices")) {
    //   return "Offices";
    // }
    // if (routeId.includes("/organization")) {
    //   return "Organization";
    // }
    // if (routeId.includes("/billing")) {
    //   return "Billing";
    // }
    // if (routeId.includes("/team")) {
    //   return "Team";
    // }
    return "Dashboard";
  };

  const title = getTitle();
  const navigate = useNavigate();
  const logOut = async () => {
    await authClient.signOut();
    navigate({ to: "/" });
  };
  return (
    <header className="sticky top-0 z-10 flex h-(--header-height) shrink-0 items-center gap-2 border-b backdrop-blur supports-[backdrop-filter]:bg-background/60 md:rounded-t-xl">
      <div className="flex w-full justify-between items-center gap-1 px-4">
        <div className="hidden md:flex">
          <h1 className="text-base font-semibold ">{title}</h1>
        </div>
        <div className="md:hidden flex">
          <SidebarTrigger />
        </div>
        <div className="flex flex-row gap-2">
          <ThemeToggle />
          <Button variant={"outline"} className="" onClick={logOut}>
            Log Out <LogOut />
          </Button>
          {/* <Button variant={"default"}>
            <BellIcon fill="currentColor" />
          </Button> */}
        </div>
      </div>
    </header>
  );
}
