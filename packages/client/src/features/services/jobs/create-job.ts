import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/features/auth/middleware";
import prisma from "@/lib/prisma";
import z from "zod";
import { jobSchema } from "@/types/job/job";
import { isRichTextEmpty, sanitizeRichTextHtml } from "@/lib/rich-text";

export const createJobFn = createServerFn()
  .middleware([authMiddleware])
  .inputValidator(z.object({ slug: z.string(), job: jobSchema }))
  .handler(async ({ data, context }) => {
    const { session } = context;
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
      const { questions, categoryId, officeId, pipelineId, ...jobData } = data.job;

      const pipeline = await prisma.pipeline.findFirst({
        where: {
          id: pipelineId,
          organizationId: organization.id,
        },
      });

      if (!pipeline) {
        throw new Error("Pipeline not found");
      }

      const office = officeId
        ? await prisma.office.findFirst({
            where: {
              id: officeId,
              organizationId: organization.id,
            },
          })
        : null;

      if (officeId && !office) {
        throw new Error("Office not found");
      }

      const job = await prisma.job.create({
        data: {
          ...jobData,
          description: isRichTextEmpty(jobData.description)
            ? null
            : sanitizeRichTextHtml(jobData.description),
          organization: {
            connect: { id: organization.id },
          },
          category: categoryId
            ? {
              connect: { id: categoryId },
            }
            : undefined,
          office: office
            ? {
                connect: { id: office.id },
              }
            : undefined,
          pipeline: {
            connect: { id: pipeline.id },
          },
          questions: {
            create: (questions || []).map((q) => ({
              type: q.type,
              label: q.label,
              placeholder: q.placeholder,
              required: !!q.required,
              options: q.options,
              order: q.order,
            })),
          },
        },
      });
      return new Response(JSON.stringify({ success: true, job }), { status: 200, statusText: "Job created successfully" });
    } catch (error) {
      return new Response(JSON.stringify({ success: false, error: "Something Went Wrong" }), { status: 500, statusText: "Something Went Wrong" });
    }
  });
