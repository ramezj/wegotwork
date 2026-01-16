import { createServerFn } from "@tanstack/react-start";
import { createOrganizationSchema } from "../types/schema";
import { getServerSession } from "@/lib/get-server-session";
import prisma from "@/lib/prisma";

export const createOrganizationFn = createServerFn()
  .inputValidator(createOrganizationSchema)
  .handler(async ({ data }) => {
    const session = await getServerSession();
    if (!session.user) {
      return {
        error: "Unauthorized",
      };
    }
    try {
      // const organization = await auth.api.createOrganization({
      //   body: {
      //     name: data.name,
      //     slug: data.slug,
      //     userId: session.user.id,
      //   },
      // });
      const organization = await prisma.organization.create({
        data: {
          name: data.name,
          slug: data.slug,
          members: {
            create: {
              userId: session.user.id,
              role: "owner",
            },
          },
        },
      });
      await prisma.session.update({
        where: {
          id: session.session.id,
        },
        data: {
          activeOrganizationId: organization?.id,
        },
      });
    } catch (error) {
      return {
        error: "Failed to create organization",
      };
    }
    return data;
  });
