import { createServerFn } from "@tanstack/react-start";
import { getSession } from "../auth/server-session";
import prisma from "@/lib/prisma";
import z from "zod";

export const getJobByIdFn = createServerFn()
  .inputValidator(z.object({ jobId: z.string() }))
  .handler(async ({ data }) => {
    const session = await getSession();
    if (!session) {
      throw new Error("Unauthenticated");
    }
    try {
      const job = await prisma.job.findFirst({
        where: {
          id: data.jobId,
          organization: {
            members: {
              some: {
                userId: session.user.id,
              },
            },
          },
        },
        include: {
          category: true,
          _count: {
            select: {
              applicants: true,
            },
          },
        },
      });
      return { success: true, job };
    } catch (error) {
      throw new Error("Something Went Wrong");
    }
  });
