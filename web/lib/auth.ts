import { betterAuth, string } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import prisma from "./prisma";
import { customSession } from "better-auth/plugins";

export const auth = betterAuth({
  trustedOrigins: [
    "http://localhost:3000",
    "https://wegotwork.co",
    "https://www.wegotwork.co",
    "https://wegotwork.co/api/auth",
    `${process.env.BASE_URL}`,
    "https://sha8alny.up.railway.app/api/auth",
    "https://sha8alny.up.railway.app",
  ],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60, // lets see.
    },
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day (every 1 day the session expiration is updated)
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    customSession(async ({ user, session }) => {
      const currentOrganizationId = await prisma.user.findFirst({
        where: {
          id: user.id,
        },
        select: {
          isPremium: true,
          currentOrganizationId: true,
          currentOrganization: true,
        },
      });
      const userOrganizations = await prisma.organizationUser.findMany({
        where: {
          userId: user.id,
        },
        include: {
          organization: true,
        },
      });
      return {
        user: {
          ...user,
          currentOrganizationId: currentOrganizationId?.currentOrganizationId,
          currentOrganization: currentOrganizationId?.currentOrganization,
          organizations: userOrganizations,
          isPremium: currentOrganizationId?.isPremium,
        },
        session: session,
      };
    }),
  ],
});
