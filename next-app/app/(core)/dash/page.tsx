import { Metadata } from "next";
import { getServerSession } from "@/lib/get-server-session";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard",
};

export default async function Page() {
  const session = await getServerSession();
  return (
    <>
      <p>Hello from /dash</p>
      <p>{session?.user?.email}</p>
    </>
  );
}
