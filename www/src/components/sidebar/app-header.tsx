import { SidebarTrigger } from "@/components/ui/sidebar";
import { useParams } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
// import { ThemeToggle } from "../theme-toggle";
// import { ThemeToggle } from "../theme-toggle";

export function AppHeader() {
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
  const { slug } = useParams({ strict: false });
  const previewUrl = `${import.meta.env.DEV ? "http://careers.localhost:3000" : "https://careers.lunics.co"}/${slug}`;
  return (
    <header className="sticky top-0 z-10 flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-background md:rounded-t-xl">
      <div className="flex w-full justify-between items-center gap-1 px-4">
        <div className="hidden md:flex">
          <h1 className="text-base font-semibold ">{title}</h1>
        </div>
        <div className="md:hidden flex">
          <SidebarTrigger />
        </div>
        <div className="flex flex-row gap-2">
          {/* <ThemeToggle /> */}
          {slug && (
            <Button asChild className="group h-8">
              <a
                href={previewUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1"
              >
                Preview{" "}
                <ArrowRight className="size-4 duration-100 group-hover:rotate-0 -rotate-45" />
              </a>
            </Button>
          )}
          {/* <Button variant={"default"}>
            <BellIcon fill="currentColor" />
          </Button> */}
        </div>
      </div>
    </header>
  );
}
