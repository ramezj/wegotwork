import { TestAction } from "@/actions/test";
import { DashboardContent } from "./dashboard-content";
export default async function Page() {
  const data = await TestAction();
  return (
    <>
      <DashboardContent data={data} />
    </>
  );
}
