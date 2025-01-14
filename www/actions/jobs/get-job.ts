import prisma from "@/lib/db";

export async function GetJob(jobId: string) {
    try {
        const job = await prisma.job.findFirst({
            where: {
                id: jobId
            }
        });
        if(!job) {
            return { 
                error: true,
                message: "Job doesnt exist"
            }
        }
        return {
            error: false,
            job:job
        };
    } catch (error) {
        return {
            error: true,
            message: error
        };
    }
}