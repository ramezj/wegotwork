import { authClient } from "@/features/auth/auth-client";
import { Button } from "../ui/button";

import { cn } from "@/lib/utils";

export function SignInButton({ className }: { className?: string }) {
  return (
    <Button
      className={cn("px-8 font-semibold cursor-pointer", className)}
      onClick={() => {
        authClient.signIn.social({ provider: "google", callbackURL: "/" });
      }}
    >
      Sign In
    </Button>
  );
}
