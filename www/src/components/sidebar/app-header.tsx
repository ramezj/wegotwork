import { SidebarTrigger } from "@/components/ui/sidebar";
import { useMatches } from "@tanstack/react-router";

export function AppHeader() {
  const matches = useMatches();

  const getTitle = () => {
    const routeId = matches[matches.length - 1]?.routeId;

    if (routeId?.includes("/jobs")) {
      return "Jobs";
    }

    if (routeId?.includes("/applicants")) {
      return "Applicants";
    }

    if (routeId === "/$slug/_layout/") {
      return "Overview";
    }

    return "Dashboard";
  };

  const title = getTitle();

  return (
    <header className="sticky top-0 z-10 flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-background ">
      <div className="flex w-full items-center gap-1 px-4">
        <h1 className="text-base font-bold hidden md:flex">{title}</h1>
        <div className="md:hidden flex">
          <SidebarTrigger />
        </div>
        <div className="ml-auto flex items-center gap-2"></div>
      </div>
    </header>
  );
}
