import { Button } from "@/components/ui/button";
import { NavigationBar } from "@/components/shared/navigation-bar";

export default function Home() {
  return (
    <div>
      <div className="min-h-screen text-white bg-red-500 max-w-screen">
        <NavigationBar />
        <h1 className="max-w-xs text-3xl leading-10 tracking-tight text-black dark:text-zinc-50 font-bold">
          wegotwork
        </h1>
        <Button>Click me</Button>
      </div>
      <div>hello world!</div>
    </div>
  );
}
