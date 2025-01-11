import type { Metadata } from "next"
import { ReactNode } from "react"

export const metadata:Metadata ={
    title:"Pick a Workspace",
    description:"Pick a Workspace"
}

export default async function Layout({ children, params }: { children: ReactNode, params: Promise<{ workspace: string}>}) {
    return (
        <>
        <main>
          {children}
        </main>
        </>
    )
}