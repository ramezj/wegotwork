import { createAuthClient } from "better-auth/react";
import { customSessionClient } from "better-auth/client/plugins";
import { auth } from "./auth";

export const authClient = createAuthClient({
  baseURL: process.env.BASE_URL,
  plugins: [customSessionClient<typeof auth>()],
});

export const { signIn, signUp, useSession, signOut } = createAuthClient();
export type Session = typeof authClient.$Infer.Session;
