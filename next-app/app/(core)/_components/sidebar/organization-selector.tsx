import { Session } from "better-auth";
import { Button } from "@/components/ui/button";
import { Organization } from "@/src/generated/prisma/client";

export function OrganizationSelector({
  session,
  organization,
}: {
  session: Session;
  organization: Organization | null;
}) {
  return (
    <>
      <Button variant={"outline"} className="w-full">
        {organization?.name}
      </Button>
    </>
  );
}
