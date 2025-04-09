"use client"
import React, {useState } from "react"
import { Button } from "./ui/button";
import { CreateInvitation } from "@/actions/invitations/create";
import { toast } from "sonner";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogDescription, DialogTitle, DialogFooter } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Loader2, CheckCircle, Link, Copy, Check, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { OrganizationInvite } from "@prisma/client";
import { formatRole } from "@/lib/format-role";
import { Mail } from "lucide-react";

export function PendingInvitations({ OrganizationInvites } : { OrganizationInvites: OrganizationInvite[] }) {
    return (
      <>
      <Card className="w-full bg-white rounded-none">
      <CardHeader>
        <CardTitle className="text-2xl font-extrabold text-black">Pending invitations</CardTitle>
        {
          OrganizationInvites.length > 0
          &&
          <CardDescription className="text-gray-800 font-bold">{OrganizationInvites.length} invitations awaiting response </CardDescription>
        }
      </CardHeader>
      <CardContent className="">
        {
          OrganizationInvites.length === 0 
          && 
          <>
          <p className="text-sm font-bold text-black">no pending invitations</p>
          </>
        }
        {
            OrganizationInvites.map((Invitation) => {
                return (
                    <div className="flex items-center justify-between space-y-2" key={Invitation.id}>
                    <div className='flex items-center gap-2'>
                    <Mail className="size-4 text-black" />
                    <h1 className="font-bold text-black">{Invitation.email}</h1>
                    </div>
                    <div>
                      <Button size={"icon"} className=''><MoreHorizontal className="text-black size-4" /></Button>
                    </div>
                    </div>
                )
            })
        }
      </CardContent>
      <CardFooter>
      </CardFooter>
    </Card>
    </>
    )
}