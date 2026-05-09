import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SiteFooter } from "@/app/components/site/SiteFooter";
import { SiteHeader } from "@/app/components/site/SiteHeader";
import { newsItems } from "@/app/data/site-content";
import { getPublishedArticles } from "@/app/services/article.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

export const metadata: Metadata = {
  title: "Tin tức đầu tư | Cụm công nghiệp số 2 Đak Đoa",
  description:
    "Tin tức cập nhật về định hướng ESG, hạ tầng kỹ thuật, và cơ hội đầu tư tại Cụm công nghiệp số 2 Đak Đoa - Shinec Gia Lai.",
};

export default async function NewsPage() {
  const items = await getPublishedArticles({ current: 1, pageSize: 12, locale: "vi-VN" })
    .then((data) => {
      if (!data.length) {
        return newsItems;
      }

      return data.map((item, index) => ({
        slug: item.slug || newsItems[index]?.slug || "tin-tuc",
        title: item.title || newsItems[index]?.title || "Tin tức",
        excerpt: item.excerpt || newsItems[index]?.excerpt || "",
        category: newsItems[index]?.category || "Tin tức",
        publishedAt: item.publishedAt || newsItems[index]?.publishedAt || "",
        image: item.image || newsItems[index]?.image || "/images/news-esg.svg",
      }));
    })
    .catch(() => newsItems);

  return (
    <div className="bg-[var(--bg-soft)] text-[var(--text-strong)]">
      <SiteHeader currentPage="news" />
      <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-28 sm:px-6 sm:pt-32">
        <header data-animate="reveal">
          <p className="eyebrow">Trang tin tức</p>
          <h1 className="mt-2 text-3xl font-black text-[var(--primary-deep)] sm:text-4xl">
            Cập nhật hoạt động và định hướng phát triển
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--text-muted)] sm:text-base">
            Tổng hợp các thông tin nổi bật về mô hình cụm công nghiệp sinh thái, chuỗi kinh tế tuần hoàn và hạ tầng đầu tư tại Cụm công nghiệp số 2 Đak Đoa.
          </p>
        </header>

        <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item, index) => (
            <article
              key={item.slug}
              className="news-card"
              style={{ animationDelay: `${index * 70}ms` }}
              data-animate="reveal"
            >
              <div className="overflow-hidden rounded-xl border border-[var(--line)]">
                <img
                  src={item.image}
                  alt={item.title}
                  width={960}
                  height={620}
                  className="h-48 w-full object-cover"
                />
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent)]">{item.category}</p>
              <h2 className="mt-3 text-xl font-extrabold text-[var(--primary-deep)]">{item.title}</h2>
              <p className="mt-2 text-xs text-[var(--text-muted)]">{item.publishedAt}</p>
              <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">{item.excerpt}</p>
              <Link
                href={`/tin-tuc/${item.slug}`}
                className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[var(--accent-deep)] hover:underline"
              >
                Đọc chi tiết
                <FontAwesomeIcon icon={faArrowRight} className="h-3.5 w-3.5" />
              </Link>
            </article>
          ))}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
