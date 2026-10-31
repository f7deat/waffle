/* eslint-disable @next/next/no-img-element */
import PageContainer from "@/components/layout/page-container";
import {
    apiArticleFeatured,
    apiArticleList,
    apiArticlePublishedCategories,
    apiArticleTopAuthors,
    apiArticleTrending,
} from "@/services/article";
import { ArticleListItem } from "@/services/typings/article";
import Link from "next/link";
import { cookies } from "next/headers";
import NewsletterForm from "./newsletter-form";

type SearchParams = Promise<{
    page?: string;
    pageSize?: string;
    keyword?: string;
    category?: string;
    sort?: string;
}>;

const DEFAULT_PAGE_SIZE = 6;
const SORT_OPTIONS = [
    { value: "latest", label: "Mới nhất" },
    { value: "most-viewed", label: "Đọc nhiều nhất" },
] as const;

const formatNumber = (value?: number) => {
    const n = value ?? 0;
    return n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k` : String(n);
};

const formatDate = (value?: string) => (value ? new Date(value).toLocaleDateString("vi-VN") : "");

const Avatar = ({ src, name, size }: { src?: string; name?: string; size: number }) =>
    src ? (
        <img src={src} alt={name ?? ""} className="rounded-full object-cover" style={{ width: size, height: size }} />
    ) : (
        <span
            className="flex items-center justify-center rounded-full bg-primary-fixed font-bold text-on-primary-fixed-variant"
            style={{ width: size, height: size }}
        >
            {(name ?? "?").charAt(0).toUpperCase()}
        </span>
    );

const HeroCard = ({ article, large }: { article: ArticleListItem; large?: boolean }) => (
    <article
        className={`group relative flex flex-col justify-end overflow-hidden rounded-3xl bg-on-surface shadow-md ${large ? "min-h-[460px] lg:col-span-8 md:min-h-[540px]" : "min-h-[240px] flex-1"}`}
    >
        {article.thumbnail && (
            <img
                src={article.thumbnail}
                alt={article.name}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-on-surface/95 via-on-surface/50 to-transparent" />
        <div className={`relative z-10 flex flex-col gap-2 text-white ${large ? "gap-3 p-6 md:p-8" : "p-5"}`}>
            <div className="flex flex-wrap items-center gap-2 text-xs">
                {article.categoryName && (
                    <span className="rounded-full bg-primary-container px-3 py-1 font-semibold text-on-primary">{article.categoryName}</span>
                )}
                <span className="rounded-full bg-white/20 px-2.5 py-1 backdrop-blur-md">{article.readingMinutes ?? 1} phút đọc</span>
            </div>
            <h2 className={`font-bold leading-tight ${large ? "text-2xl md:text-4xl" : "line-clamp-2 text-lg"}`}>
                <Link href={`/article/${article.normalizedName}`} className="text-white after:absolute after:inset-0">
                    {article.name}
                </Link>
            </h2>
            {large && article.description && <p className="line-clamp-2 max-w-3xl text-white/80 md:line-clamp-3">{article.description}</p>}
            <div className="flex items-center justify-between gap-4 pt-1 text-sm text-white/90">
                <div className="flex items-center gap-2">
                    <Avatar src={article.creatorAvatar} name={article.creatorName} size={large ? 36 : 24} />
                    <span className="font-semibold">{article.creatorName}</span>
                </div>
                <span>{formatNumber(article.viewCount)} lượt xem</span>
            </div>
        </div>
    </article>
);

const Page = async ({ searchParams }: { searchParams: SearchParams }) => {
    const cookieStore = await cookies();
    const cookie = cookieStore.toString();
    const params = await searchParams;

    const current = Math.max(1, Number(params.page) || 1);
    const pageSize = Math.max(1, Number(params.pageSize) || DEFAULT_PAGE_SIZE);
    const keyword = params.keyword?.trim();
    const categoryId = Number(params.category) || undefined;
    const sort = params.sort === "most-viewed" ? "most-viewed" : "latest";
    const isDefaultView = current === 1 && !keyword && !categoryId && sort === "latest";

    const [response, categoriesRes, trendingRes, authorsRes, featuredRes] = await Promise.all([
        apiArticleList({ current, pageSize, name: keyword, categoryId, sort }, cookie),
        apiArticlePublishedCategories(cookie),
        apiArticleTrending(cookie),
        apiArticleTopAuthors(cookie),
        isDefaultView ? apiArticleFeatured(cookie) : Promise.resolve(undefined),
    ]);

    const articles = response.data || [];
    const total = response.total ?? articles.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const categories = categoriesRes.data || [];
    const trending = trendingRes.data || [];
    const authors = authorsRes.data || [];
    const featured = featuredRes?.data || [];
    const allCount = categories.reduce((sum, c) => sum + c.count, 0);
    const from = total === 0 ? 0 : (current - 1) * pageSize + 1;
    const to = Math.min(total, current * pageSize);

    const buildHref = (overrides: Record<string, string | number | undefined>) => {
        const merged: Record<string, string | number | undefined> = {
            keyword,
            category: categoryId,
            sort: sort === "latest" ? undefined : sort,
            page: undefined,
            ...overrides,
        };
        const query = new URLSearchParams();
        Object.entries(merged).forEach(([key, value]) => {
            if (value !== undefined && value !== "" && !(key === "page" && value === 1)) query.set(key, String(value));
        });
        const qs = query.toString();
        return qs ? `/article?${qs}` : "/article";
    };

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
        (p) => p === 1 || p === totalPages || Math.abs(p - current) <= 1,
    );

    return (
        <PageContainer breadcrumbs={[{ label: "Tin tức & Cẩm nang", href: "/article" }]}>
            <div className="flex flex-col gap-8 py-4">
                <section className="flex flex-col gap-6">
                    <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
                        <div className="flex max-w-3xl flex-col gap-2">
                            <h1 className="text-3xl font-bold leading-tight tracking-tight text-on-surface md:text-5xl">
                                Tạp Chí Thổ Địa <span className="text-primary">&amp; Cẩm Nang</span>
                            </h1>
                            <p className="max-w-2xl text-on-surface-variant">
                                Những câu chuyện ẩm thực nguyên bản, kinh nghiệm xê dịch chân thực và góc nhìn văn hóa bản địa được kể bởi cộng đồng Thổ Địa &amp; Nhà sáng tạo nội dung.
                            </p>
                        </div>
                        {authors.length > 0 && (
                            <div className="flex items-center gap-3">
                                <div className="flex -space-x-2">
                                    {authors.map((a) => (
                                        <span key={a.id} className="rounded-full ring-2 ring-surface">
                                            <Avatar src={a.avatar} name={a.name} size={36} />
                                        </span>
                                    ))}
                                </div>
                                <div className="flex flex-col text-sm">
                                    <span className="font-bold text-on-surface">{authors.length}+ Cây bút</span>
                                    <span className="text-on-surface-variant">Đóng góp bài viết</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <form action="/article" method="get" className="flex flex-col items-center gap-3 rounded-2xl bg-white p-2 shadow-sm md:flex-row">
                        {categoryId && <input type="hidden" name="category" value={categoryId} />}
                        {sort !== "latest" && <input type="hidden" name="sort" value={sort} />}
                        <input
                            type="text"
                            name="keyword"
                            defaultValue={keyword}
                            placeholder="Tìm bài viết, cẩm nang du lịch, món ngon..."
                            className="w-full flex-1 rounded-xl bg-surface-container-low px-4 py-2.5 text-sm text-on-surface placeholder:text-outline"
                        />
                        <button type="submit" className="w-full rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition hover:opacity-90 md:w-auto">
                            Tìm kiếm
                        </button>
                    </form>
                </section>

                {featured.length > 0 && (
                    <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                        <HeroCard article={featured[0]} large />
                        {featured.length > 1 && (
                            <div className="flex flex-col justify-between gap-4 lg:col-span-4">
                                {featured.slice(1).map((a) => (
                                    <HeroCard key={a.id} article={a} />
                                ))}
                            </div>
                        )}
                    </section>
                )}

                <div className="flex flex-col items-stretch justify-between gap-3 rounded-2xl bg-surface-container-low p-2 md:flex-row md:items-center">
                    <div className="flex items-center gap-2 overflow-x-auto">
                        <Link
                            href={buildHref({ category: undefined })}
                            className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold ${!categoryId ? "bg-secondary text-white shadow-sm" : "bg-white text-on-surface hover:bg-surface-container-high"}`}
                        >
                            Tất cả bài viết <span className="text-xs opacity-80">{allCount}</span>
                        </Link>
                        {categories.map((c) => (
                            <Link
                                key={c.id}
                                href={buildHref({ category: c.id })}
                                className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold ${categoryId === c.id ? "bg-secondary text-white shadow-sm" : "bg-white text-on-surface hover:bg-surface-container-high"}`}
                            >
                                {c.name} <span className="text-xs opacity-70">{c.count}</span>
                            </Link>
                        ))}
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-2 self-end md:self-auto">
                        <span className="hidden text-xs text-on-surface-variant xl:inline">Sắp xếp:</span>
                        {SORT_OPTIONS.map((o) => (
                            <Link
                                key={o.value}
                                href={buildHref({ sort: o.value === "latest" ? undefined : o.value })}
                                className={`rounded-full px-3 py-1.5 text-sm font-semibold ${sort === o.value ? "bg-primary text-white" : "bg-white text-on-surface hover:bg-surface-container-high"}`}
                            >
                                {o.label}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
                    <div className="flex flex-col gap-6 lg:col-span-8">
                        {keyword && (
                            <div className="text-sm text-on-surface-variant">
                                Kết quả cho <span className="font-semibold text-on-surface">{keyword}</span>
                            </div>
                        )}
                        {articles.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-outline-variant bg-white p-10 text-center text-on-surface-variant">
                                <div className="mb-3 text-4xl">📰</div>
                                <p className="font-semibold text-on-surface">Chưa có bài viết nào phù hợp.</p>
                                <p className="mt-1 text-sm">Thử tìm với từ khóa khác hoặc quay lại sau.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {articles.map((article) => (
                                    <article key={article.id} className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:shadow-md">
                                        <div className="relative h-52 overflow-hidden bg-surface-container">
                                            {article.thumbnail && (
                                                <img
                                                    src={article.thumbnail}
                                                    alt={article.name}
                                                    loading="lazy"
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            )}
                                            {article.categoryName && (
                                                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-secondary shadow-sm backdrop-blur-md">
                                                    {article.categoryName}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex flex-1 flex-col justify-between gap-3 p-4">
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                                                    <span>{article.readingMinutes ?? 1} phút đọc</span>
                                                    <span>•</span>
                                                    <span>{formatDate(article.publishedAt ?? article.createdDate)}</span>
                                                </div>
                                                <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-on-surface transition-colors group-hover:text-primary">
                                                    <Link href={`/article/${article.normalizedName}`} className="text-inherit">
                                                        {article.name}
                                                    </Link>
                                                </h3>
                                                <p className="line-clamp-2 text-sm text-on-surface-variant">{article.description}</p>
                                            </div>
                                            <div className="-mx-4 -mb-4 flex items-center justify-between bg-surface-container-low/40 px-4 py-2.5 text-xs text-on-surface-variant">
                                                <div className="flex items-center gap-2">
                                                    <Avatar src={article.creatorAvatar} name={article.creatorName} size={24} />
                                                    <span className="font-medium text-on-surface">{article.creatorName}</span>
                                                </div>
                                                <span>{formatNumber(article.viewCount)} lượt xem</span>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}

                        {totalPages > 1 && (
                            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                                <span className="text-sm text-on-surface-variant">
                                    Hiển thị <span className="font-semibold text-on-surface">{from} - {to}</span> trong <span className="font-semibold text-on-surface">{total}</span> bài viết
                                </span>
                                <div className="flex items-center gap-1.5">
                                    {current > 1 && (
                                        <Link href={buildHref({ page: current - 1 })} className="rounded-full bg-white px-3.5 py-1.5 text-sm text-on-surface shadow-sm hover:bg-surface-container-high">
                                            Trước
                                        </Link>
                                    )}
                                    {pageNumbers.map((p, i) => (
                                        <span key={p} className="flex items-center gap-1.5">
                                            {i > 0 && p - pageNumbers[i - 1] > 1 && <span className="px-1 font-bold text-on-surface-variant">...</span>}
                                            <Link
                                                href={buildHref({ page: p })}
                                                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm ${p === current ? "bg-primary font-bold text-white shadow-sm" : "bg-white text-on-surface hover:bg-surface-container-high"}`}
                                            >
                                                {p}
                                            </Link>
                                        </span>
                                    ))}
                                    {current < totalPages && (
                                        <Link href={buildHref({ page: current + 1 })} className="rounded-full bg-white px-3.5 py-1.5 text-sm text-on-surface shadow-sm hover:bg-primary-container hover:text-white">
                                            Trang sau
                                        </Link>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <aside className="flex flex-col gap-6 lg:sticky lg:top-32 lg:col-span-4">
                        {authors.length > 0 && (
                            <div className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm">
                                <h4 className="text-lg font-semibold text-on-surface">Cây Bút Tiêu Biểu</h4>
                                {authors.map((a, i) => (
                                    <div key={a.id} className="flex items-center gap-3 rounded-xl p-2 hover:bg-surface-container-low">
                                        <div className="relative">
                                            <Avatar src={a.avatar} name={a.name} size={44} />
                                            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">{i + 1}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-on-surface">{a.name}</span>
                                            <span className="text-xs text-on-surface-variant">
                                                {a.userName ? `@${a.userName} • ` : ""}{a.articleCount} bài
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {trending.length > 0 && (
                            <div className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-lg font-semibold text-on-surface">Đọc Nhiều Nhất</h4>
                                    <span className="text-xs font-bold text-primary">TOP {trending.length}</span>
                                </div>
                                {trending.map((a, i) => (
                                    <Link key={a.id} href={`/article/${a.normalizedName}`} className="group flex items-start gap-3">
                                        <span className={`w-7 text-center text-2xl font-bold leading-none transition-colors group-hover:text-primary ${i === 0 ? "text-primary/40" : "text-outline-variant"}`}>
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                        <div className="flex flex-col gap-1">
                                            <h5 className="line-clamp-2 text-sm font-semibold text-on-surface transition-colors group-hover:text-primary">{a.name}</h5>
                                            <span className="text-xs text-on-surface-variant">{formatNumber(a.viewCount)} lượt đọc</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}

                        <div className="flex flex-col gap-3 rounded-2xl bg-surface-container p-5">
                            <h4 className="text-lg font-semibold text-on-surface">Bản Tin Sáng Thứ Bảy</h4>
                            <p className="text-sm text-on-surface-variant">
                                Nhận 3 bài viết chọn lọc sâu sắc nhất và 1 địa điểm bí mật mỗi 7h sáng thứ 7. Không spam quảng cáo.
                            </p>
                            <NewsletterForm />
                        </div>
                    </aside>
                </div>
            </div>
        </PageContainer>
    );
};

export default Page;
