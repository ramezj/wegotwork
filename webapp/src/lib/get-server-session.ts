import { auth } from "./auth";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { createServerFn } from "@tanstack/react-start";

export const getServerSession = createServerFn().handler(async () => {
  const session = await auth.api.getSession({ headers: getRequestHeaders() });
  return session;
});
