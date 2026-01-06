import { getCurrentOrganizationAction } from "@/actions/organization/get-current-organization";
import { useUser } from "@/lib/use-user";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await useUser();
  if (!session) {
    redirect("/");
  }
  if (session.session.activeOrganizationId === null) {
    redirect("/dashboard");
  }
  const organization = await getCurrentOrganizationAction(
    session.session.activeOrganizationId!
  );
  return (
    <>
      <p>Hello from /dash</p>
      <p>{organization?.name}</p>
      <p>{organization?.slug}</p>
    </>
  );
}
