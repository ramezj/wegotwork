import { auth } from "./auth";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { createServerFn } from "@tanstack/react-start";
import { redirect } from "@tanstack/react-router";

export const getServerSession = createServerFn().handler(async () => {
  console.log("I have been called from the server!");
  const session = await auth.api.getSession({ headers: getRequestHeaders() });
  if (!session?.user) {
    throw redirect({ to: "/" });
  }
  return session;
});
