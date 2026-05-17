import { betterAuth } from "better-auth";
import prisma from "../../lib/prisma";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { organization } from "better-auth/plugins/organization";

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
  plugins: [organization()],
  user: {
    additionalFields: {
      plan: {
        type: "string",
        input: false, // Ensure it's not editable by user directly via auth
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
