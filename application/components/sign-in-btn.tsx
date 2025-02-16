"use client"
import { Button } from "./ui/button"
import { signIn } from "@/lib/auth-client"

export function SignInButton() {
    return (
        <>
        <Button 
        onClick={( async () => {
            await signIn.social({
                provider: "google",
                callbackURL: "/"
            })
        })}
        >Sign In With Google</Button>
        </>
    )
}