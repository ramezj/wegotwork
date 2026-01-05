import { useUser } from "@/lib/use-user";
import { redirect } from "next/navigation";
import CreateOrganizationForm from "../_components/create-organization-form";

export default async function Page() {
  const session = await useUser();
  if (!session) {
    return redirect("/");
  }

  return (
    <main className="flex items-center justify-center h-screen">
      <CreateOrganizationForm />
    </main>
  );
}
