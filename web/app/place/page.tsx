/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import PageContainer from "@/components/layout/page-container";
import { apiArticleList } from "@/services/article";
import { apiKolList } from "@/services/kol/kol";
import { apiDistrictList } from "@/services/locations/district";
import { apiPlaceList } from "@/services/locations/place";
import { faArrowLeft, faArrowRight, faMapMarkerAlt, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type SearchParams = Promise<{
	page?: string;
	pageSize?: string;
	keyword?: string;
	districtId?: string;
	minPrice?: string;
	maxPrice?: string;
	hasOpeningHours?: string;
	amenity?: string;
	sortBy?: string;
	view?: string;
}>;

const DEFAULT_PAGE_SIZE = 12;

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: "Địa điểm - DefZone.Net",
		description: "Khám phá địa điểm ăn uống, vui chơi và trải nghiệm được cộng đồng chia sẻ.",
		openGraph: {
			title: "Địa điểm",
			description: "Khám phá địa điểm ăn uống, vui chơi và trải nghiệm được cộng đồng chia sẻ.",
		},
	};
}

const parseNumber = (value?: string) => {
	if (!value) return undefined;
	const number = Number(value);
	return Number.isFinite(number) ? number : undefined;
};

const formatPrice = (value?: number) =>
	value == null ? "" : `${new Intl.NumberFormat("vi-VN").format(value)}đ`;

