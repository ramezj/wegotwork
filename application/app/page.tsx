
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { SignOutButton } from "@/components/sign-out";
import { SignInButton } from "@/components/sign-in-btn";

export default async function Home() {
  const session = await auth.api.getSession({
      headers: await headers()
  })
  return (
    <>
    {JSON.stringify(session?.user)}
    {
      session?.user 
      ? 
      <>
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
