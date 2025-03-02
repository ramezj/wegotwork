"use client"
import React, {useState } from "react"
import { Button } from "./ui/button";
import { CreateInvitation } from "@/actions/invitations/create";
import { toast } from "sonner";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogDescription, DialogTitle, DialogFooter } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Loader2, CheckCircle, Link, Copy, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function CreateUserInvitation({ organizationId} : { organizationId: string}) {
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ invitationLink, setInvitationLink ] = useState<string | null>(null)
    const [ isCopied, setIsCopied ] = useState<boolean>(false);
    const [ email, setEmail ] = useState<string>("");
    const create_the_invitation = async (e:React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const res = await CreateInvitation(organizationId, email as string);
        setLoading(false);
        toast(res?.message)
        setIsCopied(false);
    }
    const handleCopyLink = () => {
      if(invitationLink) {
        navigator.clipboard.writeText(invitationLink)
        setIsCopied(true);
      }
    }
    return (
      <>
      <Card className="w-full bg-white rounded-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-extrabold text-black">invite members</CardTitle>
      </CardHeader>
      <CardContent className="">
        <form className="flex flex-row gap-2" onSubmit={create_the_invitation}>
        <Input className="bg-white border border-black rounded-sm text-black font-extrabold" type="email" required placeholder="john@heliup.xyz" value={email as string} onChange={((e) => {setEmail(e.target.value)})} />
        {
          loading
          ? 
          <>
          <Button disabled onClick={create_the_invitation} className="font-extrabold bg-black hover:bg-black rounded-sm text-white">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          invite member 
          </Button>
          </>
          : 
          <>
          <Button type="submit" className="font-extrabold bg-black hover:bg-black rounded-sm text-white">
          invite member
          </Button>
          </>
        }
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-black font-bold">
          add team members to join your organization & help you recruit.
        </p>
      </CardFooter>
    </Card>
    </>
    )
}