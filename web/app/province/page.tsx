import PageContainer from "@/components/layout/page-container";
import { apiProvinceList } from "@/services/locations/province";
import Link from "next/link";

type SearchParams = Promise<{
    page?: string;
    pageSize?: string;
    name?: string;
}>;

const DEFAULT_PAGE_SIZE = 12;

const Page: React.FC<{ searchParams: SearchParams }> = async ({ searchParams }) => {
    const params = await searchParams;
    const current = Math.max(1, Number(params.page) || 1);
    const pageSize = Math.min(48, Math.max(1, Number(params.pageSize) || DEFAULT_PAGE_SIZE));
    const name = params.name?.trim();

    const response = await apiProvinceList({ current, pageSize, name });
    const provinces = response.data || [];
    const total = response.total || provinces.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    const buildPageHref = (page: number) => {
        const query = new URLSearchParams();
        if (name) query.set("name", name);
        if (pageSize !== DEFAULT_PAGE_SIZE) query.set("pageSize", String(pageSize));
        query.set("page", String(page));
        return `/province?${query.toString()}`;
    };

    return (
        <PageContainer breadcrumbs={[{ label: "Tỉnh thành", href: "/province" }]}>
            <div className="space-y-6">
                <header className="rounded-xl border border-slate-200 bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold text-sky-800">KHÁM PHÁ THEO KHU VỰC</p>
                            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Tỉnh thành</h1>
                            <p className="mt-1 text-sm text-slate-600">Chọn một tỉnh thành để khám phá các địa điểm nổi bật.</p>
                        </div>
                        <form action="/province" method="get" className="flex w-full gap-2 sm:w-auto">
                            <input
                                type="search"
                                name="name"
                                defaultValue={name}
                                placeholder="Tìm tỉnh thành..."
                                aria-label="Tìm theo tên tỉnh thành"
                                className="min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100 sm:w-64"
                            />
                            <button type="submit" className="rounded-md bg-sky-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-900">
                                Tìm
                            </button>
                        </form>
                    </div>
                    <p className="mt-4 text-sm text-slate-600">{total.toLocaleString("vi-VN")} tỉnh thành</p>
                </header>

                {provinces.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                        <p className="font-semibold text-slate-800">Không tìm thấy tỉnh thành phù hợp.</p>
                        <p className="mt-1 text-sm text-slate-500">Thử tìm bằng tên khác.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {provinces.map((province) => (
                                <Link
                                    key={province.id}
                                    href={`/place/province/${province.id}`}
                                    className="group flex min-h-28 items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white px-5 py-4 transition hover:border-sky-300 hover:shadow-md"
                                >
                                    <div className="min-w-0">
                                        <h2 className="truncate text-lg font-semibold text-slate-900 group-hover:text-sky-900">
                                            {province.name}
                                        </h2>
                                        <p className="mt-1 text-sm text-slate-500">
                                            {province.districtCount.toLocaleString("vi-VN")} quận huyện
                                        </p>
                                    </div>
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-800 transition group-hover:bg-sky-800 group-hover:text-white" aria-hidden="true">
                                        →
                                    </span>
                                </Link>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <nav aria-label="Phân trang danh sách tỉnh thành" className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm">
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
                                        <Link href={buildPageHref(current + 1)} className="rounded-md bg-sky-800 px-3 py-2 font-medium text-white hover:bg-sky-900">
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
}

export default Page;