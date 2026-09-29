/* eslint-disable @next/next/no-img-element */
import PageContainer from "@/components/layout/page-container";
import { apiDistrictList } from "@/services/locations/district";
import Link from "next/link";

type SearchParams = Promise<{
    page?: string;
    pageSize?: string;
}>;

const DEFAULT_PAGE_SIZE = 12;

const Page: React.FC<{ searchParams: SearchParams }> = async ({ searchParams }) => {
    const params = await searchParams;
    const current = Math.max(1, Number(params.page) || 1);
    const pageSize = Math.min(48, Math.max(1, Number(params.pageSize) || DEFAULT_PAGE_SIZE));

    const response = await apiDistrictList({ current, pageSize });
    const districts = response.data || [];
    const total = response.total || districts.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    const buildPageHref = (page: number) => {
        const query = new URLSearchParams();
        if (pageSize !== DEFAULT_PAGE_SIZE) query.set("pageSize", String(pageSize));
        query.set("page", String(page));
        return `/district?${query.toString()}`;
    };

    return (
        <PageContainer breadcrumbs={[{ label: "Quận huyện", href: "/district" }]}>
            <div className="space-y-6">
                <header className="overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-6">
                    <p className="text-sm font-semibold text-emerald-700">ĐỊA ĐIỂM THEO KHU VỰC</p>
                    <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-semibold text-slate-900">Danh sách quận huyện</h1>
                            <p className="mt-1 text-sm text-slate-600">Khám phá các địa điểm nổi bật theo từng khu vực.</p>
                        </div>
                        <p className="text-sm text-slate-600">{total.toLocaleString("vi-VN")} khu vực</p>
                    </div>
                </header>

                {districts.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                        <p className="font-semibold text-slate-800">Chưa có quận huyện nào.</p>
                        <p className="mt-1 text-sm text-slate-500">Danh sách khu vực sẽ được cập nhật tại đây.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {districts.map((district) => (
                                <Link
                                    key={district.id}
                                    href={`/district/${district.id}`}
                                    className="group flex min-h-36 items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-emerald-300 hover:shadow-md"
                                >
                                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-emerald-50">
                                        {district.thumbnail ? (
                                            <img
                                                src={district.thumbnail}
                                                alt={district.name}
                                                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-3xl text-emerald-700" aria-hidden="true">
                                                ◉
                                            </div>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <h2 className="truncate text-lg font-semibold text-slate-900 group-hover:text-emerald-800">
                                            {district.name}
                                        </h2>
                                        <p className="mt-1 truncate text-sm text-slate-500">{district.provinceName}</p>
                                        <span className="mt-3 inline-flex text-sm font-medium text-emerald-700">
                                            Xem địa điểm <span className="ml-1 transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <nav aria-label="Phân trang danh sách quận huyện" className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm">
                                <span className="text-slate-600">Trang {current} / {totalPages}</span>
                                <div className="flex items-center gap-2">
                                    {current > 1 ? (
                                        <Link href={buildPageHref(current - 1)} className="rounded-md bg-slate-100 px-3 py-2 font-medium text-slate-700 hover:bg-slate-200">
                                            Trước
                                        </Link>
                                    ) : (
                                        <span aria-disabled="true" className="cursor-not-allowed rounded-md bg-slate-50 px-3 py-2 text-slate-400">Trước</span>
                                    )}
                                    {current < totalPages ? (
                                        <Link href={buildPageHref(current + 1)} className="rounded-md bg-emerald-700 px-3 py-2 font-medium text-white hover:bg-emerald-800">
                                            Tiếp
                                        </Link>
                                    ) : (
                                        <span aria-disabled="true" className="cursor-not-allowed rounded-md bg-slate-50 px-3 py-2 text-slate-400">Tiếp</span>
                                    )}
                                </div>
                            </nav>
                        )}
                    </>
                )}
            </div>
        </PageContainer>
    );
};

export default Page;