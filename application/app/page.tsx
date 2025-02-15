
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import SignInButton from "@/components/sign-in";

export default async function Home() {
  const session = await auth.api.getSession({
      headers: await headers()
  })
  return (
    <>
    {JSON.stringify(session?.user)}
    <SignInButton />
    </>
  );
}
