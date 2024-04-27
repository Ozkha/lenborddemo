import AreaPage from "./clientpage";
import { checkAuth } from "@/lib/actions/checkauth";

export default async function AreaPageSuspended() {
  const user = await checkAuth();
  return (
    <>
      <AreaPage user={user}></AreaPage>
    </>
  );
}
