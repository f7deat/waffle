"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useState } from "react";
import { CameraOutlined, CloseOutlined, LeftOutlined, LoadingOutlined, ReloadOutlined, RightOutlined, SearchOutlined } from "@ant-design/icons";
import PageContainer from "@/components/layout/page-container";
import { apiGetAlbumPhotos } from "@/services/album";
import { AlbumPhoto } from "@/typings/album";

type AlbumItem = AlbumPhoto & {
	id: string;
	category: string;
};

const categoryPool = ["Du lịch", "Ẩm thực", "Đời sống", "Sự kiện"];

const normalizePhotos = (photos: AlbumPhoto[]): AlbumItem[] => {
	return photos
		.filter((photo) => !!photo?.url)
		.map((photo, index) => ({
			...photo,
			id: `${index}-${photo.url}`,
			category: categoryPool[index % categoryPool.length],
		}));
};

const AlbumPage = () => {
	const [photos, setPhotos] = useState<AlbumItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [activeCategory, setActiveCategory] = useState<string>("Tất cả");
	const [keyword, setKeyword] = useState("");
	const [viewerIndex, setViewerIndex] = useState<number | null>(null);
	const [lastUpdated, setLastUpdated] = useState<string>("");

	const loadPhotos = async () => {
		setIsLoading(true);
		setErrorMessage(null);

		try {
			const response = await apiGetAlbumPhotos({ current: 1, pageSize: 60 });
			const nextPhotos = normalizePhotos(response?.data || []);
			setPhotos(nextPhotos);
			setLastUpdated(new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }));
		} catch {
			setErrorMessage("Không thể tải album lúc này. Vui lòng thử lại.");
			setPhotos([]);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		loadPhotos();
	}, []);

	const categories = useMemo(() => {
		return ["Tất cả", ...Array.from(new Set(photos.map((item) => item.category)))];
	}, [photos]);

	const filteredPhotos = useMemo(() => {
		return photos.filter((item) => {
			const categoryMatched = activeCategory === "Tất cả" || item.category === activeCategory;
			const keywordMatched =
				!keyword.trim() ||
				item.url.toLowerCase().includes(keyword.trim().toLowerCase()) ||
				item.category.toLowerCase().includes(keyword.trim().toLowerCase());

			return categoryMatched && keywordMatched;
		});
	}, [activeCategory, keyword, photos]);

	const openViewer = (index: number) => setViewerIndex(index);
	const closeViewer = () => setViewerIndex(null);

	const goPrev = () => {
		if (viewerIndex === null || filteredPhotos.length === 0) return;
		setViewerIndex((viewerIndex - 1 + filteredPhotos.length) % filteredPhotos.length);
	};

	const goNext = () => {
		if (viewerIndex === null || filteredPhotos.length === 0) return;
		setViewerIndex((viewerIndex + 1) % filteredPhotos.length);
	};

	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if (viewerIndex === null) return;

			if (event.key === "Escape") closeViewer();
			if (event.key === "ArrowLeft") goPrev();
			if (event.key === "ArrowRight") goNext();
		};

		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [viewerIndex, filteredPhotos.length]);

	const activePhoto = viewerIndex !== null ? filteredPhotos[viewerIndex] : null;

	return (
		<PageContainer breadcrumbs={[{ label: "Album", href: "/album" }]}> 
			<div className="space-y-6 pb-6">
				<section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-amber-50 via-white to-rose-50 p-6 shadow-sm">
					<div className="absolute -right-16 -top-12 h-48 w-48 rounded-full bg-amber-200/30 blur-2xl" />
					<div className="absolute -left-10 -bottom-16 h-44 w-44 rounded-full bg-rose-200/30 blur-2xl" />

					<div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
						<div className="space-y-2">
							<p className="inline-flex w-fit items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-amber-800">
								<CameraOutlined /> Thư viện ảnh
							</p>
							<h1 className="text-2xl font-bold text-slate-900 md:text-3xl">Album khoảnh khắc DefZone</h1>
							<p className="max-w-2xl text-sm text-slate-600 md:text-base">
								Bộ sưu tập ảnh tổng hợp từ cộng đồng và hệ sinh thái nội dung DefZone. Bạn có thể tìm nhanh theo từ khóa, lọc nhóm ảnh và xem dạng lightbox.
							</p>
						</div>

						<div className="grid grid-cols-2 gap-3 sm:flex sm:items-center sm:gap-4">
							<div className="rounded-xl border border-white/70 bg-white/80 px-4 py-2 text-center shadow-sm">
								<p className="text-xs uppercase tracking-[0.08em] text-slate-500">Ảnh hiển thị</p>
								<p className="text-xl font-semibold text-slate-900">{filteredPhotos.length}</p>
							</div>
							<div className="rounded-xl border border-white/70 bg-white/80 px-4 py-2 text-center shadow-sm">
								<p className="text-xs uppercase tracking-[0.08em] text-slate-500">Cập nhật</p>
								<p className="text-sm font-semibold text-slate-900">{lastUpdated || "--:--"}</p>
							</div>
						</div>
					</div>
				</section>

				<section className="rounded-2xl bg-white p-4 shadow-sm md:p-5">
					<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
						<div className="relative w-full md:w-80">
							<SearchOutlined className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
							<input
								type="text"
								value={keyword}
								onChange={(event) => setKeyword(event.target.value)}
								placeholder="Tìm theo URL hoặc chủ đề..."
								className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm shadow-sm transition focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
							/>
						</div>

						<button
							type="button"
							onClick={loadPhotos}
							className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-amber-300 hover:bg-amber-50"
						>
							<ReloadOutlined /> Làm mới
						</button>
					</div>

					<div className="mt-4 flex flex-wrap gap-2">
						{categories.map((category) => (
							<button
								key={category}
								type="button"
								onClick={() => setActiveCategory(category)}
								className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
									activeCategory === category
										? "bg-slate-900 text-white"
										: "bg-slate-100 text-slate-700 hover:bg-slate-200"
								}`}
							>
								{category}
							</button>
						))}
					</div>
				</section>

				{isLoading ? (
					<div className="flex min-h-56 items-center justify-center rounded-2xl bg-white p-6 text-slate-500 shadow-sm">
						<p className="inline-flex items-center gap-2 text-sm font-medium">
							<LoadingOutlined spin /> Đang tải album...
						</p>
					</div>
				) : errorMessage ? (
					<div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center shadow-sm">
						<p className="text-sm font-semibold text-rose-700">{errorMessage}</p>
						<button
							type="button"
							onClick={loadPhotos}
							className="mt-3 inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
						>
							<ReloadOutlined /> Thử lại
						</button>
					</div>
				) : filteredPhotos.length === 0 ? (
					<div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
						<p className="text-sm font-semibold text-slate-700">Không tìm thấy ảnh phù hợp.</p>
						<p className="mt-1 text-sm text-slate-500">Thử thay đổi từ khóa hoặc bỏ bộ lọc để xem toàn bộ album.</p>
					</div>
				) : (
					<section className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
						{filteredPhotos.map((photo, index) => (
							<button
								key={photo.id}
								type="button"
								onClick={() => openViewer(index)}
								className="group mb-4 w-full break-inside-avoid overflow-hidden rounded-xl bg-slate-100 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
							>
								<div className="relative">
									<img
										src={photo.url}
										alt={`Album ${index + 1}`}
										loading="lazy"
										className="h-auto w-full object-cover transition duration-300 group-hover:scale-[1.02]"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-transparent opacity-0 transition group-hover:opacity-100" />
									<div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white opacity-0 transition group-hover:opacity-100">
										<span className="rounded-full bg-white/20 px-2 py-1 text-xs font-medium backdrop-blur-sm">
											{photo.category}
										</span>
										<span className="text-xs font-semibold">Xem ảnh</span>
									</div>
								</div>
							</button>
						))}
					</section>
				)}
			</div>

			{activePhoto && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm md:p-6" role="dialog" aria-modal="true">
					<button
						type="button"
						onClick={closeViewer}
						className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white transition hover:bg-black/70"
						aria-label="Đóng"
					>
						<CloseOutlined />
					</button>

					<button
						type="button"
						onClick={goPrev}
						className="absolute left-3 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white transition hover:bg-black/70 md:left-6"
						aria-label="Ảnh trước"
					>
						<LeftOutlined />
					</button>

					<div className="w-full max-w-5xl overflow-hidden rounded-xl border border-white/20 bg-black/30">
						<img src={activePhoto.url} alt="Ảnh xem trước" className="max-h-[78vh] w-full object-contain" />
						<div className="flex items-center justify-between gap-3 border-t border-white/15 bg-black/50 px-4 py-3 text-white">
							<div>
								<p className="text-xs uppercase tracking-[0.08em] text-slate-300">{activePhoto.category}</p>
								<p className="text-sm font-semibold">Ảnh {viewerIndex! + 1} / {filteredPhotos.length}</p>
							</div>
							<button
								type="button"
								onClick={goNext}
								className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-3 py-1.5 text-sm font-semibold transition hover:bg-white/10"
							>
								Tiếp <RightOutlined />
							</button>
						</div>
					</div>

					<button
						type="button"
						onClick={goNext}
						className="absolute right-3 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white transition hover:bg-black/70 md:right-6"
						aria-label="Ảnh kế tiếp"
					>
						<RightOutlined />
					</button>
				</div>
			)}
		</PageContainer>
	);
};

export default AlbumPage;
