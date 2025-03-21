import type { Metadata } from "next"
import { ReactNode } from "react"

export default async function RootLayout({ children, params }: { children: ReactNode, params: Promise<{ organization: string}>}) {
    return (
        <div className="" suppressHydrationWarning>
          {children}
        </div>
    )
}