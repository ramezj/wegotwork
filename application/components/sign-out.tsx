"use client"
import { authClient } from "@/lib/auth-client"
import { Button } from "./ui/button"

export function SignOutButton() {
    return (
        <>
        <Button 
        onClick={( async () => {
            await authClient.signOut()
        })}
        >Sign Out</Button>
        </>
    )
}