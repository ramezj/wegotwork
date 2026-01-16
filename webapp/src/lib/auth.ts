import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { organization } from "better-auth/plugins/organization";
import { customSession } from "better-auth/plugins";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  plugins: [
    organization(),
    // customSession(async ({ user, session }) => {
    //   const userWithOnboarded = await prisma.user.findFirst({
    //     where: {
    //       id: user.id,
    //     },
    //     select: {
    //       onboarded: true,
    //     },
    //   });
    //   return {
    //     user: {
    //       ...user,
    //       onboarded: userWithOnboarded?.onboarded,
    //     },
    //     session: session,
    //   };
    // }),
  ],
});

export type Session = typeof auth.$Infer.Session;
