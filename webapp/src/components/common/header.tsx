import { Session } from "@/lib/auth";
import LoginButton from "../auth/login-button";

export default function Header({ session }: { session: Session }) {
  return (
    <header className="w-full sticky top-0 z-50 p-4 border border-b border-l-0 border-r-0 flex flex-row items-center justify-between">
      <div>
        <h1>wegotwork</h1>
      </div>
      <div>
        {session.user ? (
          <>{/* {session.session.activeOrganizationId} */}</>
        ) : (
          <>
            <LoginButton />
          </>
        )}
      </div>
    </header>
  );
}
