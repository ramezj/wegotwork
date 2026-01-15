import { createServerFn } from "@tanstack/react-start";
import { getServerSession } from "@/lib/get-server-session";
import { auth } from "@/lib/auth";
import { getRequest } from "@tanstack/react-start/server";

export const getAllOrganizationsFn = createServerFn().handler(async () => {
  const session = await getServerSession();
  if (!session.user) {
    return {
      error: "Unauthorized",
    };
  }
  try {
    const organizations = await auth.api.listOrganizations({
      headers: await getRequest().headers,
    });
    return { organizations };
  } catch (error) {
    return {
      error: "Failed to fetch organizations",
    };
  }
});
