import { ReactNode } from "react";

export default async function Layout({ children, params }: { children: ReactNode, params: { invitationId: string}}) {
    return (
        <main>
        {children}
        </main>
    )
}