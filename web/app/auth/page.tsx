
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Navigation } from "@/components/navbar";
import SignIn from "@/components/sign-in";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  return (
    <>
    <Navigation session={session} />
    <div className="flex items-center justify-center py-24">
        <SignIn />
    </div>
    </>
  );
}
