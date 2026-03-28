import { authClient } from "@/features/auth/auth-client";
import { Button } from "../ui/button";
import { Link } from "@tanstack/react-router";

import { cn } from "@/lib/utils";

export function SignInButton({ className }: { className?: string }) {
  return (
    <Button
      className={cn("px-8 font-semibold cursor-pointer", className)}
      // onClick={() => {
      //   authClient.signIn.social({ provider: "google", callbackURL: "/" });
      // }}
      asChild
    >
      <Link viewTransition to="/auth">
        Sign In
      </Link>
    </Button>
  );
}
