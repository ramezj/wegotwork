
"use server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { r2 } from "@/lib/r2"
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function getApplicantById(applicantId: string) {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if(!session) {
        redirect('/')
    }
    try {
        const applicant = await prisma.applicant.findFirst({
            where: {
                id: applicantId
            }
        })
        if(!applicant) {
            return {
                error:true,
                applicant:null
            }
        }
        const command = await new GetObjectCommand({
            Bucket:'wegotwork',
            Key: applicant.resumeKey
        })
        console.log("Command : ", command);
        const url = await getSignedUrl(r2, command);
        console.log("URL : ", url);
        return { 
            applicant,
            url
        }
    } catch (error) {
        
    }
}