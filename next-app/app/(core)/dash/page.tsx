import { useUser } from "@/lib/use-user";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await useUser();
  if (!session) {
    redirect("/");
  }
  return (
    <>
      <p>Hello from /dash</p>
      Current Active Organization ID : {session.session.activeOrganizationId}
    </>
  );
}
