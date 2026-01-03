import { TestAction } from "@/actions/test";
import { DashboardContent } from "./dashboard-content";
// import { getServerSession } from "@/hooks/get-server-session";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard",
};

export default async function Page() {
  // const session = await getServerSession();
  const data = await TestAction();
  return (
    <>
      <p>hello world!</p>
    </>
  );
}
