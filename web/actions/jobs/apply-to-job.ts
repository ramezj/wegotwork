"use server"
import prisma from "@/lib/prisma";
import { Organization } from "@prisma/client";
import { redirect } from "next/navigation";
import { r2 } from "@/lib/r2";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

export async function applyToJob(jobId: string, name: string, emailAddress: string, phoneNumber: number, motivation: string, formData: FormData) {
    try {
        const job = await prisma.job.findFirst({
            where: {
                id:jobId
            }
        })
        if(!job) {
            return { 
                ok:false,
                message: "Job Does Not Exist"
            }
        }
        const file:File = formData.get("file") as File;
        if(!file) {
            return {
                ok:false,
                message:"No Resume Detected"
            }
        }
        const maxSizeBytes = 5* 1024 * 1024;
        if(file.size > maxSizeBytes) {
            return {
                ok:false,
                message:"Maximum Allowed Size 5MB"
            }
        }
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const key = Date.now() + file.name
        const bucketName = "wegotwork";
        const putobject = await new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            Body:buffer
        })
        try {
            const sendObject = await r2.send(putobject);
        } catch (error) {
            return {
                ok:false,
                message:"Couldnt save resume"
            }
        }
        const applicant = await prisma.applicant.create({
            data: {
                jobId: jobId,
                name: name,
                email: emailAddress,
                number: phoneNumber,
                motivation: motivation,
                resumeKey: key
            }
        })
        if(!applicant) {
            return { 
                ok:false,
                message: "Internl Server Error"
            }
        }
        return {
            ok:true,
            message: "Applied to Job Successfully"
        }
    } catch (error) {
        return {
            ok:false,
            message: "Internal Server Error"
        }
    }
}