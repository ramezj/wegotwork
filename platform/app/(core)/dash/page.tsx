import { TestAction } from "@/actions/test";
import { DashboardContent } from "./dashboard-content";
import { getServerSession } from "@/hooks/get-server-session";

export default async function Page() {
  const session = await getServerSession();
  const data = await TestAction();
  return (
    <>
      <DashboardContent data={data} />
    </>
  );
}
