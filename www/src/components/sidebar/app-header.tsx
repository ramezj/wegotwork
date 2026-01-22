import { SidebarTrigger } from "@/components/ui/sidebar";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-(--header-height) shrink-0 items-center gap-2 border-b">
      <div className="flex w-full items-center gap-1 px-4">
        <h1 className="text-base font-medium hidden md:flex">dashboard</h1>
        <div className="md:hidden flex">
          <SidebarTrigger />
        </div>
        <div className="ml-auto flex items-center gap-2"></div>
      </div>
    </header>
  );
}
