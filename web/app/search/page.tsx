import Link from "next/link";
import { apiArticleList } from "@/service/article";
import { apiProducts } from "@/service/shop/product";
import { apiPlaceList } from "@/service/locations/place";
import { apiTagList, apiTagRandoms } from "@/service/contents/tag";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = (searchParams?.q || "").trim();
  const qLower = q.toLowerCase();

  const [articlesRes, productsRes, placesRes, tagsRes, randomTagsRes] = await Promise.all([
    apiArticleList({ current: 1, pageSize: 50 }),
    apiProducts({ current: 1, pageSize: 50 }),
    apiPlaceList({ current: 1, pageSize: 50, keyword: q || undefined }),
    apiTagList({ current: 1, pageSize: 24, name: q || undefined }),
    !q ? apiTagRandoms() : Promise.resolve({ data: [] } as any),
  ]);

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
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm">
          <Link href="/" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
            Home
          </Link>
          <span className="text-slate-400">/</span>
          <span className="text-slate-600 dark:text-slate-400">Search</span>
        </nav>

        {/* Header */}
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Search</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Find articles, products, places, and tags.
          </p>
        </header>

        {/* Search form */}
        <form method="GET" action="/search" className="mb-10">
          <div className="flex items-center gap-3">
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Type keywords…"
              className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-blue-400 dark:focus:ring-blue-400/20"
            />
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              Search
            </button>
          </div>
        </form>

        {!q && (
          <section className="mb-10">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Trending Tags</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {randomTagsData.map((tag: any) => (
                <Link
                  key={tag.id || tag.name}
                  href={`/search?q=${encodeURIComponent(tag.name)}`}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-800/70"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Results */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Articles */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Articles</h2>
              <span className="text-sm text-slate-500 dark:text-slate-400">{articles.length} results</span>
            </div>
            {articles.length === 0 ? (
              <p className="text-slate-600 dark:text-slate-400">No articles found.</p>
            ) : (
              <ul className="space-y-2">
                {articles.slice(0, 10).map((item: any) => (
                  <li key={item.id}>
                    <Link
                      href={`/article/${item.normalizedName}`}
                      className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Products */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Products</h2>
              <span className="text-sm text-slate-500 dark:text-slate-400">{products.length} results</span>
            </div>
            {products.length === 0 ? (
              <p className="text-slate-600 dark:text-slate-400">No products found.</p>
            ) : (
              <ul className="space-y-2">
                {products.slice(0, 10).map((item: any) => (
                  <li key={item.id}>
                    <Link
                      href={`/shop/${item.normalizedName}`}
                      className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Places */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Places</h2>
              <span className="text-sm text-slate-500 dark:text-slate-400">{places.length} results</span>
            </div>
            {places.length === 0 ? (
              <p className="text-slate-600 dark:text-slate-400">No places found.</p>
            ) : (
              <ul className="space-y-2">
                {places.slice(0, 10).map((item: any) => (
                  <li key={item.id}>
                    <Link
                      href={`/place/${item.id}`}
                      className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Tags */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Tags</h2>
              <span className="text-sm text-slate-500 dark:text-slate-400">{tags.length} results</span>
            </div>
            {tags.length === 0 ? (
              <p className="text-slate-600 dark:text-slate-400">No tags found.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {tags.slice(0, 20).map((item: any) => (
                  <Link
                    key={item.id}
                    href={`/search?q=${encodeURIComponent(item.name)}`}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-800/70"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
