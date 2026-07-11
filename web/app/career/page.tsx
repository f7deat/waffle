import Link from "next/link";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import PageContainer from "@/components/layout/page-container";
import { apiCareerList } from "@/services/career";

type SearchParams = Promise<{
    page?: string;
    pageSize?: string;
    keyword?: string;
    status?: string;
    jobType?: string;
    location?: string;
}>;

const DEFAULT_PAGE_SIZE = 9;
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "DefZone.Net";

const extractSearchValue = (value?: string) => (value || "").trim();

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
    const params = await searchParams;
    const current = Math.max(1, Number(params.page) || 1);
    const keyword = extractSearchValue(params.keyword);
    const status = extractSearchValue(params.status);
    const jobType = extractSearchValue(params.jobType);
    const location = extractSearchValue(params.location);

    const hasFilter = Boolean(keyword || status || jobType || location);
    const titleParts = ["Tuyen dung", "Co hoi viec lam moi nhat"];

    if (keyword) titleParts.push(`Tu khoa ${keyword}`);
    if (location) titleParts.push(`Tai ${location}`);
    if (current > 1) titleParts.push(`Trang ${current}`);

    const title = `${titleParts.join(" | ")} | ${SITE_NAME}`;
    const description = hasFilter
        ? `Tong hop tin tuyen dung theo bo loc hien tai${keyword ? ` voi tu khoa ${keyword}` : ""}${location ? ` tai ${location}` : ""}. Cap nhat co hoi viec lam moi nhat tai ${SITE_NAME}.`
        : `Danh sach viec lam moi nhat tai ${SITE_NAME}. Kham pha co hoi nghe nghiep phu hop va ung tuyen nhanh ngay hom nay.`;

    const query = new URLSearchParams();
    if (current > 1) query.set("page", String(current));
    if (params.pageSize) query.set("pageSize", params.pageSize);
    if (keyword) query.set("keyword", keyword);
    if (status) query.set("status", status);
    if (jobType) query.set("jobType", jobType);
    if (location) query.set("location", location);
    const canonical = query.toString() ? `/career?${query.toString()}` : "/career";

    return {
        title,
        description,
        alternates: {
            canonical,
        },
        openGraph: {
            title,
            description,
            url: canonical,
            type: "website",
        },
        robots: {
            index: !hasFilter && current === 1,
            follow: true,
        },
    };
}

const jobTypeLabel = (type: API.CareerJobType) => {
    switch (type) {
        case 0:
            return "Toàn thời gian";
        case 1:
            return "Bán thời gian";
        case 2:
            return "Hợp đồng";
        case 3:
            return "Thực tập";
        default:
            return "Khác";
    }
};

const statusLabel = (status: API.CareerJobStatus) => {
    switch (status) {
        case 0:
            return "Nhập liệu";
        case 1:
            return "Đang tuyển";
        case 2:
            return "Đã đóng";
        case 3:
            return "Đã đủ ứng viên";
        default:
            return "Khác";
    }
};

const statusClass = (status: API.CareerJobStatus) => {
    switch (status) {
        case 1:
            return "bg-emerald-50 text-emerald-700 border-emerald-200";
        case 2:
            return "bg-rose-50 text-rose-700 border-rose-200";
        case 3:
            return "bg-amber-50 text-amber-700 border-amber-200";
        default:
            return "bg-slate-100 text-slate-700 border-slate-200";
    }
};

const formatDate = (value?: string) => {
    if (!value) return "Chua cap nhat";
    return new Date(value).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

const buildPageHref = (page: number, pageSize: number) => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    if (pageSize !== DEFAULT_PAGE_SIZE) {
        params.set("pageSize", String(pageSize));
    }
    return `/career?${params.toString()}`;
};

const containsText = (source: string | undefined, keyword: string) => {
    if (!keyword) return true;
    return (source || "").toLowerCase().includes(keyword.toLowerCase());
};

