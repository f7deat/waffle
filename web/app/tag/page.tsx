import PageContainer from "@/components/layout/page-container";
import { apiTagList } from "@/services/contents/tag";
import Link from "next/link";
import { cookies } from 'next/headers';

type SearchParams = Promise<{
    page?: string;
    pageSize?: string;
    name?: string;
}>;

const DEFAULT_PAGE_SIZE = 24;

const Page = async ({ searchParams }: { searchParams: SearchParams }) => {
    const cookieStore = await cookies();
    const locale = cookieStore.get("language")?.value || "vi-VN";

    const current = Math.max(1, Number((await searchParams).page) || 1);
    const pageSize = Math.max(1, Number((await searchParams).pageSize) || DEFAULT_PAGE_SIZE);
    const name = (await searchParams).name?.trim();

    const response = await apiTagList({ current, pageSize, name, locale });
    const tags = response.data || [];
    const total = response.total || tags.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    const buildPageHref = (page: number) => {
        const params = new URLSearchParams();
        if (name) params.set("name", name);
        if (pageSize !== DEFAULT_PAGE_SIZE) params.set("pageSize", String(pageSize));
        params.set("page", String(page));
        return `/tag?${params.toString()}`;
    };

    return (
        <PageContainer
            breadcrumbs={[{ label: "Thẻ tag", href: "/tag" }]}
        >
            <div className="space-y-6">
                <div className="flex flex-col gap-4 rounded-xl bg-white p-5">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.08em] text-slate-500">Danh sách thẻ tag</p>
                            <h1 className="text-2xl font-semibold text-slate-900">Khám phá các thẻ tag</h1>
                            <p className="text-sm text-slate-600">Tổng cộng {total.toLocaleString()} thẻ tag được ghi nhận.</p>
                        </div>
                        <form className="flex w-full gap-2 md:w-auto" action="/tag" method="get">
                            <input
                                type="text"
                                name="name"
                                defaultValue={name}
                                placeholder="Tìm theo tên thẻ tag..."
                                className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 md:w-72"
                            />
                            <button
                                type="submit"
                                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                            >
                                Tìm kiếm
                            </button>
                        </form>
                    </div>
                    {name && (
                        <div className="text-sm text-slate-600">
                            Kết quả cho <span className="font-semibold text-slate-800">{name}</span>
                        </div>
                    )}
                </div>

                {tags.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 shadow-sm">
                        <div className="text-4xl mb-3">🏷️</div>
                        <p className="font-semibold text-slate-700">Chưa có thẻ tag nào phù hợp.</p>
                        <p className="mt-1 text-sm text-slate-500">Thử tìm với từ khóa khác hoặc quay lại sau.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                            {tags.map((tag) => (
                                <Link
                                    key={tag.id}
                                    href={`/tag/${tag.normalizedName}`}
                                    className="group flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white/85 px-4 py-3 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-md"
                                >
                                    <span className="text-2xl group-hover:scale-110 transition-transform">🏷️</span>
                                    <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-700 truncate">
                                        {tag.name}
                                    </span>
                                </Link>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
                                <span>Trang {current} / {totalPages}</span>
                                <div className="flex items-center gap-2">
                                    <Link
                                        href={buildPageHref(Math.max(1, current - 1))}
                                        aria-disabled={current === 1}
                                        className={`rounded-lg px-3 py-2 font-semibold transition ${current === 1 ? "cursor-not-allowed bg-slate-100 text-slate-400" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}
                                    >
                                        Trước
                                    </Link>
                                    <Link
                                        href={buildPageHref(Math.min(totalPages, current + 1))}
                                        aria-disabled={current === totalPages}
                                        className={`rounded-lg px-3 py-2 font-semibold transition ${current === totalPages ? "cursor-not-allowed bg-slate-100 text-slate-400" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}
                                    >
                                        Sau
                                    </Link>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </PageContainer>
    );
};

export default Page;
