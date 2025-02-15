"use client"

import { authClient } from "@/utils/auth-client";

export function SignInButton() {
    const signInFunction = async (e: React.FormEvent) => {
        e.preventDefault();
        await authClient.signIn.social({
            provider: "google",
            callbackURL: "/",
            newUserCallbackURL: "/newUser"
        })
    }
    return (
        <>
        <button onClick={signInFunction}>Sign In</button>
        </>
    )
}