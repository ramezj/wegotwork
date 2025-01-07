import type { Metadata } from "next"
import { ReactNode } from "react"

export const metadata:Metadata ={
    title:"Jobs",
    description:"Workspace Jobs"
}

export default async function Layout({ children, params }: { children: ReactNode, params: { workspace: string}}) {
    return (
        <>
          {children}
        </>
    )
}