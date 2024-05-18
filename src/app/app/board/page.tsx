import BoardPage from "./clientpage";

export default async function BooardPageSuspensed() {
  return (
    <>
      <BoardPage user={user}></BoardPage>
    </>
  );
}
