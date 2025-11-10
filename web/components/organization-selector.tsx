"use client";

import { useState } from "react";
import { Building2, Check, ChevronRight, Crown, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SetCurrentOrganization } from "@/actions/organization/set-current-org";
import { Prisma } from "@prisma/client";
import { toast } from "sonner";
import { redirect } from "next/navigation";

type OrganizationUserWithOrganization = Prisma.OrganizationUserGetPayload<{
  include: {
    organization: true;
  };
}>;

export function OrganizationSelector({
  userOrganizations,
}: {
  userOrganizations: OrganizationUserWithOrganization[];
}) {
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  const handleSelectOrganization = async (organizationId: string) => {
    setSelectedOrgId(organizationId);
    setIsSelecting(true);

    try {
      await SetCurrentOrganization(organizationId);
    } catch (error) {
      console.error("Failed to select organization:", error);
    } finally {
      setIsSelecting(false);
      redirect("/overview");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-4">
      {userOrganizations.map((userOrg) => (
        <Card
          key={userOrg.id}
          className={`transition-all rounded-none bg-white text-black ${selectedOrgId === userOrg.organizationId ? "ring-2 ring-primary" : ""}`}
        >
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div className="flex flex-col space-y-1.5">
              <CardTitle className="text-xl">
                {userOrg.organization.name}
              </CardTitle>
              <CardDescription>{userOrg.organization.slug}</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              {userOrg.role === "owner" && (
                <Badge
                  variant="outline"
                  className="text-xs rounded-none bg-white text-black border border-black"
                >
                  Owner
                </Badge>
              )}
              {/* {userOrg.organization.premium && (
                <Badge className="bg-amber-500 hover:bg-amber-600">
                  <Crown className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              )} */}
            </div>
          </CardHeader>
          {/* <CardContent>
            <div className="flex items-start space-x-3">
              <div className="bg-muted rounded-md p-2 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {userOrg.organization.description || "No description provided."}
                </p>
              </div>
            </div>
          </CardContent> */}
          <CardFooter>
            <Button
              className="w-full rounded-none text-white bg-black hover:bg-black"
              variant={"default"}
              onClick={() => handleSelectOrganization(userOrg.organizationId)}
            >
              {selectedOrgId === userOrg.organizationId ? (
                <>
                  {isSelecting ? (
                    <>
                      <Loader2 className="text-white animate-spin" />
                    </>
                  ) : (
                    <></>
                  )}
                  Select
                </>
              ) : (
                <>Select</>
              )}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
