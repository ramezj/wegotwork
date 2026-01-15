import { Button } from "../ui/button";
import { authClient } from "@/lib/auth-client";

export default function LoginButton() {
  return (
    <Button
      onClick={() => {
        authClient.signIn.social({
          provider: "google",
        });
      }}
    >
      Login
    </Button>
  );
}

export function LogOutButton() {
  return (
    <Button
      onClick={() => {
        authClient.signOut();
      }}
    >
      Logout
    </Button>
  );
}
