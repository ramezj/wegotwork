"use client";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function SignInButton() {
  const login = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dash",
    });
  };
  return (
    <>
      <Button onClick={login}>sign in</Button>
    </>
  );
}
