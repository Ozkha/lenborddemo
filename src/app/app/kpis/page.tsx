import { checkAuth } from "@/lib/actions/checkauth";
import KpisPage from "./clientpage";

export default async function BooardPageSuspensed() {
  const user = await checkAuth();
  return (
    <>
      <KpisPage user={user}></KpisPage>
    </>
  );
}
