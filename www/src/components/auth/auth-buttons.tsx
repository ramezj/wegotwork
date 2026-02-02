import { authClient } from "@/features/auth/auth-client";
import { Button } from "../ui/button";

export function SignInButton() {
  return (
    <Button
      className="w-52"
      onClick={() => {
        authClient.signIn.social({ provider: "google", callbackURL: "/" });
      }}
    >
      Sign In
    </Button>
  );
}
