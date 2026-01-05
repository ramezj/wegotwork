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
    </>
  );
}
