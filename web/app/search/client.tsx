"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { SearchOutlined } from "@ant-design/icons";

interface SearchClientProps {
  q: string;
  articles: any[];
  products: any[];
  places: any[];
  tags: any[];
  randomTagsData: any[];
}

export default function SearchClient({
  q,
  articles,
  products,
  places,
  tags,
  randomTagsData,
}: SearchClientProps) {
  const headerRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const trendingRef = useRef<HTMLElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate header
      gsap.from(headerRef.current, {
        y: -30,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      });

      // Animate form
      gsap.from(formRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        delay: 0.2,
        ease: "power3.out",
      });

      // Animate trending tags
      if (trendingRef.current) {
        gsap.from(trendingRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.6,
          delay: 0.3,
          ease: "power3.out",
        });
      }

      // Animate result sections
      gsap.from(".result-section", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        delay: 0.4,
        ease: "power3.out",
      });
    });

    return () => ctx.revert();
  }, [q]);

  return (
    <>
      <header ref={headerRef} className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Search</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Find articles, products, places, and tags.
        </p>
      </header>

      {/* Search form */}
      <form ref={formRef} method="GET" action="/search" className="mb-10">
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
            <SearchOutlined /> Tìm kiếm
          </button>
        </div>
      </form>

      {!q && (
        <section ref={trendingRef} className="mb-10">
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
      <div ref={resultsRef} className="grid gap-8 md:grid-cols-2">
        {/* Articles */}
        <section className="result-section rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
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
        <section className="result-section rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
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
        <section className="result-section rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
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
        <section className="result-section rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
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
    </>
  );
}
