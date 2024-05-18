import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function BoardsPage({
  user,
  boardlist,
}: {
  user: any;
  boardlist: { name: string; id: number }[];
}) {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div>
        {user.id} - {user.name}
      </div>
      <p className="w-fit rounded-none border-0 bg-transparent scroll-m-20 text-2xl font-semibold tracking-tight">
        Tableros (4)
      </p>
      <div className="grid gap-4 md:grid-cols-2 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
        {boardlist.map((board) => (
          <Card key={"area-" + board.name} className="p-2">
            <CardHeader className="pb-0"></CardHeader>
            <CardContent>
              <Button className="text-md" variant={"ghost"} asChild>
                <Link href={"/app/board?board=" + board.id}>
                  {board.name}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
