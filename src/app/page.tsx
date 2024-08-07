import Button from "@/components/ui/Button";
import { db } from "@/libs/db";

export default async function Home() {
  // await db.set('hello', 'hello')
  return (
    <main className="flex min-h-screen">
      <Button>Button</Button>
    </main>
  );
}
