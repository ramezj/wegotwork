
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { SignOutButton } from "@/components/auth-buttons";
import SignIn from "@/components/sign-in";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  return (
    <>
    {
      session?.user
      ?
      <>
      Hello {session.user.name}
      <SignOutButton />
      </>
      : 
      <div className="flex flex-row w-full items-center gap-4">
      <SignIn />
      </div>
    }
    </>
  );
}
