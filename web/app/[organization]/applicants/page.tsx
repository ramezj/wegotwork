import { Metadata } from "next"

export const metadata:Metadata = {
    title: "Applicants",
    description: "Applicants"
}

export default function Page() {
    return (
        <>
        <h1 className="font-bold text-3xl">Applicants</h1>
        </>
    )
}