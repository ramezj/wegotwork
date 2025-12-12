import { Button } from "@/components/ui/button";
import { NavigationBar } from "@/components/shared/navigation-bar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <div>
      <div className="min-h-screen max-w-screen flex flex-col">
        <NavigationBar session={session?.session || null} />
        <div className="flex-1 flex flex-col items-center relative">
          <h1 className="text-5xl font-bold text-center">
            BUILD BEAUTIFUL CAREER PAGES
          </h1>
          <div className="absolute 2xl:bottom-16 xl:bottom-12 lg:bottom-10 bottom-8">
            <Button>Get Started</Button>
          </div>
        </div>
      </div>
      <div>
        <h1>hello world!</h1>
        <h1>hello world!</h1>
      </div>
    </div>
  );
}
