"use server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { cache } from "react";

export const useUser = cache(async () => {
  return await auth.api.getSession({
    headers: await headers(),
  });
});
