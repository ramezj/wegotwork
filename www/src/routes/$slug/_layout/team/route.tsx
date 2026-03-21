import { Layout } from "@/components/shared/layout";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { organizationTeamQueryOptions } from "@/features/queries/organization";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { inviteOrganizationMemberFn } from "@/features/services/organization/invite-member";
import { useState } from "react";

export const Route = createFileRoute("/$slug/_layout/team")({
  component: RouteComponent,
  head: () => ({
    meta: [{ title: "Team", content: "Team" }, { name: "Team" }],
  }),
});

function RouteComponent() {
  const { session } = Route.useRouteContext();
  const { slug } = Route.useParams();
  const queryClient = useQueryClient();
  const { data } = useSuspenseQuery(organizationTeamQueryOptions(slug));
  const [email, setEmail] = useState("");

  if (!data?.success || !data.organization) {
    return <Navigate to="/dashboard" />;
  }

  const canInvite =
    data.currentMemberRole === "owner" || data.currentMemberRole === "admin";

  const inviteMutation = useMutation({
    mutationFn: (emailToInvite: string) =>
      inviteOrganizationMemberFn({ data: { slug, email: emailToInvite } }),
    onSuccess: (result) => {
      if (!result?.success) {
        toast.error(result?.error || "Failed to send invitation.");
        return;
      }
      toast.success("Invitation sent.");
      setEmail("");
      queryClient.invalidateQueries({
        queryKey: organizationTeamQueryOptions(slug).queryKey,
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send invitation.");
    },
  });

  const handleInviteSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter an email address.");
      return;
    }
    inviteMutation.mutate(email.trim());
  };

  return (
    <Layout
      title="Team"
      primaryButton={
        <Button asChild variant="outline">
          <a href="#invite">
            <UserPlus className="size-4" />
            Invite member
          </a>
        </Button>
      }
    >
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Team overview
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-3">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-semibold">
                Members
              </p>
              <p className="text-3xl font-semibold">{data.members.length}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-semibold">
                Pending invites
              </p>
              <p className="text-3xl font-semibold">
                {data.invitations.length}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-semibold">
                Your access
              </p>
              <Badge variant="outline" className="capitalize">
                {data.currentMemberRole || "member"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <CardTitle className="text-lg font-semibold">Members</CardTitle>
              <Badge variant="outline">{data.members.length} total</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.members.map((member) => (
              <div
                key={member.id}
                className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-4 last:border-b-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarImage src={member.user.image || undefined} />
                    <AvatarFallback>
                      {(member.user.name || member.user.email || "?")
                        .charAt(0)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">
                      {member.user.name || member.user.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {member.user.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {member.userId === session.user.id && (
                    <Badge variant="secondary">You</Badge>
                  )}
                  <Badge variant="outline" className="capitalize">
                    {member.role}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card id="invite">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Invite teammates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <form
              onSubmit={handleInviteSubmit}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <Input
                type="email"
                placeholder="teammate@company.com"
                value={email}
                disabled={!canInvite || inviteMutation.isPending}
                onChange={(event) => setEmail(event.target.value)}
              />
              <Button
                type="submit"
                disabled={!canInvite || inviteMutation.isPending}
              >
                {inviteMutation.isPending ? "Sending..." : "Send invite"}
              </Button>
            </form>
            {!canInvite && (
              <p className="text-sm text-muted-foreground">
                You do not have permission to invite new members.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <CardTitle className="text-lg font-semibold">
                Pending invitations
              </CardTitle>
              <Badge variant="outline">{data.invitations.length} pending</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.invitations.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No pending invitations.
              </p>
            ) : (
              data.invitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-4 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-md border border-border/60 p-2">
                      <Mail className="size-4" />
                    </div>
                    <div>
                      <p className="font-semibold">{invitation.email}</p>
                      <p className="text-sm text-muted-foreground">
                        Expires{" "}
                        {new Date(invitation.expiresAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {invitation.role || "member"}
                    </Badge>
                    <Badge variant="secondary" className="capitalize">
                      {invitation.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
