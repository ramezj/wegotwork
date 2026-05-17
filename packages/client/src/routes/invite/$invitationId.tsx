import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/features/auth/auth-client";
import { getSession } from "@/features/auth/server-session";
import { acceptOrganizationInvitationFn } from "@/features/services/organization/accept-invitation";
import { getInvitationByIdFn } from "@/features/services/organization/get-invitation-by-id";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { Mail, UserPlus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/invite/$invitationId")({
  beforeLoad: async ({ params }) => {
    const session = await getSession();
    const invitationResult = await getInvitationByIdFn({
      data: { invitationId: params.invitationId },
    });

    if (!invitationResult.success || !invitationResult.invitation) {
      throw redirect({ to: "/" });
    }

    return {
      session,
      invitation: invitationResult.invitation,
    };
  },
  component: RouteComponent,
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.invitation
          ? `Join ${loaderData.invitation.organization.name}`
          : "Invitation",
      },
    ],
  }),
});

function RouteComponent() {
  const navigate = useNavigate();
  const { invitationId } = Route.useParams();
  const { session, invitation } = Route.useRouteContext();

  const acceptMutation = useMutation({
    mutationFn: () =>
      acceptOrganizationInvitationFn({
        data: { invitationId },
      }),
    onSuccess: async (result) => {
      if (!result.success) {
        toast.error(result.error || "Failed to accept invitation.");
        return;
      }

      toast.success("Invitation accepted.");
      await navigate({
        to: "/$slug",
        params: { slug: result.organizationSlug },
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to accept invitation.");
    },
  });

  const invitedEmail = invitation.email.toLowerCase();
  const signedInEmail = session?.user?.email?.toLowerCase() || null;
  const needsSignIn = !session?.user;
  const wrongAccount = !!signedInEmail && signedInEmail !== invitedEmail;
  const isUnavailable = invitation.status !== "pending" || invitation.isExpired;

  const handleSignIn = () => {
    authClient.signIn.social({
      provider: "google",
      callbackURL: `/invite/${invitationId}`,
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-3">
          <div className="bg-branding/10 text-branding flex size-12 items-center justify-center rounded-md">
            <UserPlus className="size-5" />
          </div>
          <CardTitle className="text-2xl font-semibold">
            Join {invitation.organization.name}
          </CardTitle>
          <div className="text-muted-foreground space-y-1 text-sm">
            <p>
              You were invited to join <strong>{invitation.organization.name}</strong> as{" "}
              <strong className="capitalize">{invitation.role}</strong>.
            </p>
            <div className="flex items-center gap-2">
              <Mail className="size-4" />
              <span>{invitation.email}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isUnavailable ? (
            <div className="space-y-3">
              <p className="text-sm">
                {invitation.isExpired
                  ? "This invitation has expired."
                  : "This invitation is no longer available."}
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/">Go Home</Link>
              </Button>
            </div>
          ) : needsSignIn ? (
            <div className="space-y-3">
              <p className="text-sm">
                Sign in with <strong>{invitation.email}</strong> to accept this invitation.
              </p>
              <Button variant="branding" className="w-full" onClick={handleSignIn}>
                Continue with Google
              </Button>
            </div>
          ) : wrongAccount ? (
            <div className="space-y-3">
              <p className="text-sm">
                You are signed in as <strong>{session.user.email}</strong>, but this invite was
                sent to <strong>{invitation.email}</strong>.
              </p>
              <Button variant="branding" className="w-full" onClick={handleSignIn}>
                Sign in with the invited email
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm">
                You are signed in as <strong>{session.user.email}</strong>. Ready to join?
              </p>
              <Button
                variant="branding"
                className="w-full"
                onClick={() => acceptMutation.mutate()}
                disabled={acceptMutation.isPending}
              >
                {acceptMutation.isPending ? "Accepting..." : "Accept invitation"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
