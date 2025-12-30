"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function LoginButton() {
  return (
    <>
      <Button
        onClick={() => {
          authClient.signIn.social({
            provider: "google",
            callbackURL: "/dash",
          });
        }}
      >
        Sign In
      </Button>
    </>
  );
}
