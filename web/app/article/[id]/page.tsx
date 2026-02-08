/* eslint-disable @next/next/no-img-element */
import PageContainer from "@/components/layout/page-container";
import { apiArticleDetail, apiArticleList } from "@/services/article";
import { Metadata } from "next";
import Link from "next/link";
import { apiCatalogMeta } from "@/services/catalog";
import { EyeFilled } from "@ant-design/icons";
import Block from "@/components/block";
import ArticleActions from "@/components/article/actions";
import ArticleComments from "@/components/article/comments";

type Params = Promise<{
    id: string;
}>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { id } = await params;
    const res = await apiCatalogMeta(id);
    const article = res.data;
    return {
        title: `${article.title} - DefZone.Net`,
        description: article.description,
        openGraph: {
            title: article.title,
            description: article.description,
            images: article.thumbnail ? [{ url: article.thumbnail }] : [],
        },
    };
}

const Page = async ({ params }: { params: Params }) => {
    const { id } = await params;
    const res = await apiArticleDetail(id);
    const article = res.data;

    // Fetch latest articles for sidebar
    const latestRes = await apiArticleList({ current: 1, pageSize: 6 });
    const latestArticles = (latestRes.data || []).sort(
        (a, b) => new Date(b.modifiedDate).getTime() - new Date(a.modifiedDate).getTime()
    );

    const breadcrumbs = [
        { label: "Bài viết", href: "/article" },
        { label: article?.name || "Chi tiết", href: "#" },
    ];

    if (!article) {
        return (
            <PageContainer breadcrumbs={[{ label: "Article", href: "/article" }]}>
                <div className="text-center py-12">
                    <p className="text-gray-600">Không tìm thấy bài viết.</p>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer breadcrumbs={breadcrumbs}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white/70 backdrop-blur p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{article.name}</h1>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                                <EyeFilled className="text-gray-500" /> {article.viewCount?.toLocaleString() ?? 0} lượt xem
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                                Cập nhật {article.modifiedDate ? new Date(article.modifiedDate).toLocaleDateString("vi-VN") : "Chưa cập nhật"}
                            </span>
                        </div>
                        <div className="mt-4">
                            <ArticleActions article={article} />
                        </div>
                    </div>

                    {article.thumbnail && (
                        <div className="relative rounded-xl overflow-hidden bg-gray-100">
                            <div className="pt-[56.25%]"></div>
                            <img
                                src={article.thumbnail}
                                alt={article.name}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div className="prose prose-lg max-w-none">
                        {article.content?.blocks?.map((block: API.Block, index: number) => <Block key={index} {...block} />)}
                    </div>

                    <ArticleComments articleId={article.id} articleSlug={article.normalizedName} />
                </div>

                <aside className="space-y-8 lg:sticky lg:top-24">
                    <div>
                        <h2 className="text-xl font-bold mb-4">Bài viết mới</h2>
                        {latestArticles.length === 0 ? (
                            <p className="text-sm text-gray-500">Chưa có bài viết.</p>
                        ) : (
                            <div className="space-y-4">
                                {latestArticles.map((item) => {
                                    const updatedAt = item.modifiedDate
                                        ? new Date(item.modifiedDate).toLocaleDateString("vi-VN")
                                        : "Chưa cập nhật";
                                    return (
                                        <Link key={item.id} href={`/article/${item.normalizedName}`}>
                                            <div className="group cursor-pointer flex gap-3 p-2 rounded-lg bg-white mb-1">
                                                <div className="relative flex-shrink-0 w-24 h-24 overflow-hidden rounded-md bg-gray-200">
                                                    {item.thumbnail ? (
                                                        <img
                                                            src={item.thumbnail}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center text-2xl">📰</div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1 line-clamp-2">
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-xs text-gray-500">Cập nhật {updatedAt}</p>
                                                    <p className="text-xs text-gray-500 mt-1"><EyeFilled /> {item.viewCount?.toLocaleString() ?? 0}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </aside>
            </div>
        </PageContainer>
    );
};

export default Page;