const Page = async ({ searchParams }: { searchParams: SearchParams }) => {
    const cookieStore = await cookies();
    const params = await searchParams;

    const current = Math.max(1, Number(params.page) || 1);
    const pageSize = Math.max(1, Number(params.pageSize) || DEFAULT_PAGE_SIZE);
    const keyword = (params.keyword || "").trim();
    const status = params.status || "";
    const jobType = params.jobType || "";
    const location = (params.location || "").trim();
    const hasFilter = Boolean(keyword || status || jobType || location);

    const response = await apiCareerList({ current, pageSize }, cookieStore.toString());
    const jobs = response?.data || [];

    const filteredJobs = jobs.filter((job) => {
        const matchedKeyword =
            containsText(job.title, keyword) ||
            containsText(job.description, keyword) ||
            containsText(job.jobRequirements, keyword);
        const matchedStatus = status ? String(job.status) === status : true;
        const matchedJobType = jobType ? String(job.jobType) === jobType : true;
        const matchedLocation = containsText(job.jobLocation, location);
        return matchedKeyword && matchedStatus && matchedJobType && matchedLocation;
    });

    const total = hasFilter ? filteredJobs.length : response?.total || jobs.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    const openingCount = filteredJobs.filter((job) => job.status === 1).length;
    const closingCount = filteredJobs.filter((job) => job.status === 2 || job.status === 3).length;

    return (
        <PageContainer breadcrumbs={[{ label: "Tuyển dụng", href: "/career" }]}>
            <section className="rounded-3xl border border-orange-100 bg-[radial-gradient(circle_at_top_right,_#ffedd5,_transparent_60%),linear-gradient(120deg,_#fff7ed,_#ffffff_45%,_#fefce8)] p-6 shadow-sm md:p-8">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl space-y-2">
                        <span className="inline-flex rounded-full border border-orange-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-orange-700">
                            Cơ hội nghề nghiệp
                        </span>
                        <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
                            Danh sách các vị trí tuyển dụng
                        </h1>
                        <p className="text-sm leading-6 text-slate-600 md:text-base">
                            Tìm kiếm cơ hội nghề nghiệp phù hợp với bạn. Chúng tôi luôn tìm kiếm những tài năng mới để gia nhập đội ngũ của mình.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:min-w-[320px]">
                        <div className="rounded-2xl border border-orange-200 bg-white/90 p-4 text-center">
                            <p className="text-xs uppercase tracking-wide text-slate-500">Tổng vị trí</p>
                            <p className="mt-1 text-2xl font-bold text-slate-900">{total.toLocaleString()}</p>
                        </div>
                        <div className="rounded-2xl border border-emerald-200 bg-white/90 p-4 text-center">
                            <p className="text-xs uppercase tracking-wide text-slate-500">Đang tuyển</p>
                            <p className="mt-1 text-2xl font-bold text-emerald-700">{openingCount.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-2 text-sm">
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700">Trang {current}/{totalPages}</span>
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-amber-700">Vị trí đã đóng: {closingCount}</span>
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-600">Cập nhật liên tục theo nhu cầu tuyển dụng</span>
                </div>
            </section>

            <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <form action="/career" method="get" className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                    <input type="hidden" name="page" value="1" />
                    <div>
                        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Tu khoa</label>
                        <input
                            type="text"
                            name="keyword"
                            defaultValue={keyword}
                            placeholder="Vi du: frontend"
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-orange-300 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Trạng thái</label>
                        <select name="status" defaultValue={status} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-orange-300 focus:outline-none">
                            <option value="">Tất cả</option>
                            <option value="1">Đang tuyển</option>
                            <option value="2">Đã đóng</option>
                            <option value="3">Đã đủ ứng viên</option>
                        </select>
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Loại công việc</label>
                        <select name="jobType" defaultValue={jobType} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-orange-300 focus:outline-none">
                            <option value="">Tất cả</option>
                            <option value="0">Toàn thời gian</option>
                            <option value="1">Bán thời gian</option>
                            <option value="2">Hợp đồng</option>
                            <option value="3">Thực tập</option>
                        </select>
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Địa điểm</label>
                        <input
                            type="text"
                            name="location"
                            defaultValue={location}
                            placeholder="Vi du: Ha Noi"
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-orange-300 focus:outline-none"
                        />
                    </div>
                    <div className="flex items-end gap-2">
                        <button type="submit" className="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-black">
                            Lọc kết quả
                        </button>
                        <Link href="/career" className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                            Xóa
                        </Link>
                    </div>
                </form>
                {hasFilter && (
                    <p className="mt-3 text-xs text-slate-500">Dang loc tren du lieu cua trang hien tai.</p>
                )}
            </section>

            <section className="mt-6">
                {filteredJobs.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                        <p className="text-lg font-semibold text-slate-800">Chua co tin tuyen dung nao.</p>
                        <p className="mt-2 text-sm text-slate-500">Vui long quay lai sau de cap nhat cac co hoi moi.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {filteredJobs.map((job) => (
                                <article
                                    key={job.id}
                                    className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <h2 className="line-clamp-2 text-lg font-bold text-slate-900">{job.title}</h2>
                                        <span className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClass(job.status)}`}>
                                            {statusLabel(job.status)}
                                        </span>
                                    </div>

                                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{job.description || "Dang cap nhat mo ta cong viec."}</p>

                                    <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700">{jobTypeLabel(job.jobType)}</span>
                                        <span className="rounded-full bg-orange-50 px-2.5 py-1 text-orange-700">{job.jobLocation || "Địa điểm linh hoạt"}</span>
                                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">{job.salaryRange || "Lương thỏa thuận"}</span>
                                    </div>

                                    <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs text-slate-600">
                                        <span>Ung vien: <strong className="text-slate-800">{job.applicationCount.toLocaleString()}</strong></span>
                                        <span>Luot xem: <strong className="text-slate-800">{job.viewCount.toLocaleString()}</strong></span>
                                        <span className="col-span-2">Ngày đăng: <strong className="text-slate-800">{formatDate(job.modifiedDate || job.createdDate)}</strong></span>
                                    </div>

                                    <div className="mt-4 flex gap-2">
                                        <Link href={`/career/${job.normalizedName}`} className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50">
                                            Xem chi tiết
                                        </Link>
                                        <Link href={`/career/${job.id}#apply`} className="flex-1 rounded-lg bg-orange-500 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-orange-600">
                                            Ứng tuyển
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {!hasFilter && totalPages > 1 && (
                            <div className="mt-5 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm">
                                <span className="text-slate-600">Hien thi trang {current} tren {totalPages}</span>
                                <div className="flex items-center gap-2">
                                    <Link
                                        href={buildPageHref(Math.max(1, current - 1), pageSize)}
                                        aria-disabled={current === 1}
                                        className={`rounded-lg px-3 py-2 font-semibold transition ${current === 1 ? "cursor-not-allowed bg-slate-100 text-slate-400" : "bg-slate-900 text-white hover:bg-black"}`}
                                    >
                                        Truoc
                                    </Link>
                                    <Link
                                        href={buildPageHref(Math.min(totalPages, current + 1), pageSize)}
                                        aria-disabled={current === totalPages}
                                        className={`rounded-lg px-3 py-2 font-semibold transition ${current === totalPages ? "cursor-not-allowed bg-slate-100 text-slate-400" : "bg-orange-500 text-white hover:bg-orange-600"}`}
                                    >
                                        Sau
                                    </Link>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </section>
        </PageContainer>
    );
};

export default Page;