import Link from "next/link";
import { apiArticleList } from "@/services/article";
import { apiProducts } from "@/services/shop/product";
import { apiPlaceList } from "@/services/locations/place";
import { apiTagList, apiTagRandoms } from "@/services/contents/tag";
import SearchClient from "./client";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const q = (params?.q || "").trim();
  const qLower = q.toLowerCase();

  const articlesRes = await apiArticleList({ current: 1, pageSize: 10, name: q });
  const productsRes = await apiProducts({ current: 1, pageSize: 10, name: q });
  const placesRes = await apiPlaceList({ current: 1, pageSize: 10, name: q });
  const tagsRes = await apiTagList({ current: 1, pageSize: 24, name: q });
  const randomTagsRes = !q ? await apiTagRandoms() : { data: [] } as any;

  const articles = (articlesRes?.data || []).filter((a) =>
    q ? a.name.toLowerCase().includes(qLower) : true
  );
  const products = (productsRes?.data || []).filter((p) =>
    q ? p.name.toLowerCase().includes(qLower) : true
  );
  const places = placesRes?.data || [];
  const tags = tagsRes?.data || [];
  const randomTagsData = Array.isArray(randomTagsRes?.data)
    ? (randomTagsRes?.data as any[])
    : randomTagsRes?.data
    ? [randomTagsRes.data]
    : [];

  return (
    <main className="bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <nav className="mb-8 flex items-center gap-2 text-sm">
          <Link href="/" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
            Home
          </Link>
          <span className="text-slate-400">/</span>
          <span className="text-slate-600 dark:text-slate-400">Search</span>
        </nav>

        <SearchClient
          q={q}
          articles={articles}
          products={products}
          places={places}
          tags={tags}
          randomTagsData={randomTagsData}
        />
      </div>
    </main>
  );
}
