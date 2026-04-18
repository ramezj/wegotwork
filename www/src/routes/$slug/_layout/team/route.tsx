import { Layout } from "@/components/shared/layout";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { organizationTeamQueryOptions } from "@/features/queries/organization";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Copy, Mail, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { inviteOrganizationMemberFn } from "@/features/services/organization/invite-member";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/$slug/_layout/team")({
  component: RouteComponent,
  head: () => ({
    meta: [{ title: "Team", content: "Team" }, { name: "Team" }],
  }),
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(
      organizationTeamQueryOptions(params.slug),
    );
  },
});

function RouteComponent() {
  const { session } = Route.useRouteContext();
  const { slug } = Route.useParams();
  const queryClient = useQueryClient();
  const { data } = useSuspenseQuery(organizationTeamQueryOptions(slug));
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"member" | "admin">("member");

  if (!data?.success || !data.organization) {
    return <Navigate to="/dashboard" />;
  }

  const canInvite =
    data.currentMemberRole === "owner" || data.currentMemberRole === "admin";

  const inviteMutation = useMutation({
    mutationFn: ({
      emailToInvite,
      roleToInvite,
    }: {
      emailToInvite: string;
      roleToInvite: "member" | "admin";
    }) =>
      inviteOrganizationMemberFn({
        data: { slug, email: emailToInvite, role: roleToInvite },
      }),
    onSuccess: (result) => {
      if (!result?.success) {
        toast.error(result?.error || "Failed to send invitation.");
        return;
      }
      toast.success("Invitation sent.");
      setEmail("");
      setRole("member");
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
    inviteMutation.mutate({
      emailToInvite: email.trim(),
      roleToInvite: role,
    });
  };

  const copyInvitationLink = async (invitationId: string) => {
    const inviteUrl = `${window.location.origin}/invite/${invitationId}`;
    await navigator.clipboard.writeText(inviteUrl);
    toast.success("Invitation link copied.");
  };

  return (
    <Layout
      variant="header"
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
              <Badge
                variant="outline"
                className="h-8 rounded-md px-3 text-sm capitalize"
              >
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
                className="flex flex-col gap-3 border-b border-border/60 pb-4 last:border-b-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
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
                    <Badge
                      variant="secondary"
                      className="h-8 rounded-md px-3 text-sm capitalize"
                    >
                      You
                    </Badge>
                  )}
                  <Badge
                    variant="outline"
                    className="h-8 rounded-md px-3 text-sm capitalize"
                  >
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
                className="flex-1"
                disabled={!canInvite || inviteMutation.isPending}
                onChange={(event) => setEmail(event.target.value)}
              />
              <Select
                value={role}
                onValueChange={(value: "member" | "admin") => setRole(value)}
                disabled={!canInvite || inviteMutation.isPending}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
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
                  className="flex flex-col gap-2 border-b border-border/60 pb-4 last:border-b-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
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
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => copyInvitationLink(invitation.id)}
                    >
                      <Copy className="size-4" />
                      Copy link
                    </Button>
                    <Badge
                      variant="outline"
                      className="h-8 rounded-md px-3 text-sm capitalize"
                    >
                      {invitation.role || "member"}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="h-8 rounded-md px-3 text-sm capitalize"
                    >
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
