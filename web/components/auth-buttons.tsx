"use client"
import { signIn, signOut } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { redirect } from "next/navigation";

export function SignInButton() {
    return (
        <Button onClick={(async () => {
            await signIn.social({ provider: "google", callbackURL: "/" })
        })}>
            Sign In
        </Button>
    )
}

export function SignOutButton() {
    return (
        <Button onClick={(async () => {
            await signOut({ fetchOptions: {
                onSuccess: () => {
                    redirect('/');
                }
            }})
        })}>
            Sign Out
        </Button>
    )
}