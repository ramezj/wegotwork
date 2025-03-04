import { Metadata } from "next"

export const metadata:Metadata = {
    title: "Applicants",
    description: "Applicants"
}

export default function Page() {
    return (
        <>
        <h1 className="font-extrabold text-4xl text-black tracking-tight">applicants</h1>
        </>
    )
}