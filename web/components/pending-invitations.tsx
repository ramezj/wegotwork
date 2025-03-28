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
import { OrganizationInvite } from "@prisma/client";
import { formatRole } from "@/lib/format-role";

export function PendingInvitations({ OrganizationInvites } : { OrganizationInvites: OrganizationInvite[] }) {
    return (
      <>
      <Card className="w-full bg-white rounded-none">
      <CardHeader>
        <CardTitle className="text-2xl font-extrabold text-black">Pending invitations</CardTitle>
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
                    <h1 className="font-bold text-black">{Invitation.email}</h1>
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