/* eslint-disable @next/next/no-img-element */
import PageContainer from "@/components/layout/page-container";
import { apiPlaceList } from "@/services/locations/place";
import KolList from "@/components/place/kol-list";
import { apiKolList } from "@/services/kol/kol";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowLeftOutlined, ArrowRightOutlined, EnvironmentOutlined, SearchOutlined } from "@ant-design/icons";

type SearchParams = Promise<{
	page?: string;
	pageSize?: string;
	keyword?: string;
}>;

const DEFAULT_PAGE_SIZE = 12;

export async function generateMetadata(): Promise<Metadata> {
    return {
		title: 'Địa điểm - DefZone.Net',
		description: 'Khám phá các địa điểm thú vị cùng KOLs và người ảnh hưởng.',
		openGraph: {
			title: 'Địa điểm',
			description: 'Khám phá các địa điểm thú vị cùng KOLs và người ảnh hưởng.',
		},
	};
}

const Page = async ({ searchParams }: { searchParams: SearchParams }) => {
	const current = Math.max(1, Number((await searchParams).page) || 1);
	const pageSize = Math.max(1, Number((await searchParams).pageSize) || DEFAULT_PAGE_SIZE);
	const keyword = (await searchParams).keyword?.trim();

	const [placeResponse, kolResponse] = await Promise.all([
		apiPlaceList({ current, pageSize, name: keyword }),
		apiKolList({ current: 1, pageSize: 6 })
	]);

	const places = placeResponse.data || [];
	const kols = kolResponse.data || [];
	const total = placeResponse.total || places.length;
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
			breadcrumbs={[{ label: "Địa điểm", href: "/place" }]}
		>
			<div className="space-y-6">
				<KolList 
					kolList={kols} 
					placeId="" 
					placeName="các địa điểm" 
				/>

				<div className="grid gap-4 rounded-xl bg-gradient-to-br from-indigo-50 via-white to-slate-50 p-5 shadow-sm md:grid-cols-2">
					<div className="flex flex-col gap-3 rounded-lg border border-indigo-100 bg-white/70 p-4 shadow-sm">
						<div className="inline-flex w-fit items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
								<path d="M2.5 5.75A2.25 2.25 0 014.75 3.5h10.5a2.25 2.25 0 012.25 2.25v8.5A2.25 2.25 0 0115.25 16.5H4.75A2.25 2.25 0 012.5 14.25v-8.5zm2.25-.75a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h10.5a.75.75 0 00.75-.75v-8.5a.75.75 0 00-.75-.75H4.75z" />
								<path d="M5.75 6.5a.75.75 0 01.75-.75h7a.75.75 0 010 1.5h-7a.75.75 0 01-.75-.75zm0 3.25a.75.75 0 01.75-.75h4a.75.75 0 010 1.5h-4a.75.75 0 01-.75-.75z" />
							</svg>
							Booking & review
						</div>
						<h2 className="text-lg font-semibold text-slate-900">Đặt lịch và chia sẻ trải nghiệm</h2>
						<p className="text-sm text-slate-600">
							Hỏi lịch trải nghiệm, đặt dịch vụ hoặc gửi review nhanh cho địa điểm bạn đã ghé thăm để giúp cộng đồng có thêm thông tin cập nhật.
						</p>
						<div className="flex flex-col gap-2 text-sm text-slate-600">
							<span>• Gửi review kèm hình ảnh, video.</span>
							<span>• Nhận phản hồi từ quản lý địa điểm trong 24h.</span>
							<span>• Đặt dịch vụ trực tiếp qua đội ngũ Waffle.</span>
						</div>
						<div className="flex flex-wrap gap-2 pt-1">
							<Link
								href="/contact"
								className="inline-flex hover:text-white items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
							>
								Gửi review / đặt lịch
							</Link>
							<Link
								href="/user/login"
								className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:border-indigo-300 hover:bg-indigo-50"
							>
								Theo dõi yêu cầu
							</Link>
						</div>
					</div>
					<div className="flex flex-col gap-3 rounded-lg border border-emerald-100 bg-white/70 p-4 shadow-sm">
						<div className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
								<path d="M10 2a.75.75 0 01.67.415l2.167 4.39 4.846.704a.75.75 0 01.416 1.279l-3.506 3.416.828 4.826a.75.75 0 01-1.088.791L10 15.874l-4.333 2.273a.75.75 0 01-1.088-.79l.828-4.827-3.506-3.416a.75.75 0 01.415-1.279l4.847-.704L9.33 2.415A.75.75 0 0110 2z" />
							</svg>
							Đăng ký Influencer
						</div>
						<h2 className="text-lg font-semibold text-slate-900">Trở thành người tạo ảnh hưởng</h2>
						<p className="text-sm text-slate-600">
							Đăng ký làm influencer để nhận brief hợp tác, ưu đãi trải nghiệm và được ghim nổi bật trên danh sách KOL tại các địa điểm bạn yêu thích.
						</p>
						<div className="flex flex-col gap-2 text-sm text-slate-600">
							<span>• Hồ sơ kiểm duyệt trong 48h.</span>
							<span>• Nhận thư mời hợp tác và quyền truy cập tài liệu brand.</span>
							<span>• Theo dõi hiệu quả chiến dịch trên hồ sơ cá nhân.</span>
						</div>
						<div className="flex flex-wrap gap-2 pt-1">
							<Link
								href="/influencer/register"
								className="inline-flex items-center gap-2 hover:text-white rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
							>
								Đăng ký ngay
							</Link>
							<Link
								href="/user/profile"
								className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-50"
							>
								Xem hướng dẫn
							</Link>
						</div>
					</div>
				</div>
				<div className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm">
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
								<SearchOutlined /> Tìm kiếm
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
						<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
							{places.map((place) => {
								const updatedAt = place.modifiedDate
									? new Date(place.modifiedDate).toLocaleDateString("vi-VN")
									: "Chưa cập nhật";

								return (
									<div
										key={place.id}
										className="group flex h-full flex-col overflow-hidden rounded-xl bg-white/85 backdrop-blur transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
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
											<Link href={`/place/${place.normalizedName}`} className="hover:underline">
												<h2 className="text-lg font-semibold text-slate-900 line-clamp-2">{place.name}</h2>
											</Link>
											<p className="text-sm text-slate-600 line-clamp-2">
												<EnvironmentOutlined /> {place.districtName}, {place.provinceName}
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
										<ArrowLeftOutlined /> Trước
									</Link>
									<Link
										href={buildPageHref(Math.min(totalPages, current + 1))}
										aria-disabled={current === totalPages}
										className={`rounded-lg px-3 py-2 text-white font-semibold transition ${current === totalPages ? "cursor-not-allowed bg-slate-100 text-slate-400" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}
									>
										Sau <ArrowRightOutlined />
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
