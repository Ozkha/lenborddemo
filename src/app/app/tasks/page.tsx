import { checkAuth } from "@/lib/actions/checkauth";
import TasksPage from "./clientpage";

export default async function BooardPageSuspensed() {
  const user = await checkAuth();
  return (
    <>
      <TasksPage user={user}></TasksPage>
    </>
  );
}
