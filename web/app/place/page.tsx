/* eslint-disable @next/next/no-img-element */
import PageContainer from "@/components/layout/page-container";
import { apiPlaceList } from "@/service/locations/place";
import Link from "next/link";

type SearchParams = Promise<{
	page?: string;
	pageSize?: string;
	keyword?: string;
}>;

const DEFAULT_PAGE_SIZE = 12;

const Page = async ({ searchParams }: { searchParams: SearchParams }) => {
	const current = Math.max(1, Number((await searchParams).page) || 1);
	const pageSize = Math.max(1, Number((await searchParams).pageSize) || DEFAULT_PAGE_SIZE);
	const keyword = (await searchParams).keyword?.trim();

	const response = await apiPlaceList({ current, pageSize, keyword });
	const places = response.data || [];
	const total = response.total || places.length;
	const totalPages = Math.max(1, Math.ceil(total / pageSize));

	const buildPageHref = (page: number) => {
		const params = new URLSearchParams();
		if (keyword) params.set("keyword", keyword);
		if (pageSize !== DEFAULT_PAGE_SIZE) params.set("pageSize", String(pageSize));
		params.set("page", String(page));
		return `/place?${params.toString()}`;
	};

	return (
		<PageContainer
			breadcrumbs={[{ label: "Place", href: "/place" }]}
		>
			<div className="space-y-6">
				<div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
					<div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
						<div>
							<p className="text-xs uppercase tracking-[0.08em] text-slate-500">Danh sách địa điểm</p>
							<h1 className="text-2xl font-semibold text-slate-900">Khám phá các địa điểm</h1>
							<p className="text-sm text-slate-600">Tổng cộng {total.toLocaleString()} địa điểm được ghi nhận.</p>
						</div>
						<form className="flex w-full gap-2 md:w-auto" action="/place" method="get">
							<input
								type="text"
								name="keyword"
								defaultValue={keyword}
								placeholder="Tìm theo tên địa điểm..."
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
					{keyword && (
						<div className="text-sm text-slate-600">
							Kết quả cho <span className="font-semibold text-slate-800">“{keyword}”</span>
						</div>
					)}
				</div>

				{places.length === 0 ? (
					<div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 shadow-sm">
						<div className="text-4xl mb-3">🧭</div>
						<p className="font-semibold text-slate-700">Chưa có địa điểm nào phù hợp.</p>
						<p className="mt-1 text-sm text-slate-500">Thử tìm với từ khóa khác hoặc quay lại sau.</p>
					</div>
				) : (
					<>
						<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
							{places.map((place) => {
								const updatedAt = place.modifiedDate
									? new Date(place.modifiedDate).toLocaleDateString("vi-VN")
									: "Chưa cập nhật";

								return (
									<div
										key={place.id}
										className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white/85 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
									>
										<div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-indigo-100 via-white to-slate-100">
											{place.thumbnail ? (
												<img
													src={place.thumbnail}
													alt={place.name}
													className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
													loading="lazy"
												/>
											) : (
												<div className="flex h-full w-full items-center justify-center text-4xl">📍</div>
											)}
											<div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-indigo-700 shadow">
												{place.districtName}
											</div>
										</div>
										<div className="flex flex-1 flex-col gap-3 p-4">
											<Link href={`/place/${place.id}`} className="hover:underline">
												<h2 className="text-lg font-semibold text-slate-900 line-clamp-2">{place.name}</h2>
											</Link>
											<p className="text-sm text-slate-600 line-clamp-2">
												{place.streetName}, {place.districtName}, {place.provinceName}
											</p>
											<div className="mt-auto flex items-center gap-3 text-xs text-slate-500">
												<span className="flex items-center gap-1">
													<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-amber-500">
														<path d="M10 1.5a.75.75 0 01.67.415l1.882 3.815 4.21.612a.75.75 0 01.415 1.279l-3.046 2.968.719 4.192a.75.75 0 01-1.088.791L10 14.347l-3.762 1.975a.75.75 0 01-1.088-.79l.72-4.193L2.824 7.62a.75.75 0 01.415-1.278l4.21-.612L9.33 1.915A.75.75 0 0110 1.5z" />
													</svg>
													{place.viewCount?.toLocaleString()} lượt xem
												</span>
												<span className="text-slate-400">•</span>
												<span>Cập nhật {updatedAt}</span>
											</div>
										</div>
									</div>
								);
							})}
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
