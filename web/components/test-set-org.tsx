"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "./ui/card";
import { SetCurrentOrganization } from "@/actions/organization/set-current-org";
import { Prisma } from "@prisma/client";
import { Button } from "./ui/button";
import { CreateOrganizationButton } from "./create-organization";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

type OrganizationUserWithOrganization = Prisma.OrganizationUserGetPayload<{
  include: {
    organization: true;
  };
}>;

export function TestSetOrganizationCard({
  userOrganizations,
}: {
  userOrganizations: OrganizationUserWithOrganization[];
}) {
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const setUserOrg = async (e: React.FormEvent, organizationId: string) => {
    e.preventDefault();
    setSelectedOrgId(organizationId);
    setIsSelecting(true);
    const res = await SetCurrentOrganization(organizationId);
    if (res?.error) {
      toast(res.message);
      setIsSelecting(false);
    } else {
      redirect("/overview");
    }
  };
  return (
    <div className="sm:w-[35%]">
      <Card className="bg-theme w-full border border-white/20">
        <CardHeader className="text-center">
          <CardTitle className="text-white font-extrabold">
            Organizations
          </CardTitle>
          <CardDescription className="text-white font-bold">
            Organizations you own or are a part of
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="">
            <div className="flex flex-col">
              {userOrganizations.map(
                (organization: OrganizationUserWithOrganization) => {
                  return (
                    <form
                      className="my-2"
                      onSubmit={(e) => {
                        setUserOrg(e, organization.organizationId);
                      }}
                      key={organization.organizationId}
                    >
                      <div className="flex justify-between w-full">
                        <Button
                          type="submit"
                          variant="outline"
                          className={`${selectedOrgId === organization.organizationId ? "bg-accent text-white" : "bg-accent text-white"} font-extrabold border border-white/20 flex-1`}
                        >
                          {organization.organizationId === selectedOrgId &&
                          isSelecting ? (
                            <>
                              <Loader2 className="animate-spin text-white flex mr-2" />
                              {organization.organization.name}
                            </>
                          ) : (
                            <>{organization.organization.name}</>
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          className="ml-2 px-4 font-bold"
                        >
                          View
                        </Button>
                      </div>
                    </form>
                  );
                },
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 -mt-2 justify-between">
          <CreateOrganizationButton />
        </CardFooter>
      </Card>
    </div>
  );
}
