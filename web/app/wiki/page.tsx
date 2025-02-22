import { apiWikiRandom } from "@/service/apps/wiki";
import Link from "next/link";

export default async function Page() {

  const response = await apiWikiRandom();

  return (
    <main>
    <div className="flex justify-end">
        <Link href="/" className="font-medium hover:text-blue-500 px-4 py-1">Home</Link>
    </div>
      <div className="container mx-auto p-4">
        <div>
          Today&apos;s random article:
        </div>
        <h1 className="text-2xl font-bold">
          <Link href={`/wiki/${response.query.random[0].title}`} className="hover:text-blue-500">
            {response.query.random[0].title}
          </Link>
        </h1>
      </div>
    </main>
  );
}