/* eslint-disable @next/next/no-img-element */
import PageContainer from "@/components/layout/page-container";
import { apiArticleDetail, apiArticleList } from "@/service/article";
import { Metadata } from "next";
import Link from "next/link";
import { apiCatalogMeta } from "@/service/catalog";
import { EyeFilled } from "@ant-design/icons";
import Block from "@/components/block";

type Params = Promise<{
    id: string;
}>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { id } = await params;
    const res = await apiCatalogMeta(id);
    const article = res;
    return {
        title: `${article.name} - DefZone.Net`,
        description: article.description,
    };
}

const Page = async ({ params }: { params: Params }) => {
    const { id } = await params;
    const res = await apiArticleDetail(id);
    const article = res.data;
    console.log("Article detail:", article);

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
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h1 className="text-3xl font-bold mb-3">{article.name}</h1>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <span>
                                <EyeFilled /> {article.viewCount?.toLocaleString()} lượt xem
                            </span>
                            <span>•</span>
                            <span>Cập nhật {new Date(article.modifiedDate).toLocaleDateString("vi-VN")}</span>
                        </div>
                    </div>

                    <div className="prose max-w-none">
                        {article.content?.blocks?.map((block: API.Block, index: number) => <Block key={index} {...block} />)}
                    </div>
                </div>

                <aside className="space-y-8">
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
                                            <div className="group cursor-pointer flex gap-3 mb-2">
                                                <div className="relative flex-shrink-0 w-20 h-20 overflow-hidden rounded-md bg-gray-200">
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
                                                    <p className="text-xs text-gray-500 mt-1"><EyeFilled /> {item.viewCount?.toLocaleString()}</p>
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