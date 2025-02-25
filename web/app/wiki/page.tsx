import PageContainer from "@/components/layout/page-container";
import { apiWikiRandom } from "@/service/apps/wiki";
import Link from "next/link";

export default async function Page() {

  const response = await apiWikiRandom();

  return (
    <PageContainer title="Wiki">
      <div className="p-4">
        <div>
          Today&apos;s random article:
        </div>
        <h1 className="text-2xl font-bold">
          <Link href={`/wiki/${response.query.random[0].title}`} className="hover:text-blue-500">
            {response.query.random[0].title}
          </Link>
        </h1>
      </div>
    </PageContainer>
  );
}