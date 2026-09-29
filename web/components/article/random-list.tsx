/* eslint-disable @next/next/no-img-element */
import { apiArticleRandoms } from "@/services/article";
import { faCalendar, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import Link from "next/link";

interface RandomArticleListProps {
    layout?: "grid" | "sidebar";
}

const RandomArticleList = async ({ layout = "grid" }: RandomArticleListProps) => {
    try {
        const response = await apiArticleRandoms();
        const articles = response.data || [];

        return (
            <section className="rounded-lg bg-white p-4 backdrop-blur">
                <div className="mb-4 flex items-center justify-between gap-3">
                    <h2 className="text-xl font-semibold text-slate-900">Bài viết ngẫu nhiên</h2>
                    <Link href="/article" className="text-sm font-medium text-blue-600 transition hover:text-blue-700">
                        Xem tất cả
                    </Link>
                </div>

                {articles.length === 0 ? (
                    <p className="text-sm text-slate-500">Chưa có bài viết.</p>
                ) : (
                    <div className={layout === "sidebar" ? "space-y-3" : "grid gap-4 md:grid-cols-2 xl:grid-cols-4"}>
                        {articles.map((article) => (
                            <Link
                                key={article.id}
                                href={`/article/${article.normalizedName}`}
                                className={layout === "sidebar"
                                    ? "group flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-2 transition hover:border-blue-200 hover:bg-blue-50 hover:shadow-md"
                                    : "group overflow-hidden rounded-lg border border-slate-200 bg-slate-50 transition hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50 hover:shadow-md"}
                            >
                                <div className={layout === "sidebar"
                                    ? "h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-slate-100"
                                    : "h-40 overflow-hidden bg-slate-100"}>
                                    {article.thumbnail ? (
                                        <img
                                            src={article.thumbnail}
                                            alt={article.name}
                                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-3xl">📰</div>
                                    )}
                                </div>
                                <div className={layout === "sidebar" ? "min-w-0 py-1" : "p-3"}>
                                    <h3 className="line-clamp-2 font-semibold text-slate-900 transition group-hover:text-blue-700">
                                        {article.name}
                                    </h3>
                                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
                                        <span>
                                            <FontAwesomeIcon icon={faCalendar} className="mr-1" />
                                            {dayjs(article.modifiedDate || article.createdDate).format("DD/MM/YYYY")}
                                        </span>
                                        <span>
                                            <FontAwesomeIcon icon={faEye} className="mr-1" />
                                            {article.viewCount?.toLocaleString() ?? 0}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        );
    } catch {
        return null;
    }
};

export default RandomArticleList;