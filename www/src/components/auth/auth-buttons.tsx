import { authClient } from "@/features/auth/auth-client";
import { Button } from "../ui/button";

export function SignInButton() {
  return (
    <Button
      className="px-8 font-semibold cursor-pointer"
      onClick={() => {
        authClient.signIn.social({ provider: "google", callbackURL: "/" });
      }}
    >
      Sign In
    </Button>
  );
}
