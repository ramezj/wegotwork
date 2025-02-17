
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { SignInButton, SignOutButton } from "@/components/auth-buttons";

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
      <>
      <SignInButton />
      </>
    }
    </>
  );
}
