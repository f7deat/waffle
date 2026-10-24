import { apiArticleList } from "@/services/article";
import { faAngleDoubleRight, faArrowRight, faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import Link from "next/link";

const Article: React.FC = async () => {

    const articlesResponse = await apiArticleList({ current: 1, pageSize: 4 });
    const articles = articlesResponse.data || [];

    const colors = ['bg-primary', 'bg-secondary', 'bg-tertiary'];

    return (
        <section className="w-full py-16 bg-surface-container-low px-4">
            <div className="container mx-auto px-gutter">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-6 h-1 bg-secondary rounded-full" />
                            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-semibold">
                                Tạp chí Đi Đâu Đây
                            </span>
                        </div>
                        <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
                            Cẩm nang khám phá
                        </h2>
                        <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                            Lịch trình chi tiết, bí quyết tiết kiệm và câu chuyện văn hoá địa
                            phương
                        </p>
                    </div>
                    <Link
                        className="inline-flex items-center gap-1 font-label-lg text-label-lg text-secondary hover:text-on-secondary-container transition-colors font-semibold group"
                        href="/article"
                    >
                        <span>Xem tất cả bài viết</span>
                        <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                            <FontAwesomeIcon icon={faArrowRight} />
                        </span>
                    </Link>
                </div>
                {/* 4 Editorial Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Article 1 */}
                    {
                        articles.map((article, index) => (
                            <article key={article.id} className="group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
                                <div className="relative w-full h-48 overflow-hidden">
                                    <div
                                        className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                                        data-alt="Top down flatlay of multiple authentic Hai Phong street food dishes including banh da cua, banh mi que, iced milk coffee on rustic table."
                                        style={{
                                            backgroundImage: `url("${article.thumbnail}")`
                                        }}
                                    />
                                    <span className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-on-primary font-label-sm text-label-sm font-semibold ${colors[index % colors.length]}`}>
                                        {article.categoryName || 'Mới'}
                                    </span>
                                </div>
                                <div className="p-5 flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 text-body-sm text-outline mb-2">
                                            <span className="material-symbols-outlined text-[15px]">
                                                <FontAwesomeIcon icon={faCalendar} />
                                            </span>{" "}
                                            {dayjs(article.modifiedDate).format("DD-MM-YYYY HH:mm")}
                                            <span>•</span>
                                            <span>{article.viewCount.toLocaleString()} lượt xem</span>
                                        </div>
                                        <Link href={`/article/${article.normalizedName}`}>
                                            <h3 className="font-headline-sm text-title font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-2">
                                                {article.name}
                                            </h3>
                                        </Link>
                                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 line-clamp-2">
                                            {article.description}
                                        </p>
                                    </div>
                                    <Link href={`/article/${article.normalizedName}`}>
                                        <div className="mt-4 pt-3 flex items-center justify-between font-label-sm text-label-sm text-primary font-semibold">
                                            <span>Đọc bài viết</span>
                                            <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                                                <FontAwesomeIcon icon={faAngleDoubleRight} />
                                            </span>
                                        </div>
                                    </Link>
                                </div>
                            </article>
                        ))
                    }
                </div>
            </div>
        </section>
    )
}

export default Article;