import { createServerFn } from "@tanstack/react-start";
import { getSession } from "../auth/server-session";
import { auth } from "@/features/auth/auth";
import { getRequest } from "@tanstack/react-start/server";

export const getAllOrganizationsFn = createServerFn().handler(async () => {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthenticated");
  }
  try {
    const organizations = await auth.api.listOrganizations({
      headers: await getRequest().headers,
    });
    return { success: true, organizations };
  } catch (error) {
    throw new Error("Something Went Wrong");
  }
});
