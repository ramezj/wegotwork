"use client";

import { GetOrganization } from "@/actions/organization/organization";
import { useSession } from "@/lib/auth-client";
import { redirect, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SquareArrowOutUpRight, Loader2 } from "lucide-react";
import { TotalJobs, TotalApplicants } from "@/components/statistics";
import { SettingsCard } from "@/components/cards/settings";
import { Organization } from "@prisma/client";
import { BaseLayout } from "@/components/base-layout";
import { useQuery } from "@tanstack/react-query";

export default function Page() {
  const { data: session, isPending: sessionLoading } = useSession();
  const {
    data: userOrganization,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user-organization", session?.user?.currentOrganizationId],
    queryFn: () => GetOrganization(session!.user!.currentOrganizationId!),
    enabled: !!session?.user?.currentOrganizationId,
  });
  if (sessionLoading || isLoading) {
    return (
      <BaseLayout title="Overview">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="size-8 animate-spin text-foreground" />
        </div>
      </BaseLayout>
    );
  }

  if (!session?.user || !session.user.currentOrganizationId) {
    return null;
  }

  if (error || userOrganization?.error) {
    return (
      <BaseLayout title="Overview">
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">Error loading organization data</p>
        </div>
      </BaseLayout>
    );
  }

  return (
    <>
      <BaseLayout
        title={"Overview"}
        button={
          <Button
            asChild
            variant={"outline"}
            className="dark:bg-theme bg-gray-200 hover:bg-gray-200 px-4 rounded-none !border border-dashed font-bold text-foreground"
          >
            <Link
              target="_blank"
              href={`http://${userOrganization?.organization?.organization.slug}.${process.env.NEXT_PUBLIC_URL}`}
            >
              Preview
              <SquareArrowOutUpRight className="size-4" />
            </Link>
          </Button>
        }
      >
        <div className="flex sm:flex-row flex-col w-full gap-4">
          <TotalJobs
            title="Jobs"
            amount={
              userOrganization?.organization?.organization.jobs.length as number
            }
          />
          <TotalApplicants
            title="Applicants"
            amount={userOrganization?.applicants as number}
          />
          <TotalApplicants
            title="Categories"
            amount={
              userOrganization?.organization?.organization.categories
                .length as number
            }
          />
        </div>
        <SettingsCard
          organization={
            userOrganization?.organization?.organization as Organization
          }
        />
      </BaseLayout>
    </>
  );
}
