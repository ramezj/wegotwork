// import NextAuth from "next-auth";
// import Google from "next-auth/providers/google";
// import { PrismaAdapter } from '@auth/prisma-adapter';
// import prisma from "./lib/db";

// export const { handlers, signIn, signOut, auth } = NextAuth({
//     adapter: PrismaAdapter(prisma),
//     providers: [
//         Google({
//             clientId: process.env.AUTH_GOOGLE_ID,
//             clientSecret: process.env.AUTH_GOOGLE_SECRET,
//             authorization: {
//                 params: {
//                   prompt: "consent",
//                   access_type: "offline",
//                   response_type: "code",
//                 },
//               },
//         })
//     ],
//     secret: process.env.AUTH_SECRET,
//     session: {
//         strategy: 'database'
//     },
//     trustHost: true,
//     callbacks: {
//         async session({ session, user}) {
//             session.user = user;
//             return session;
//         }
//     }
//   })

import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql"
    }),
    socialProviders: ({
        google:({
            clientId: process.env.AUTH_GOOGLE_ID as string,
            clientSecret: process.env.AUTH_GOOGLE_SECRET as string
        })
    })
})