import type { Metadata } from "next"
import { ReactNode } from "react"

export default async function Layout({ children, params }: { children: ReactNode, params: Promise<{ organization: string}>}) {
    return (
        <html className="bg-white dark:bg-white" suppressHydrationWarning>
        <body className="!bg-white dark:!bg-white" suppressHydrationWarning>
          {children}
        </body>
        </html>
    )
}