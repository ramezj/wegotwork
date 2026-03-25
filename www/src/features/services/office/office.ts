import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/features/auth/middleware";
import prisma from "@/lib/prisma";
import z from "zod";
import { officeSchema } from "@/types/organization/schemas";

const organizationInputSchema = z.object({
  organizationId: z.string(),
});

const createOfficeInputSchema = z.object({
  organizationId: z.string(),
  office: officeSchema,
});

const updateOfficeInputSchema = z.object({
  id: z.string(),
  office: officeSchema,
});

const deleteOfficeInputSchema = z.object({
  id: z.string(),
});

export const getOfficesFn = createServerFn()
  .middleware([authMiddleware])
  .inputValidator(organizationInputSchema)
  .handler(async ({ data, context }) => {
    const { session } = context;

    const offices = await prisma.office.findMany({
      where: {
        organizationId: data.organizationId,
        organization: {
          members: {
            some: {
              userId: session.user.id,
            },
          },
        },
      },
      include: {
        _count: {
          select: {
            jobs: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return offices;
  });

export const createOfficeFn = createServerFn()
  .middleware([authMiddleware])
  .inputValidator(createOfficeInputSchema)
  .handler(async ({ data, context }) => {
    const { session } = context;

    const organization = await prisma.organization.findFirst({
      where: {
        id: data.organizationId,
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
    });

    if (!organization) {
      throw new Error("Organization not found");
    }

    const office = await prisma.office.create({
      data: {
        ...data.office,
        organizationId: organization.id,
      },
    });

    return office;
  });

export const updateOfficeFn = createServerFn()
  .middleware([authMiddleware])
  .inputValidator(updateOfficeInputSchema)
  .handler(async ({ data, context }) => {
    const { session } = context;

    const existingOffice = await prisma.office.findFirst({
      where: {
        id: data.id,
        organization: {
          members: {
            some: {
              userId: session.user.id,
            },
          },
        },
      },
    });

    if (!existingOffice) {
      throw new Error("Office not found");
    }

    const office = await prisma.office.update({
      where: {
        id: data.id,
      },
      data: {
        ...data.office,
      },
    });

    return office;
  });

export const deleteOfficeFn = createServerFn()
  .middleware([authMiddleware])
  .inputValidator(deleteOfficeInputSchema)
  .handler(async ({ data, context }) => {
    const { session } = context;

    const existingOffice = await prisma.office.findFirst({
      where: {
        id: data.id,
        organization: {
          members: {
            some: {
              userId: session.user.id,
            },
          },
        },
      },
      include: {
        _count: {
          select: {
            jobs: true,
          },
        },
      },
    });

    if (!existingOffice) {
      throw new Error("Office not found");
    }

    if (existingOffice._count.jobs > 0) {
      throw new Error("Reassign jobs before deleting this office");
    }

    await prisma.office.delete({
      where: {
        id: data.id,
      },
    });

    return { success: true };
  });
