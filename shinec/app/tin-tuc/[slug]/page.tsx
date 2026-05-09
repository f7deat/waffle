import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/app/components/site/SiteFooter";
import { SiteHeader } from "@/app/components/site/SiteHeader";
import { getPublishedArticles, getArticleBySlug } from "@/app/services/article.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

type NewsDetailProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const items = await getPublishedArticles({ current: 1, pageSize: 20, locale: "vi-VN" }).catch(() => []);
  return items.filter((item) => item.slug).map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: NewsDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug).catch(() => null);

  if (!article) {
    return {
      title: "Không tìm thấy tin tức",
      description: "Tin tức bạn đang tìm không tồn tại.",
    };
  }

  return {
    title: `${article.title} | Tin tức Shinec Gia Lai`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.publishedAt,
      locale: "vi_VN",
    },
  };
}

export default async function NewsDetailPage({ params }: NewsDetailProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug).catch(() => null);

  if (!article) {
    notFound();
  }

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    datePublished: article.publishedAt,
    author: {
      "@type": "Organization",
      name: "Công ty Cổ phần Shinec Gia Lai",
    },
    publisher: {
      "@type": "Organization",
      name: "Công ty Cổ phần Shinec Gia Lai",
    },
    description: article.excerpt,
  };

  return (
    <div className="bg-[var(--bg-soft)] text-[var(--text-strong)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <SiteHeader currentPage="news" />

      <main className="mx-auto w-full max-w-4xl px-4 pb-20 pt-28 sm:px-6 sm:pt-32">
        <article
          className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-[0_14px_30px_rgba(0,107,29,0.08)] sm:p-8"
          data-animate="reveal"
        >
          <div className="mb-5 overflow-hidden rounded-xl border border-[var(--line)]">
            <img
              src={article.image}
              alt={article.title}
              width={960}
              height={620}
              className="h-56 w-full object-cover"
            />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent)]">Tin tức</p>
          <h1 className="mt-3 text-3xl font-black leading-tight text-[var(--primary-deep)] sm:text-4xl">
            {article.title}
          </h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">Ngày đăng: {article.publishedAt}</p>

          <div className="mt-6 space-y-5 text-sm leading-8 text-[var(--text-muted)] sm:text-base">
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            </div>
          </div>

          <div className="mt-8">
            <Link
              href="/tin-tuc"
              className="inline-flex items-center gap-2 text-sm font-bold text-[var(--accent-deep)] hover:underline"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="h-3.5 w-3.5" />
              Quay lại danh sách tin tức
            </Link>
          </div>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
