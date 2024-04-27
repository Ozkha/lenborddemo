import { checkAuth } from "@/lib/actions/checkauth";
import BoardPage from "./clientpage";

export default async function BooardPageSuspensed() {
  const user = await checkAuth();
  return (
    <>
      <BoardPage user={user}></BoardPage>
    </>
  );
}
