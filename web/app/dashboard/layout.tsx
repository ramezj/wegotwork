import type { Metadata } from "next"
import { ReactNode } from "react"

export default async function RootLayout({ children }: { children: ReactNode, params: Promise<{ organization: string}>}) {
    return (
        <main suppressHydrationWarning>
          {children}
        </main>
    )
}