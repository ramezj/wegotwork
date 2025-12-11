import { Button } from "@/components/ui/button";
import { NavigationBar } from "@/components/shared/navigation-bar";

export default function Home() {
  return (
    <div>
      <div className="min-h-screen max-w-screen">
        <NavigationBar />
        <div className="text-center items-center content-center space-y-4 py-4">
          <h1 className="text-5xl font-bold">BUILD BEAUTIFUL CAREER PAGES</h1>
        </div>
      </div>
      <div>hello world!</div>
    </div>
  );
}
