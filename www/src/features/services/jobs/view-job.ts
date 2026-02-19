import { createServerFn } from "@tanstack/react-start";
import prisma from "@/lib/prisma";
import z from "zod";

export const viewJobFn = createServerFn()
  .inputValidator(z.object({ jobId: z.string() }))
  .handler(async ({ data }) => {
    try {
      const job = await prisma.job.findFirst({
        where: {
          id: data.jobId,
          status: "PUBLISHED",
        },
        include: {
          organization: {
            select: {
              name: true,
              logo: true,
              slug: true,
              description: true,
              website: true,
            },
          },
          category: {
            select: {
              name: true,
            },
          },
        },
      });

      if (!job) {
        return { success: false, error: "Job not found or not published" };
      }

      return { success: true, job };
    } catch (error) {
      console.error("Error in viewJobFn:", error);
      throw new Error("Something Went Wrong");
    }
  });
