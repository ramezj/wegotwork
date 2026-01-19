import { createServerFn } from "@tanstack/react-start";
import { getServerSession } from "@/lib/get-server-session";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { getRequest } from "@tanstack/react-start/server";

const setOrganizationSchema = z.object({
  organizationId: z.string(),
  organizationSlug: z.string(),
});

export const setOrganization = createServerFn()
  .inputValidator(setOrganizationSchema)
  .handler(async ({ data }) => {
    const session = await getServerSession();
    if (!session?.user) {
      return {
        error: "Unauthorized",
      };
    }
    await auth.api.setActiveOrganization({
      body: {
        organizationId: data.organizationId,
        organizationSlug: data.organizationSlug,
      },
      headers: await getRequest().headers,
    });
    return {
      success: true,
    };
  });
