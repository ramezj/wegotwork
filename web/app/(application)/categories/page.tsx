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

export const metadata:Metadata = {
    title: "Categories",
    description: "Categories"
}

export default async function Page() {
    const session:Session | null = await auth.api.getSession({
        headers: await headers()
    });
    if(!session) { 
        redirect('/')
    }
    if(session.user.currentOrganizationId === null) {
        redirect('/dashboard');
    }
    const categories = await GetOrganizationCategories();
    if(categories?.error) {
        redirect('/');
    }
    return (
        <>
        <div className="flex justify-between items-center w-full">
        <h1 className="font-extrabold text-4xl text-black tracking-tight">Categories</h1>
        <CreateCategoryButton id={session.user.currentOrganizationId!} buttonSize={"sm"} buttonColor="white" />
        </div>
        {
            categories?.categories?.map((category) => {
                return (
                    <>
                    <p className='text-black font-bold' key={category.id}>{category.name}</p>
                    </>
                )
            })
        }
        <div>
            <SortableCategories categories={categories?.categories as JobCategory[]} />
        </div>
        </>
    )
}