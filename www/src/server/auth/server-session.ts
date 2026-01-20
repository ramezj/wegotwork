import { createServerFn } from "@tanstack/react-start";
import { auth } from "@/lib/auth";
import { getRequestHeaders } from "@tanstack/react-start/server";

export const getSession = createServerFn().handler(async () => {
  return auth.api.getSession({
    headers: getRequestHeaders(),
  });
});
