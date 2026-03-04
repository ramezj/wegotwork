import { createServerFn } from "@tanstack/react-start";
import { getSession } from "../../auth/server-session";
import prisma from "@/lib/prisma";
import z from "zod";
import { jobSchema } from "@/types/job/job";

export const createJobFn = createServerFn()
  .inputValidator(z.object({ slug: z.string(), job: jobSchema }))
  .handler(async ({ data }) => {
    const session = await getSession();
    if (!session) {
      throw new Error("Unauthenticated");
    }
    try {
      const organization = await prisma.organization.findFirst({
        where: {
          slug: data.slug,
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
      const { questions, pipelineId: _, categoryId, ...jobData } = data.job;

      const job = await prisma.job.create({
        data: {
          ...jobData,
          organization: {
            connect: { id: organization.id },
          },
          category: categoryId
            ? {
                connect: { id: categoryId },
              }
            : undefined,
          pipeline: {
            create: {
              name: `${data.job.title} Pipeline`,
              organizationId: organization.id,
              stages: {
                create: [
                  { name: "Applied", order: 0 },
                  { name: "Screening", order: 1 },
                  { name: "Interview", order: 2 },
                  { name: "Offer", order: 3 },
                  { name: "Hired", order: 4 },
                  { name: "Rejected", order: 5 },
                ],
              },
            },
          },
          questions: {
            create: (questions || []).map((q) => ({
              type: q.type,
              label: q.label,
              placeholder: q.placeholder,
              required: q.required,
              options: q.options,
              order: q.order,
            })),
          },
        },
      });
      return { success: true, job };
    } catch (error) {
      throw new Error("Something Went Wrong");
    }
  });
