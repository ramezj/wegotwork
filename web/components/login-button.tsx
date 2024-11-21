"use client"

import { signIn, signOut } from "next-auth/react";
import { Button } from "./ui/button";
export function LoginButton() {
    return (
        <>
        <Button
        onClick={(() => {
            signIn("google")
        })}
        >Sign In With Google</Button>
        </>
    )
}

export function LogOutButton() {
    return (
        <>
        <Button
        onClick={(() => {
            signOut();
        })}
        >Sign Out</Button>
        </>
    )
}