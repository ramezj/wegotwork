import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { cache } from "react";

export const getServerSession = cache(async () => {
  console.log("getting session");
  return await auth.api.getSession({
    headers: await headers(),
  });
});
