/* eslint-disable @next/next/no-img-element */
import PageContainer from "@/components/layout/page-container";
import ArticleActions from "@/components/article/actions";
import ArticleComments from "@/components/article/comments";
import ArticleNewsletterSignup from "@/components/article/newsletter-signup";
import ReadingProgress from "@/components/article/reading-progress";
import { apiArticleDetail, apiArticleMeta, apiArticleRandoms } from "@/services/article";
import { ArticleDetail, ArticleEditorialStop } from "@/services/typings/article";
import {
    EditorJSBlock,
    EditorJSCodeData,
    EditorJSHeaderData,
    EditorJSImageData,
    EditorJSListData,
    EditorJSParagraphData,
    EditorJSQuoteData,
} from "@/services/typings/editorjs";
import { faCalendar, faClock, faEye, faLocationDot, faMap, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import sanitizeHtml from "sanitize-html";
import { Metadata } from "next";
import Link from "next/link";

type Params = Promise<{ id: string }>;

const cleanHtml = (value?: string) => sanitizeHtml(value || "");
const plainText = (value?: string) => (value || "").replace(/<[^>]*>/g, "").trim();
const sectionId = (index: number) => `article-section-${index}`;
const safeExternalUrl = (value?: string) => {
    if (!value) return undefined;
    try {
        const url = new URL(value);
        return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : undefined;
    } catch {
        return undefined;
    }
};

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { id } = await params;
    try {
        const res = await apiArticleMeta(id);
        const article = res.data;
        if (!article) return {};
        return {
            title: `${article.title} - ${process.env.NEXT_PUBLIC_SITE_NAME}`,
            description: article.description,
            openGraph: {
                title: article.title,
                description: article.description,
                images: article.images,
            },
        };
    } catch {
        return {};
    }
}

