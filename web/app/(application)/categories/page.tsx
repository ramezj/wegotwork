import { auth } from "@/lib/auth";
import { Session } from "@/lib/auth-client";
import { redirect } from "next/navigation";
// import { Job } from "@prisma/client";
import CreateJob from "@/components/create-job";
import { JobCardForDashboard } from "@/components/cards/job";
import { Job, JobCategory } from "@prisma/client";
import { headers } from "next/headers";
import { Metadata } from "next";
import CreateCategoryButton from "@/components/create-category";
import { GetOrganizationCategories } from "@/actions/category/get-all-categories";
import SortableCategories from "@/components/sortable-categories";

export const metadata: Metadata = {
  title: "Categories",
  description: "Categories",
};

export default async function Page() {
  const session: Session | null = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/");
  }
  if (session.user.currentOrganizationId === null) {
    redirect("/dashboard");
  }
  const categories = await GetOrganizationCategories();
  if (categories?.error) {
    redirect("/");
  }
  return (
    <>
      <div className="flex justify-between items-center w-full">
        <h1 className="font-extrabold text-3xl text-foreground tracking-tight">
          Categories
        </h1>
        <CreateCategoryButton />
      </div>
      <div>
        <SortableCategories
          categories={categories?.categories as JobCategory[]}
        />
      </div>
    </>
  );
}
