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
import { Select, SelectTrigger } from "./ui/select";

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
      <Card className="w-full bg-white rounded-none">
      <CardHeader>
        <CardTitle className="text-2xl font-extrabold text-black">Invite member</CardTitle>
      </CardHeader>
      <CardContent className="">
        <form className="flex sm:flex-row flex-col gap-4" onSubmit={create_the_invitation}>
        <Input className="bg-white border border-black rounded-none text-black font-bold text-base" type="email" required placeholder="Enter member's email address" value={email as string} onChange={((e) => {setEmail(e.target.value)})} />
       {/* <Select>
       <SelectTrigger className='rounded-none bg-white text-black font-bold border border-black'>
          Role
        </SelectTrigger>
        </Select> */}
        {
          loading
          ? 
          <>
          <Button disabled onClick={create_the_invitation} className="font-extrabold bg-black hover:bg-black rounded-none text-white">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          invite member 
          </Button>
          </>
          : 
          <>
          <Button type="submit" className="font-extrabold bg-black text-white hover:bg-black rounded-none border border-black">
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