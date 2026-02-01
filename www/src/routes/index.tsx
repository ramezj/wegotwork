import { createFileRoute } from "@tanstack/react-router";
import { getSession } from "@/features/auth/server-session";
import Header from "@/components/shared/header";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const session = await getSession();
    return { session };
  },
  component: App,
});

function App() {
  const { session } = Route.useRouteContext();
  return (
    <div>
      <Header session={session} />
      <div className="justify-center items-center text-center content-center py-16">
        <h1 className="text-4xl">Career Pages, Redefined</h1>
        <div className="flex flex-row gap-2 justify-center items-center">
          <Button className="w-36">Get Started</Button>
          <Button variant={"outline"} className="w-36">
            Learn More
          </Button>
        </div>
        <div className="mt-8 flex justify-center">
          <img
            src="/demo.png"
            alt="Demo"
            className="lg:w-[50%] w-[80%] h-auto border-2"
          />
        </div>
      </div>
    </div>
  );
}
