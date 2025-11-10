"use client";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Balancer from "react-wrap-balancer";
import { DeleteOrganization } from "@/actions/organization/delete-organization";
import { useState } from "react";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Organization } from "@prisma/client";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function DeleteOrganizationCard({
  organization,
}: {
  organization: Organization;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [organizationName, setOrganizationName] = useState<string>("");
  const deleteOrg = async (e: React.FormEvent, organizationId: string) => {
    e.preventDefault();
    setLoading(true);
    const res = await DeleteOrganization(organization.id);
    if (res?.error) {
      toast(res.message);
    } else {
      setLoading(false);
      redirect("/dashboard");
    }
  };
  return (
    <Card className="w-full rounded-none dark:bg-theme bg-gray-200 border border-dashed">
      <CardHeader>
        <CardTitle className="font-extrabold text-foreground">
          Delete Organization
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="font-bold text-foreground w-fit sm:text-base text-sm">
          This will permanently delete <b>{organization.name}</b>
        </h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="rounded-none" variant={"destructive"}>
              Delete Organization
            </Button>
          </DialogTrigger>
          <DialogContent
            onOpenAutoFocus={(e) => {
              e.preventDefault();
            }}
            className="text-left w-[90%] bg-theme border border-dashed !rounded-none "
          >
            <DialogHeader>
              <DialogTitle className="text-left font-medium text-white !text-xl">
                DANGER ZONE
              </DialogTitle>
            </DialogHeader>
            <div className="grid">
              <div className="grid items-center gap-4">
                <Label
                  htmlFor="name"
                  className="text-left font-medium text-white"
                >
                  Project Name
                </Label>
                <form id="form">
                  <Input
                    type="text"
                    id="name"
                    onChange={(e) => {
                      setOrganizationName(e.target.value);
                    }}
                    value={organizationName}
                    required
                    placeholder={`${organization.name}`}
                    className="bg-accent border-dashed  rounded-none border text-white font-medium text-base"
                  />
                </form>
              </div>
            </div>
            <DialogFooter>
              <Button
                disabled={organizationName !== organization.name}
                onClick={(e) => {
                  deleteOrg(e, organization.id);
                }}
                variant={"destructive"}
                className="px-4 w-full font-medium rounded-none"
              >
                {loading ? (
                  <Loader2 className="mr-1 h-4 w-4 animate-spin text-white" />
                ) : (
                  <></>
                )}
                Delete Organization
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
