import { checkAuth } from "@/lib/actions/checkauth";
import UsersPage from "./clientpage";

export default async function BooardPageSuspensed() {
  const user = await checkAuth();
  return (
    <>
      <UsersPage user={user}></UsersPage>
    </>
  );
}
