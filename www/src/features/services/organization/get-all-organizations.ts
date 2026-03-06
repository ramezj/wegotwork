import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/features/auth/middleware";
import { auth } from "@/features/auth/auth";
import { getRequest } from "@tanstack/react-start/server";

export const getAllOrganizationsFn = createServerFn()
  .middleware([authMiddleware])
  .handler(async () => {
    try {
      const organizations = await auth.api.listOrganizations({
        headers: await getRequest().headers,
      });
      return { success: true, organizations };
    } catch (error) {
      throw new Error("Something Went Wrong");
    }
  });
