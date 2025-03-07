import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { PrismaClient } from "@prisma/client"
import prisma from "./prisma";

export const auth = betterAuth({
    trustedOrigins: ['http://localhost:3000', 'https://heliup.xyz'],
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60
        }
    },
    database: prismaAdapter(prisma, {
        provider: "postgresql"
    }),
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        }
    },
    emailAndPassword: {
        enabled: true
    }
})