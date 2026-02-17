/* eslint-disable @next/next/no-img-element */
import PageContainer from "@/components/layout/page-container";
import { apiGetTagByName, apiGetArticlesByTag, apiGetPlacesByTag } from "@/services/contents/tag";
import Link from "next/link";
import { cookies } from 'next/headers'

type Params = Promise<{
    id: string;
}>;

const DEFAULT_PAGE_SIZE = 12;

const Page = async ({ params }: { params: Params }) => {
    const { id: normalizedName } = await params;
    const cookieStore = await cookies();
    const locale = cookieStore.get("language")?.value || "vi-VN";

    // Fetch tag info
    let tag: API.TagListItem | null = null;
    try {
        const tagRes = await apiGetTagByName(normalizedName);
        tag = tagRes.data || null;
    } catch (error) {
        console.error('Failed to fetch tag:', error);
    }

    // Fetch articles by tag
    let articles: API.ArticleListItem[] = [];
    let articlesTotal = 0;
    try {
        const articlesRes = await apiGetArticlesByTag({ 
            current: 1, 
            pageSize: DEFAULT_PAGE_SIZE, 
            normalizedName,
            locale 
        });
        articles = articlesRes.data || [];
        articlesTotal = articlesRes.total || articles.length;
    } catch (error) {
        console.error('Failed to fetch articles by tag:', error);
    }

    // Fetch places by tag
    let places: API.PlaceListItem[] = [];
    let placesTotal = 0;
    try {
        const placesRes = await apiGetPlacesByTag({ 
            current: 1, 
            pageSize: DEFAULT_PAGE_SIZE, 
            normalizedName,
            locale 
        });
        places = placesRes.data || [];
        placesTotal = placesRes.total || places.length;
    } catch (error) {
        console.error('Failed to fetch places by tag:', error);
    }

    const breadcrumbs = [
        { label: "Tag", href: "/tag" },
        { label: tag?.name || normalizedName, href: "#" },
    ];

    if (!tag) {
        return (
            <PageContainer breadcrumbs={breadcrumbs}>
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 shadow-sm">
                    <div className="text-4xl mb-3">🏷️</div>
                    <p className="font-semibold text-slate-700">Tag không tồn tại.</p>
                    <p className="mt-1 text-sm text-slate-500">Tag này có thể đã bị xóa hoặc không tồn tại.</p>
                    <Link 
                        href="/tag" 
                        className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                    >
                        Quay lại danh sách Tag
                    </Link>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer breadcrumbs={breadcrumbs}>
            <div className="space-y-8">
                {/* Tag Info */}
                <div className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-2">
                        <p className="text-xs uppercase tracking-[0.08em] text-slate-500">Tag</p>
                        <h1 className="text-3xl font-bold text-slate-900">#{tag.name}</h1>
                        <p className="text-sm text-slate-600">
                            Khám phá {articlesTotal} bài viết và {placesTotal} địa điểm với tag này.
                        </p>
                    </div>
                </div>

                {/* Articles Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Bài viết</h2>
                            <p className="text-sm text-slate-600">Tổng cộng {articlesTotal} bài viết</p>
                        </div>
                        {articlesTotal > DEFAULT_PAGE_SIZE && (
                            <Link 
                                href={`/search?tag=${normalizedName}`}
                                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                            >
                                Xem tất cả →
                            </Link>
                        )}
                    </div>

                    {articles.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 shadow-sm">
                            <div className="text-3xl mb-3">📝</div>
                            <p className="font-semibold text-slate-700">Chưa có bài viết nào.</p>
                            <p className="mt-1 text-sm text-slate-500">Không có bài viết nào với tag này.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                            {articles.map((article) => {
                                const updatedAt = article.modifiedDate
                                    ? new Date(article.modifiedDate).toLocaleDateString("vi-VN")
                                    : "Chưa cập nhật";

                                return (
                                    <Link
                                        key={article.id}
                                        href={`/article/${article.id}`}
                                        className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white/85 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
                                    >
                                        {article.thumbnail && (
                                            <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-indigo-100 via-white to-slate-100">
                                                <img
                                                    src={article.thumbnail}
                                                    alt={article.name}
                                                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                                    loading="lazy"
                                                />
                                            </div>
                                        )}
                                        <div className="flex flex-1 flex-col gap-3 p-4">
                                            <h3 className="font-semibold text-slate-900 line-clamp-2 group-hover:text-indigo-600">
                                                {article.name}
                                            </h3>
                                            <p className="text-xs text-slate-500 line-clamp-2">
                                                {article.description}
                                            </p>
                                            <div className="mt-auto flex items-center gap-2 text-xs text-slate-500">
                                                <span>{article.viewCount || 0} lượt xem</span>
                                                <span>•</span>
                                                <span>{updatedAt}</span>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Places Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Địa điểm</h2>
                            <p className="text-sm text-slate-600">Tổng cộng {placesTotal} địa điểm</p>
                        </div>
                        {placesTotal > DEFAULT_PAGE_SIZE && (
                            <Link 
                                href={`/place?tag=${normalizedName}`}
                                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                            >
                                Xem tất cả →
                            </Link>
                        )}
                    </div>

                    {places.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 shadow-sm">
                            <div className="text-3xl mb-3">📍</div>
                            <p className="font-semibold text-slate-700">Chưa có địa điểm nào.</p>
                            <p className="mt-1 text-sm text-slate-500">Không có địa điểm nào với tag này.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                            {places.map((place) => {
                                const updatedAt = place.modifiedDate
                                    ? new Date(place.modifiedDate).toLocaleDateString("vi-VN")
                                    : "Chưa cập nhật";

                                return (
                                    <Link
                                        key={place.id}
                                        href={`/place/${place.id}`}
                                        className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white/85 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
                                    >
                                        {place.thumbnail && (
                                            <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-amber-100 via-white to-slate-100">
                                                <img
                                                    src={place.thumbnail}
                                                    alt={place.name}
                                                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                                    loading="lazy"
                                                />
                                            </div>
                                        )}
                                        <div className="flex flex-1 flex-col gap-3 p-4">
                                            <h3 className="font-semibold text-slate-900 line-clamp-2 group-hover:text-indigo-600">
                                                {place.name}
                                            </h3>
                                            <p className="text-xs text-slate-500 line-clamp-2">
                                                {place.address}
                                            </p>
                                            <div className="flex flex-wrap gap-1 mt-auto">
                                                <span className="inline-block rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                                                    {place.districtName}
                                                </span>
                                                <span className="inline-block rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                                                    {place.provinceName}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <span>{place.viewCount || 0} lượt xem</span>
                                                <span>•</span>
                                                <span>{updatedAt}</span>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </PageContainer>
    );
};

export default Page;