const renderBlock = (block: EditorJSBlock, index: number) => {
    switch (block.type) {
        case "paragraph": {
            const data = block.data as EditorJSParagraphData;
            return <p key={block.id || index} className="mb-5 text-base leading-8 text-slate-700" dangerouslySetInnerHTML={{ __html: cleanHtml(data.text) }} />;
        }
        case "header": {
            const data = block.data as EditorJSHeaderData;
            const Heading = (`h${Math.min(Math.max(data.level, 2), 4)}`) as "h2" | "h3" | "h4";
            return (
                <Heading
                    key={block.id || index}
                    id={sectionId(index)}
                    className="scroll-mt-24 mb-4 mt-10 text-2xl font-bold tracking-tight text-slate-900 first:mt-0 md:text-3xl"
                    dangerouslySetInnerHTML={{ __html: cleanHtml(data.text) }}
                />
            );
        }
        case "list": {
            const data = block.data as EditorJSListData;
            const List = data.style === "ordered" ? "ol" : "ul";
            return (
                <List key={block.id || index} className={`mb-6 space-y-2 pl-6 text-base leading-7 text-slate-700 ${data.style === "ordered" ? "list-decimal" : "list-disc"}`}>
                    {data.items.map((item, itemIndex) => (
                        <li key={itemIndex}>
                            <span dangerouslySetInnerHTML={{ __html: cleanHtml(item.content) }} />
                            {!!item.items?.length && (
                                <ul className="mt-2 list-disc space-y-1 pl-6">
                                    {item.items.map((nested, nestedIndex) => (
                                        <li key={nestedIndex} dangerouslySetInnerHTML={{ __html: cleanHtml(nested.content) }} />
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </List>
            );
        }
        case "image": {
            const data = block.data as EditorJSImageData;
            if (!data.file?.url) return null;
            return (
                <figure key={block.id || index} className="my-8">
                    <img src={data.file.url} alt={data.caption || "Ảnh trong bài viết"} className="max-h-[620px] w-full rounded-2xl object-cover shadow-sm" />
                    {data.caption && <figcaption className="mt-3 text-center text-sm italic text-slate-500">{data.caption}</figcaption>}
                </figure>
            );
        }
        case "quote": {
            const data = block.data as EditorJSQuoteData;
            return (
                <figure key={block.id || index} className="my-8 rounded-2xl border-l-4 border-amber-500 bg-amber-50 px-6 py-5">
                    <blockquote className="text-lg italic leading-8 text-slate-800" dangerouslySetInnerHTML={{ __html: cleanHtml(data.text) }} />
                    {data.caption && <figcaption className="mt-3 font-semibold text-amber-800">{data.caption}</figcaption>}
                </figure>
            );
        }
        case "code": {
            const data = block.data as EditorJSCodeData;
            return <pre key={block.id || index} className="my-6 overflow-x-auto rounded-xl bg-slate-900 p-5 text-sm text-slate-100"><code>{data.code}</code></pre>;
        }
        case "delimiter":
            return <hr key={block.id || index} className="my-8 border-slate-200" />;
        default:
            return null;
    }
};

const RouteStopCard = ({ stop, index }: { stop: ArticleEditorialStop; index: number }) => {
    const mapsUrl = safeExternalUrl(stop.mapsUrl);
    return (
        <article className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="flex flex-col sm:flex-row">
                {stop.imageUrl && <img src={stop.imageUrl} alt={stop.name} className="h-48 w-full object-cover sm:h-auto sm:w-48" />}
                <div className="flex min-w-0 flex-1 flex-col justify-between p-4">
                    <div>
                        <div className="flex items-start gap-3">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-800">{index + 1}</span>
                            <h3 className="font-bold text-slate-900">{stop.name}</h3>
                        </div>
                        {stop.address && <p className="mt-3 text-sm text-slate-600"><FontAwesomeIcon icon={faLocationDot} className="mr-2 text-amber-600" />{stop.address}</p>}
                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-600">
                            {stop.priceRange && <span>{stop.priceRange}</span>}
                            {stop.openingHours && <span>{stop.openingHours}</span>}
                        </div>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        {stop.voucher && <span className="rounded bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700">Ưu đãi: {stop.voucher}</span>}
                        {mapsUrl && <a href={mapsUrl} target="_blank" rel="noreferrer" className="rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600">Chỉ đường Maps</a>}
                    </div>
                </div>
            </div>
        </article>
    );
};

const Page = async ({ params }: { params: Params }) => {
    const { id } = await params;
    const [articleResponse, randomsResponse] = await Promise.all([apiArticleDetail(id), apiArticleRandoms()]);
    const article = articleResponse.data as ArticleDetail | undefined;
    const randomArticles = randomsResponse.data || [];

    if (!article) {
        return (
            <PageContainer breadcrumbs={[{ label: "Bài viết", href: "/article" }]}>
                <div className="rounded-2xl bg-white px-6 py-16 text-center text-slate-600 shadow-sm">Không tìm thấy bài viết.</div>
            </PageContainer>
        );
    }

    const editorial = article.editorial;
    const blocks = article.content?.blocks || [];
    const headings = blocks.flatMap((block, index) => {
        if (block.type !== "header") return [];
        const data = block.data as EditorJSHeaderData;
        const label = plainText(data.text);
        return label ? [{ id: sectionId(index), label }] : [];
    });
    const authorName = editorial?.authorName || article.creatorName || "Ban biên tập";
    const authorAvatar = editorial?.authorAvatar || article.creatorAvatar;
    const publishedDate = article.publishedAt || article.modifiedDate || article.createdDate;
    const readingMinutes = editorial?.readingMinutes || article.readingMinutes || 1;
    const routeMapUrl = safeExternalUrl(editorial?.routeMapUrl);
    const routeDownloadUrl = safeExternalUrl(editorial?.routeDownloadUrl);

    return (
        <PageContainer breadcrumbs={[
            { label: "Bài viết", href: "/article" },
            ...(article.categoryName ? [{ label: article.categoryName, href: "/article" }] : []),
            { label: article.name, href: "#" },
        ]}>
            <ReadingProgress />
            <div className="mx-auto max-w-7xl">
                <header className="rounded-2xl bg-white px-5 py-7 shadow-sm md:px-10 md:py-9">
                    <div className="flex flex-wrap items-center gap-2">
                        {editorial?.spotlightLabel && <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-900">{editorial.spotlightLabel}</span>}
                        {article.categoryName && <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">{article.categoryName}</span>}
                        {article.isFeatured && <span className="rounded-full bg-rose-50 px-3 py-1 text-sm font-semibold text-rose-700">Tiêu điểm</span>}
                    </div>
                    <div className="mt-5 max-w-4xl">
                        <h1 className="text-3xl font-black leading-tight tracking-tight text-slate-950 md:text-5xl">{article.name}</h1>
                        {article.description && <p className="mt-5 text-lg leading-8 text-slate-600 md:text-xl">{article.description}</p>}
                    </div>
                    <div className="mt-7 flex flex-col justify-between gap-5 border-t border-slate-100 pt-5 lg:flex-row lg:items-center">
                        <div className="flex items-center gap-4">
                            {authorAvatar ? (
                                <img src={authorAvatar} alt={authorName} className="h-14 w-14 rounded-full object-cover ring-2 ring-amber-100" />
                            ) : (
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-xl font-bold text-amber-800">{authorName.slice(0, 1)}</div>
                            )}
                            <div>
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                    <span className="font-bold text-slate-900">{authorName}</span>
                                    {editorial?.authorHandle && <span className="text-sm text-slate-500">{editorial.authorHandle}</span>}
                                </div>
                                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
                                    {editorial?.authorTitle && <span>{editorial.authorTitle}</span>}
                                    <span><FontAwesomeIcon icon={faCalendar} className="mr-1.5" />{dayjs(publishedDate).format("DD/MM/YYYY")}</span>
                                    <span><FontAwesomeIcon icon={faClock} className="mr-1.5" />{readingMinutes} phút đọc</span>
                                    <span><FontAwesomeIcon icon={faEye} className="mr-1.5" />{article.viewCount?.toLocaleString("vi-VN") || 0} lượt xem</span>
                                </div>
                            </div>
                        </div>
                        <ArticleActions article={article} />
                    </div>
                </header>

                {article.thumbnail && (
                    <figure className="mt-5 overflow-hidden rounded-2xl bg-slate-100 shadow-sm">
                        <img src={article.thumbnail} alt={article.name} className="max-h-[680px] w-full object-cover" />
                        {editorial?.heroCaption && <figcaption className="px-5 py-3 text-sm italic text-slate-600 md:px-7">{editorial.heroCaption}</figcaption>}
                    </figure>
                )}

                <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
                    <div className="min-w-0 space-y-6">
                        <article className="rounded-2xl bg-white p-5 shadow-sm md:p-9">
                            {headings.length > 0 && (
                                <nav aria-label="Mục lục bài viết" className="mb-8 rounded-xl bg-slate-50 p-5 lg:hidden">
                                    <h2 className="mb-3 font-bold text-slate-900">Mục lục bài viết</h2>
                                    <ol className="space-y-2">
                                        {headings.map((heading, index) => (
                                            <li key={heading.id}><a href={`#${heading.id}`} className="text-sm text-slate-600 hover:text-amber-700">{index + 1}. {heading.label}</a></li>
                                        ))}
                                    </ol>
                                </nav>
                            )}
                            <div className="article-content">
                                {blocks.map((block, index) => renderBlock(block, index))}
                            </div>
                            {editorial?.routeTitle && (
                                <section className="mt-10 rounded-2xl bg-amber-50 p-5 md:p-7">
                                    <div className="flex items-start gap-3">
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-200 text-amber-900"><FontAwesomeIcon icon={faMap} /></span>
                                        <div>
                                            <h2 className="text-xl font-bold text-slate-900">{editorial.routeTitle}</h2>
                                            {editorial.routeDescription && <p className="mt-2 leading-7 text-slate-700">{editorial.routeDescription}</p>}
                                            {editorial.routeAddress && <p className="mt-2 text-sm font-medium text-slate-600"><FontAwesomeIcon icon={faLocationDot} className="mr-2 text-amber-700" />{editorial.routeAddress}</p>}
                                        </div>
                                    </div>
                                    {editorial.routeStops?.length ? (
                                        <div className="mt-5 space-y-3">
                                            {editorial.routeStops.map((stop, index) => <RouteStopCard key={`${stop.name}-${index}`} stop={stop} index={index} />)}
                                        </div>
                                    ) : null}
                                    <div className="mt-5 flex flex-wrap gap-3">
                                        {routeMapUrl && <a href={routeMapUrl} target="_blank" rel="noreferrer" className="rounded-full bg-amber-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-amber-700">Mở trên Google Maps</a>}
                                        {routeDownloadUrl && <a href={routeDownloadUrl} target="_blank" rel="noreferrer" className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Tải file GPX/KML</a>}
                                    </div>
                                </section>
                            )}
                        </article>

                        {!!editorial?.topics?.length && (
                            <section className="flex flex-wrap items-center gap-2 rounded-2xl bg-white p-5 shadow-sm">
                                <span className="mr-1 text-sm font-semibold text-slate-500">Chủ đề:</span>
                                {editorial.topics.map((topic) => <span key={topic} className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-amber-800">#{topic.replace(/^#/, "")}</span>)}
                            </section>
                        )}

                        <section className="rounded-2xl bg-amber-50 p-5 md:p-7">
                            <div className="flex flex-col gap-5 sm:flex-row">
                                {authorAvatar && <img src={authorAvatar} alt={authorName} className="h-20 w-20 shrink-0 rounded-full object-cover" />}
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">{authorName}</h2>
                                    {editorial?.authorTitle && <p className="mt-1 font-semibold text-amber-800">{editorial.authorTitle}</p>}
                                    {editorial?.authorBio && <p className="mt-3 leading-7 text-slate-700">{editorial.authorBio}</p>}
                                </div>
                            </div>
                        </section>

                        <ArticleComments articleId={article.id} articleSlug={article.normalizedName} />
                    </div>

                    <aside className="space-y-5 lg:sticky lg:top-6">
                        {headings.length > 0 && (
                            <nav aria-label="Mục lục bài viết" className="hidden rounded-2xl bg-white p-5 shadow-sm lg:block">
                                <h2 className="mb-4 border-b border-slate-100 pb-3 font-bold text-slate-900">Mục lục bài viết</h2>
                                <ol className="space-y-1">
                                    {headings.map((heading, index) => (
                                        <li key={heading.id}><a href={`#${heading.id}`} className="block rounded-lg px-3 py-2 text-sm leading-5 text-slate-600 transition hover:bg-amber-50 hover:text-amber-800">{index + 1}. {heading.label}</a></li>
                                    ))}
                                </ol>
                            </nav>
                        )}
                        <ArticleNewsletterSignup />
                        <section className="rounded-2xl bg-white p-5 shadow-sm">
                            <h2 className="mb-4 text-lg font-bold text-slate-900">Bài viết gợi ý</h2>
                            {randomArticles.length ? (
                                <div className="space-y-4">
                                    {randomArticles.filter((item) => item.id !== article.id).slice(0, 4).map((item) => (
                                        <Link key={item.id} href={`/article/${item.normalizedName}`} className="group flex gap-3">
                                            {item.thumbnail ? (
                                                <img src={item.thumbnail} alt={item.name} className="h-20 w-20 shrink-0 rounded-lg object-cover" />
                                            ) : (
                                                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400"><FontAwesomeIcon icon={faStar} /></div>
                                            )}
                                            <span className="min-w-0">
                                                <span className="line-clamp-2 block font-semibold leading-5 text-slate-800 group-hover:text-amber-700">{item.name}</span>
                                                <span className="mt-2 block text-xs text-slate-500"><FontAwesomeIcon icon={faCalendar} className="mr-1" />{dayjs(item.modifiedDate || item.createdDate).format("DD/MM/YYYY")}</span>
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            ) : <p className="text-sm text-slate-500">Chưa có bài viết gợi ý.</p>}
                        </section>
                    </aside>
                </div>
            </div>
        </PageContainer>
    );
};

export default Page;
