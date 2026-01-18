import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
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
  session: {
    additionalFields: {
      activeOrganizationSlug: {
        type: "string",
        required: false,
      },
    },
  },
  databaseHooks: {
    session: {
      create: {
        before: async (session: any) => {
          if (session.activeOrganizationId) {
            const org = await prisma.organization.findUnique({
              where: { id: session.activeOrganizationId },
            });
            if (org) {
              return {
                data: {
                  ...session,
                  activeOrganizationSlug: org.slug,
                },
              };
            }
          }
          return { data: session };
        },
      },
      update: {
        before: async (session: any) => {
          if (session.activeOrganizationId) {
            const org = await prisma.organization.findUnique({
              where: { id: session.activeOrganizationId },
            });
            if (org) {
              return {
                data: {
                  ...session,
                  activeOrganizationSlug: org.slug,
                },
              };
            }
          }
          return { data: session };
        },
      },
    },
    organization: {
      update: {
        after: async (org: any) => {
          if (org.slug) {
            await prisma.session.updateMany({
              where: { activeOrganizationId: org.id },
              data: { activeOrganizationSlug: org.slug },
            });
          }
        },
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
