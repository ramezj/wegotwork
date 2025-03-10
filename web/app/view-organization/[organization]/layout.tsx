import type { Metadata } from "next"
import { ReactNode } from "react"

export default async function Layout({ children, params }: { children: ReactNode, params: Promise<{ organization: string}>}) {
    return (
        <div className="!bg-white dark:!bg-white min-h-screen" suppressHydrationWarning>
          {children}
        </div>
    )
}