const Page = async ({ searchParams }: { searchParams: SearchParams }) => {
	const search = await searchParams;
	const current = Math.max(1, Math.floor(parseNumber(search.page) || 1));
	const pageSize = Math.min(48, Math.max(1, Math.floor(parseNumber(search.pageSize) || DEFAULT_PAGE_SIZE)));
	const keyword = search.keyword?.trim() || "";
	const districtId = parseNumber(search.districtId);
	const minPrice = parseNumber(search.minPrice);
	const maxPrice = parseNumber(search.maxPrice);
	const hasOpeningHours = search.hasOpeningHours === "true";
	const amenity = search.amenity?.trim() || "";
	const sortBy = search.sortBy || "recommended";
	const view = search.view === "map" ? "map" : "list";

	const [placeResponse, districtResponse, kolResponse, articleResponse] = await Promise.all([
		apiPlaceList({
			current,
			pageSize,
			name: keyword || undefined,
			districtId,
			minPrice,
			maxPrice,
			hasOpeningHours: hasOpeningHours || undefined,
			amenity: amenity || undefined,
			sortBy,
		}),
		apiDistrictList({ current: 1, pageSize: 100 }),
		apiKolList({ current: 1, pageSize: 3 }),
		apiArticleList({ current: 1, pageSize: 2, name: keyword || undefined }),
	]);

	const places = placeResponse.data || [];
	const districts = districtResponse.data || [];
	const creators = kolResponse.data || [];
	const articles = articleResponse.data || [];
	const total = placeResponse.total || 0;
	const totalPages = Math.max(1, Math.ceil(total / pageSize));
	const selectedDistrict = districts.find((district) => district.id === districtId);

	const activeQuery: Record<string, string> = {};
	if (keyword) activeQuery.keyword = keyword;
	if (districtId) activeQuery.districtId = String(districtId);
	if (minPrice != null) activeQuery.minPrice = String(minPrice);
	if (maxPrice != null) activeQuery.maxPrice = String(maxPrice);
	if (hasOpeningHours) activeQuery.hasOpeningHours = "true";
	if (amenity) activeQuery.amenity = amenity;
	if (sortBy !== "recommended") activeQuery.sortBy = sortBy;
	if (pageSize !== DEFAULT_PAGE_SIZE) activeQuery.pageSize = String(pageSize);
	if (view === "map") activeQuery.view = "map";

	const buildHref = (overrides: Record<string, string | number | null | undefined> = {}) => {
		const params: Record<string, string | number | null | undefined> = { ...activeQuery, ...overrides };
		const searchParams = new URLSearchParams();
		Object.entries(params).forEach(([key, value]) => {
			if (value != null && value !== "") searchParams.set(key, String(value));
		});
		const queryString = searchParams.toString();
		return queryString ? `/place?${queryString}` : "/place";
	};

	const mapQuery = places[0]?.latitude != null && places[0]?.longitude != null
		? `${places[0].latitude},${places[0].longitude}`
		: [keyword, selectedDistrict?.name, places[0]?.provinceName].filter(Boolean).join(" ") || "địa điểm du lịch Việt Nam";
	const shownFrom = total === 0 ? 0 : (current - 1) * pageSize + 1;
	const shownTo = Math.min(current * pageSize, total);

	return (
		<PageContainer breadcrumbs={[{ label: "Địa điểm", href: "/place" }]}>
			<div className="-mx-4 -mt-4 min-h-screen bg-surface text-on-surface sm:-mx-6 lg:-mx-8">
				<section className="border-b border-surface-variant/70 bg-surface-container-low/80 py-6 backdrop-blur-sm">
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
						<form action="/place" method="get" className="flex flex-col gap-4 lg:flex-row lg:items-center">
							{minPrice != null && <input type="hidden" name="minPrice" value={minPrice} />}
							{maxPrice != null && <input type="hidden" name="maxPrice" value={maxPrice} />}
							{hasOpeningHours && <input type="hidden" name="hasOpeningHours" value="true" />}
							{amenity && <input type="hidden" name="amenity" value={amenity} />}
							{pageSize !== DEFAULT_PAGE_SIZE && <input type="hidden" name="pageSize" value={pageSize} />}
							{view === "map" && <input type="hidden" name="view" value="map" />}

							<div className="flex min-w-0 flex-1 items-center gap-3 rounded-full bg-white px-4 py-2.5 shadow-sm ring-1 ring-black/5">
								<span aria-hidden="true" className="text-xl">🍜</span>
								<input
									type="search"
									name="keyword"
									defaultValue={keyword}
									placeholder="Tìm địa điểm, món ngon..."
									className="min-w-0 flex-1 bg-transparent text-sm text-on-surface placeholder:text-outline focus:outline-none sm:text-base"
								/>
								<label className="flex items-center gap-2 border-l border-surface-variant pl-3 text-sm text-on-surface-variant">
									<FontAwesomeIcon icon={faMapMarkerAlt} className="text-secondary" />
									<select
										name="districtId"
										defaultValue={districtId || ""}
										className="max-w-24 bg-transparent py-1 focus:outline-none sm:max-w-36"
									>
										<option value="">Mọi khu vực</option>
										{districts.map((district) => (
											<option key={district.id} value={district.id}>{district.name}</option>
										))}
									</select>
								</label>
								<button
									type="submit"
									aria-label="Tìm kiếm"
									className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white transition hover:bg-on-primary-fixed-variant"
								>
									<FontAwesomeIcon icon={faSearch} />
								</button>
							</div>

							<div className="flex items-center justify-between gap-3 sm:justify-end">
								<label className="flex items-center gap-2 rounded-full bg-white px-4 py-3 text-sm shadow-sm">
									<span className="text-outline">Sắp xếp</span>
									<select name="sortBy" defaultValue={sortBy} className="max-w-40 bg-transparent font-semibold text-secondary focus:outline-none">
										<option value="recommended">Đề xuất</option>
										<option value="newest">Mới cập nhật</option>
										<option value="price-low">Giá thấp trước</option>
										<option value="price-high">Giá cao trước</option>
									</select>
								</label>
								<div className="inline-flex rounded-full bg-white p-1 shadow-sm">
									<Link
										href={buildHref({ view: null, page: 1 })}
										aria-current={view === "list" ? "page" : undefined}
										className={`rounded-full px-3 py-2 text-sm font-semibold ${view === "list" ? "bg-secondary text-white" : "text-on-surface-variant hover:bg-surface-container-low"}`}
									>
										Danh sách
									</Link>
									<Link
										href={buildHref({ view: "map", page: 1 })}
										aria-current={view === "map" ? "page" : undefined}
										className={`rounded-full px-3 py-2 text-sm font-semibold ${view === "map" ? "bg-secondary text-white" : "text-on-surface-variant hover:bg-surface-container-low"}`}
									>
										Bản đồ
									</Link>
								</div>
							</div>
						</form>

						<div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
							<p className="text-on-surface-variant">
								Tìm thấy <strong className="text-primary">{total.toLocaleString("vi-VN")} địa điểm</strong>
								{keyword && <> phù hợp với <strong className="text-on-surface">“{keyword}”</strong></>}
								{selectedDistrict && <> tại <strong className="text-secondary">{selectedDistrict.name}</strong></>}
							</p>
							{Object.keys(activeQuery).length > 0 && (
								<Link href="/place" className="font-semibold text-primary hover:underline">Xóa bộ lọc</Link>
							)}
						</div>

						<nav aria-label="Danh mục nội dung" className="mt-4 flex gap-2 overflow-x-auto pb-1">
							<a href="#places" className="whitespace-nowrap rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-white">Địa điểm <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5">{total}</span></a>
							<a href="#creators" className="whitespace-nowrap rounded-full bg-white px-4 py-2 text-sm font-medium text-on-surface-variant shadow-sm hover:bg-surface-container-low">Reviewer <span className="ml-1 rounded-full bg-surface-container px-2 py-0.5">{kolResponse.total || creators.length}</span></a>
							<a href="#guides" className="whitespace-nowrap rounded-full bg-white px-4 py-2 text-sm font-medium text-on-surface-variant shadow-sm hover:bg-surface-container-low">Cẩm nang <span className="ml-1 rounded-full bg-surface-container px-2 py-0.5">{articleResponse.total || articles.length}</span></a>
						</nav>
					</div>
				</section>

				<div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-12 lg:px-8">
					<aside className="flex flex-col gap-5 lg:col-span-4">
						<section className="rounded-2xl bg-white p-5 shadow-sm">
							<div className="flex items-center justify-between border-b border-surface-variant/70 pb-4">
								<h2 className="flex items-center gap-2 text-lg font-bold"><span aria-hidden="true">☷</span>Bộ lọc địa điểm</h2>
								<Link href="/place" className="text-sm font-semibold text-primary hover:underline">Thiết lập lại</Link>
							</div>

							<div className="mt-5">
								<h3 className="mb-3 text-sm font-semibold">Quận / huyện</h3>
								<div className="grid grid-cols-2 gap-2">
									<Link
										href={buildHref({ districtId: null, page: 1 })}
										className={`rounded-lg px-3 py-2 text-sm ${!districtId ? "bg-secondary text-white" : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"}`}
									>
										Tất cả khu vực
									</Link>
									{districts.slice(0, 9).map((district) => (
										<Link
											key={district.id}
											href={buildHref({ districtId: district.id, page: 1 })}
											className={`rounded-lg px-3 py-2 text-sm ${district.id === districtId ? "bg-secondary text-white" : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"}`}
										>
											{district.name}
										</Link>
									))}
								</div>
							</div>

							<div className="mt-6 border-t border-surface-variant/70 pt-5">
								<h3 className="mb-3 text-sm font-semibold">Mức giá tham khảo</h3>
								<div className="flex flex-wrap gap-2">
									<Link href={buildHref({ minPrice: null, maxPrice: 50000, page: 1 })} className={`rounded-full px-3 py-1.5 text-sm ${maxPrice === 50000 ? "bg-secondary text-white" : "bg-surface-container-low hover:bg-surface-container"}`}>Dưới 50.000đ</Link>
									<Link href={buildHref({ minPrice: 50000, maxPrice: 150000, page: 1 })} className={`rounded-full px-3 py-1.5 text-sm ${minPrice === 50000 && maxPrice === 150000 ? "bg-secondary text-white" : "bg-surface-container-low hover:bg-surface-container"}`}>50.000–150.000đ</Link>
									<Link href={buildHref({ minPrice: 150000, maxPrice: null, page: 1 })} className={`rounded-full px-3 py-1.5 text-sm ${minPrice === 150000 && maxPrice == null ? "bg-secondary text-white" : "bg-surface-container-low hover:bg-surface-container"}`}>Trên 150.000đ</Link>
								</div>
							</div>

							<div className="mt-6 border-t border-surface-variant/70 pt-5">
								<h3 className="mb-3 text-sm font-semibold">Thông tin địa điểm</h3>
								<div className="flex flex-col gap-2">
									<Link href={buildHref({ hasOpeningHours: hasOpeningHours ? null : "true", page: 1 })} className="flex items-center justify-between rounded-lg bg-surface-container-low px-3 py-2.5 text-sm hover:bg-surface-container">
										<span>Đã cập nhật giờ mở cửa</span><span className={hasOpeningHours ? "font-bold text-secondary" : "text-outline"}>{hasOpeningHours ? "Đang lọc" : "Lọc"}</span>
									</Link>
									{["Chỗ đậu xe", "Wi-Fi", "Thanh toán QR"].map((item) => (
										<Link key={item} href={buildHref({ amenity: amenity === item ? null : item, page: 1 })} className="flex items-center justify-between rounded-lg bg-surface-container-low px-3 py-2.5 text-sm hover:bg-surface-container">
											<span>{item}</span><span className={amenity === item ? "font-bold text-secondary" : "text-outline"}>{amenity === item ? "Đang lọc" : "Lọc"}</span>
										</Link>
									))}
								</div>
							</div>
						</section>

						<section className="overflow-hidden rounded-2xl bg-gradient-to-br from-secondary to-on-secondary-fixed p-5 text-white shadow-sm">
							<div aria-hidden="true" className="text-2xl">📍</div>
							<h2 className="mt-3 text-lg font-bold">Gợi ý địa điểm mới</h2>
							<p className="mt-2 text-sm text-white/80">Chia sẻ địa điểm bạn yêu thích để cộng đồng có thêm lựa chọn thú vị.</p>
							<Link href="/contact" className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-secondary transition hover:bg-secondary-fixed">
								Đề xuất địa điểm <span className="ml-2" aria-hidden="true">→</span>
							</Link>
						</section>

						<section className="overflow-hidden rounded-2xl bg-white p-4 shadow-sm">
							<div className="mb-3 flex items-center justify-between">
								<h2 className="font-semibold">Khám phá trên bản đồ</h2>
								<Link href={buildHref({ view: "map", page: 1 })} className="text-sm font-semibold text-primary hover:underline">Mở rộng</Link>
							</div>
							<iframe
								title="Bản đồ khu vực địa điểm"
								src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
								className="h-48 w-full rounded-xl border-0"
								loading="lazy"
								referrerPolicy="no-referrer-when-downgrade"
							/>
							<p className="mt-3 text-xs leading-5 text-on-surface-variant">Bản đồ tập trung theo từ khóa và khu vực bạn đang tìm kiếm.</p>
						</section>
					</aside>

					<main className="flex min-w-0 flex-col gap-7 lg:col-span-8">
						<section id="places" className="scroll-mt-6">
							<div className="mb-4 flex flex-wrap items-end justify-between gap-3">
								<div>
									<p className="text-xs font-bold uppercase tracking-[0.16em] text-secondary">Khám phá</p>
									<h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Địa điểm được cộng đồng quan tâm</h1>
								</div>
								<span className="rounded-full bg-primary-fixed px-3 py-1 text-xs font-bold uppercase tracking-wide text-on-primary-fixed-variant">{total.toLocaleString("vi-VN")} kết quả</span>
							</div>

							{view === "map" && places.length > 0 && (
								<div className="mb-4 overflow-hidden rounded-2xl bg-white p-3 shadow-sm">
									<iframe
										title="Bản đồ kết quả tìm kiếm"
										src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
										className="h-72 w-full rounded-xl border-0 sm:h-96"
										loading="lazy"
										referrerPolicy="no-referrer-when-downgrade"
									/>
									<p className="px-2 pt-3 text-sm text-on-surface-variant">Chọn một địa điểm bên dưới để xem đường đi và vị trí chi tiết.</p>
								</div>
							)}

							{places.length === 0 ? (
								<div className="rounded-2xl border border-dashed border-outline-variant bg-white px-6 py-14 text-center shadow-sm">
									<div className="text-4xl" aria-hidden="true">🧭</div>
									<h2 className="mt-4 text-lg font-bold">Chưa tìm thấy địa điểm phù hợp</h2>
									<p className="mt-2 text-sm text-on-surface-variant">Hãy thử từ khóa khác hoặc bỏ bớt một vài bộ lọc.</p>
									<Link href="/place" className="mt-5 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-on-primary-fixed-variant">Xem tất cả địa điểm</Link>
								</div>
							) : (
								<div className="flex flex-col gap-4">
									{places.map((place, index) => {
										const price = place.priceFrom != null || place.priceTo != null
											? `${formatPrice(place.priceFrom) || "—"}${place.priceTo != null ? ` – ${formatPrice(place.priceTo)}` : ""}`
											: null;
										const address = [place.address, place.districtName, place.provinceName].filter(Boolean).join(", ");
										const mapsUrl = place.latitude != null && place.longitude != null
											? `https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`
											: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([place.name, address].filter(Boolean).join(" "))}`;

										return (
											<article key={place.id} className="group flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:flex-row">
												<Link href={`/place/${place.normalizedName}`} className="relative block h-52 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-primary-fixed to-secondary-fixed sm:h-auto sm:w-5/12">
													{place.thumbnail ? (
														<img src={place.thumbnail} alt={place.name} className="h-full min-h-52 w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
													) : (
														<div className="flex h-full min-h-52 items-center justify-center text-5xl" aria-hidden="true">📍</div>
													)}
													{index === 0 && sortBy === "recommended" && (
														<span className="absolute left-3 top-3 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-white shadow">Được quan tâm</span>
													)}
												</Link>
												<div className="flex min-w-0 flex-1 flex-col">
													<div className="flex flex-wrap items-center justify-between gap-2">
														<span className="text-xs font-bold uppercase tracking-wider text-secondary">{[place.districtName, place.provinceName].filter(Boolean).join(" · ") || "Địa điểm cộng đồng"}</span>
														{place.openingHours && <span className="rounded-full bg-secondary-container px-2.5 py-1 text-xs font-semibold text-on-secondary-fixed-variant">Giờ mở cửa: {place.openingHours}</span>}
													</div>
													<Link href={`/place/${place.normalizedName}`} className="mt-2 text-xl font-bold leading-snug text-on-surface transition hover:text-primary">{place.name}</Link>
													{address && (
														<p className="mt-2 flex items-start gap-2 text-sm text-on-surface-variant">
															<FontAwesomeIcon icon={faMapMarkerAlt} className="mt-1 shrink-0 text-secondary" />
															<span>{address}</span>
														</p>
													)}
													{price && <p className="mt-2 text-sm font-bold text-primary">Giá tham khảo: {price}</p>}
													{place.description && <p className="mt-3 line-clamp-2 text-sm leading-6 text-on-surface-variant">{place.description}</p>}
													{place.amenities && <p className="mt-2 line-clamp-1 text-xs text-outline">Tiện ích: {place.amenities.split(/\r?\n/).filter(Boolean).join(" · ")}</p>}
													<div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-surface-variant/60 pt-3 sm:mt-4">
														<span className="text-xs text-outline">{(place.viewCount || 0).toLocaleString("vi-VN")} lượt xem</span>
														<div className="flex items-center gap-2">
															<a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="rounded-full bg-surface-container-low px-3 py-2 text-xs font-semibold text-on-surface-variant transition hover:bg-surface-container">Chỉ đường</a>
															<Link href={`/place/${place.normalizedName}`} className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white transition hover:bg-on-primary-fixed-variant">Xem chi tiết <span aria-hidden="true">→</span></Link>
														</div>
													</div>
												</div>
											</article>
										);
									})}
								</div>
							)}

							{totalPages > 1 && (
								<nav aria-label="Phân trang" className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-surface-variant/70 pt-5 sm:flex-row">
									<p className="text-sm text-on-surface-variant">Đang hiển thị <strong className="text-on-surface">{shownFrom}–{shownTo}</strong> trong <strong className="text-on-surface">{total}</strong> địa điểm</p>
									<div className="flex items-center gap-2">
										<Link href={buildHref({ page: Math.max(1, current - 1) })} aria-disabled={current <= 1} className={`rounded-full px-4 py-2 text-sm font-semibold ${current <= 1 ? "pointer-events-none bg-surface-container text-outline" : "bg-white text-on-surface shadow-sm hover:bg-surface-container-low"}`}>
											<FontAwesomeIcon icon={faArrowLeft} /> <span className="ml-1">Trước</span>
										</Link>
										<span className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-white">{current} / {totalPages}</span>
										<Link href={buildHref({ page: Math.min(totalPages, current + 1) })} aria-disabled={current >= totalPages} className={`rounded-full px-4 py-2 text-sm font-semibold ${current >= totalPages ? "pointer-events-none bg-surface-container text-outline" : "bg-white text-on-surface shadow-sm hover:bg-surface-container-low"}`}>
											<span className="mr-1">Sau</span> <FontAwesomeIcon icon={faArrowRight} />
										</Link>
									</div>
								</nav>
							)}
						</section>

						<section id="creators" className="scroll-mt-6 rounded-2xl bg-surface-container-low p-5 sm:p-6">
							<div className="mb-4 flex flex-wrap items-end justify-between gap-3">
								<div>
									<p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Người chia sẻ</p>
									<h2 className="mt-1 text-xl font-bold">Reviewer & nhà sáng tạo</h2>
								</div>
								<Link href="/influencer" className="text-sm font-semibold text-secondary hover:underline">Khám phá thêm <span aria-hidden="true">→</span></Link>
							</div>
							{creators.length === 0 ? (
								<p className="rounded-xl bg-white p-5 text-sm text-on-surface-variant">Chưa có nhà sáng tạo nào được hiển thị.</p>
							) : (
								<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
									{creators.map((creator) => (
										<article key={creator.id} className="flex flex-col items-center rounded-xl bg-white p-4 text-center shadow-sm">
											{creator.avatar ? <img src={creator.avatar} alt={creator.name} className="h-16 w-16 rounded-full object-cover" loading="lazy" /> : <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-fixed text-2xl" aria-hidden="true">👤</div>}
											<h3 className="mt-3 font-bold">{creator.name}</h3>
											<p className="mt-1 text-xs text-secondary">{creator.userName ? `@${creator.userName}` : creator.category}</p>
											<p className="mt-2 line-clamp-2 text-sm text-on-surface-variant">{creator.bio}</p>
											<p className="mt-2 text-xs text-outline">{(creator.followers || 0).toLocaleString("vi-VN")} người theo dõi</p>
										</article>
									))}
								</div>
							)}
						</section>

						<section id="guides" className="scroll-mt-6">
							<div className="mb-4 flex items-end justify-between gap-3">
								<div>
									<p className="text-xs font-bold uppercase tracking-[0.16em] text-secondary">Đọc & khám phá</p>
									<h2 className="mt-1 text-xl font-bold">Cẩm nang liên quan</h2>
								</div>
								<Link href="/article" className="text-sm font-semibold text-secondary hover:underline">Tất cả bài viết <span aria-hidden="true">→</span></Link>
							</div>
							{articles.length === 0 ? (
								<p className="rounded-2xl bg-white p-5 text-sm text-on-surface-variant shadow-sm">Chưa có cẩm nang phù hợp với nội dung tìm kiếm.</p>
							) : (
								<div className="grid gap-4 md:grid-cols-2">
									{articles.map((article) => (
										<article key={article.id} className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-md">
											<Link href={`/article/${article.normalizedName}`} className="block">
												{article.thumbnail ? <img src={article.thumbnail} alt={article.name} className="h-44 w-full object-cover" loading="lazy" /> : <div className="flex h-44 items-center justify-center bg-gradient-to-br from-primary-fixed to-secondary-fixed text-4xl" aria-hidden="true">📖</div>}
												<div className="p-4">
													<p className="text-xs font-semibold text-secondary">{article.categoryName || "Cẩm nang"} · {article.viewCount.toLocaleString("vi-VN")} lượt đọc</p>
													<h3 className="mt-2 line-clamp-2 font-bold leading-6">{article.name}</h3>
													{article.description && <p className="mt-2 line-clamp-2 text-sm leading-5 text-on-surface-variant">{article.description}</p>}
												</div>
											</Link>
										</article>
									))}
								</div>
							)}
						</section>
					</main>
				</div>
			</div>
		</PageContainer>
	);
};

export default Page;
