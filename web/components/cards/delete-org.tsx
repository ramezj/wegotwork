"use client"
import { Button } from "../ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card"
import Balancer from "react-wrap-balancer"
import { DeleteOrganization } from "@/actions/organization/delete-organization"
import { useState } from "react"
import { toast } from "sonner"
import { redirect } from "next/navigation"
import { Loader2 } from "lucide-react"

export function DeleteOrganizationCard({ organizationId } : { organizationId: string }) {
    const [ loading, setLoading ] = useState<boolean>(false);
    const deleteOrg = async (e: React.FormEvent, organizationId: string) => {
        e.preventDefault();
        setLoading(true);
        const res = await DeleteOrganization(organizationId);
        if(res?.error) {
            toast(res.message);
        } else {
            setLoading(false);
            redirect('/dashboard')
        }
    }
    return (
        <Card className="w-full bg-theme border-2 shadow-[0_4px_0_0_rgba(0,0,0,1)]">
        <CardHeader>
            <CardTitle className='font-extrabold text-white'>Delete Organization</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h1 className='font-bold text-white w-fit sm:text-base text-sm'>
                Are you sure you want to delete this organization?
            </h1>
            <Button variant={"destructive"} className="border border-white/20" 
            onClick={((e) => {deleteOrg(e, organizationId)})} 
            disabled={loading}>
            {loading ? <Loader2 className="size-4 mr-2 animate-spin text-white" /> : <></>}
            Delete Organization
            </Button>
        </CardContent>
        </Card>
    )
}