import { headers } from "next/headers";
import { SignInButton } from "./components/sign-in";
import { auth } from "@/lib/auth";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <>
      <SignInButton />
      {session?.user && (
        <>
          <p>hello, {session.user.name}</p>
        </>
      )}
    </>
  );
}
