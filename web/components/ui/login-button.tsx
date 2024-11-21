"use client"

import { signIn } from "next-auth/react";
import { Button } from "./button";
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