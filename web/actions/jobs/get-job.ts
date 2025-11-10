"use server";
import prisma from "@/lib/prisma";

export async function getJobById(jobId: string) {
  try {
    const job = await prisma.job.findUnique({
      where: {
        id: jobId,
      },
    });
    if (!job) {
      return {
        error: true,
        message: "Job doesnt exist",
      };
    }
    return {
      error: false,
      job,
    };
  } catch (error) {
    return {
      error: true,
      message: "Internal Server Error",
    };
  }
}
