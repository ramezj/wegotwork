import LayoutNavigation from "@/components/layout";
import { auth } from "@/lib/auth";
import { Session } from "@/lib/auth-client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { Metadata } from "next";

export const metadata:Metadata = {
    title: "billing",
    description: "billing"
}

export default async function DashboardLayout({ children, params }: { children: ReactNode, params: Promise<{ organization: string}>}) {
    return (
        <>
          {children}
        </>
    )
}