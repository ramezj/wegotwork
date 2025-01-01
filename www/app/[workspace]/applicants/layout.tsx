import type { Metadata } from "next"
import { ReactNode } from "react"

export const metadata:Metadata ={
    title:"Applicants",
    description:"Workspace Applicants"
}

export default async function Layout({ children, params }: { children: ReactNode, params: { workspace: string}}) {
    return (
        <>
        <main>
          {children}
        </main>
        </>
    )
}