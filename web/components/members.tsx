"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Prisma } from "@prisma/client";
import { formatRole } from "@/lib/format-role";
import { Session } from "@/lib/auth-client";
import { ManageMember } from "./manage-member";

type OrganizationWithUser = Prisma.OrganizationUserGetPayload<{
  include: {
    user: true;
  };
}>;

export function MembersCard({
  users,
  session,
}: {
  users: OrganizationWithUser[];
  session: Session;
}) {
  return (
    <Card className="dark:bg-theme bg-gray-200 rounded-none border border-dashed">
      <CardHeader>
        <CardTitle className="text-2xl font-extrabold text-foreground">
          Members
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {users.map((users: OrganizationWithUser) => {
          return (
            <div
              className="flex items-center justify-between"
              key={users.user.id}
            >
              <div className="flex items-center space-x-4" key={users.user.id}>
                <Avatar className="cursor-pointer !rounded-none !bg-white text-black">
                  <AvatarImage src={undefined} />
                  <AvatarFallback className="rounded-none bg-white">
                    {session?.user.name?.charAt(0) ?? "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm leading-none text-foreground font-bold">
                    {users.user.name}
                  </p>
                  <p className="text-sm text-foreground font-bold">
                    {formatRole(users.role)}
                  </p>
                </div>
              </div>
              {session.user?.id === users.userId ? (
                <></>
              ) : (
                <>
                  <ManageMember OrganizationUser={users} />
                </>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
