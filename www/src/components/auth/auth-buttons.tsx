import { authClient } from "@/features/auth/auth-client";
import { Button } from "../ui/button";

export function SignInButton() {
  return (
    <Button
      onClick={() => {
        authClient.signIn.social({ provider: "google", callbackURL: "/" });
      }}
    >
      Sign In
    </Button>
  );
}
