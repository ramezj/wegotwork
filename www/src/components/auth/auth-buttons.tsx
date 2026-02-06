import { authClient } from "@/features/auth/auth-client";
import { Button } from "../ui/button";

export function SignInButton() {
  return (
    <Button
      className="h-16 px-8 font-semibold"
      onClick={() => {
        authClient.signIn.social({ provider: "google", callbackURL: "/" });
      }}
    >
      Sign In
    </Button>
  );
}
