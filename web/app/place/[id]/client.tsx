'use client';

/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { apiPlaceImages } from '@/services/locations/place';
import { apiCatalogTags } from '@/services/catalog';
import Block from '@/components/block';
import PlaceComments from '@/components/place/place-comments';

interface PlaceDetailProps {
    place: API.PlaceDetail;
    relatedPlaces: API.PlaceListItem[];
}

const formatPrice = (value: number) => new Intl.NumberFormat('vi-VN').format(value);

const PlaceDetail: React.FC<PlaceDetailProps> = ({ place, relatedPlaces }) => {
    const [placeImages, setPlaceImages] = useState<API.PlaceImage[]>([]);
    const [tags, setTags] = useState<API.Tag[]>([]);
    const [loadingImages, setLoadingImages] = useState(false);
    const [selectedImage, setSelectedImage] = useState<number | null>(null);
    const [saved, setSaved] = useState(false);
    const [shareMessage, setShareMessage] = useState('');

    const gallery = useMemo(() => {
        const images = placeImages.map((image) => image.url);
        if (place.thumbnail) images.unshift(place.thumbnail);
        return [...new Set(images.filter(Boolean))];
    }, [place.thumbnail, placeImages]);

    useEffect(() => {
        let cancelled = false;
        const fetchPlaceImages = async () => {
            try {
                setLoadingImages(true);
                const data = await apiPlaceImages(place.id);
                if (!cancelled) setPlaceImages(data.data || []);
            } catch (error) {
                console.error('Failed to fetch place images:', error);
                if (!cancelled) setPlaceImages([]);
            } finally {
                if (!cancelled) setLoadingImages(false);
            }
        };
        fetchPlaceImages();
        return () => {
            cancelled = true;
        };
    }, [place.id]);

    useEffect(() => {
        let cancelled = false;
        const fetchTags = async () => {
            try {
                const data = await apiCatalogTags(place.id);
                if (!cancelled) setTags(Array.isArray(data.data) ? data.data : []);
            } catch (error) {
                console.error('Failed to fetch place tags:', error);
                if (!cancelled) setTags([]);
            }
        };
        fetchTags();
        return () => {
            cancelled = true;
        };
    }, [place.id]);

    useEffect(() => {
        setSaved(window.localStorage.getItem(`waffle-place-${place.id}`) === 'saved');
    }, [place.id]);

    useEffect(() => {
        if (selectedImage === null) return;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setSelectedImage(null);
            if (event.key === 'ArrowRight') setSelectedImage((index) => index === null ? null : (index + 1) % gallery.length);
            if (event.key === 'ArrowLeft') setSelectedImage((index) => index === null ? null : (index + gallery.length - 1) % gallery.length);
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [selectedImage, gallery.length]);

    const amenities = (place.amenities || '').split(/\r?\n/).map((value) => value.trim()).filter(Boolean);
    const address = [place.address, place.districtName, place.provinceName].filter(Boolean).join(', ');
    const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address || place.name)}`;
    const contentBlocks = place.content?.blocks || [];

    const toggleSaved = () => {
        const nextSaved = !saved;
        setSaved(nextSaved);
        window.localStorage.setItem(`waffle-place-${place.id}`, nextSaved ? 'saved' : 'unsaved');
    };

    const sharePlace = async () => {
        const url = window.location.href;
        try {
            if (navigator.share) {
                await navigator.share({ title: place.name, url });
            } else {
                await navigator.clipboard.writeText(url);
                setShareMessage('Đã sao chép liên kết');
                window.setTimeout(() => setShareMessage(''), 2500);
            }
        } catch (error) {
            if (error instanceof Error && error.name !== 'AbortError') {
                console.error('Failed to share place:', error);
                setShareMessage('Không thể chia sẻ lúc này');
                window.setTimeout(() => setShareMessage(''), 2500);
            }
        }
    };

    const heroImages = gallery.slice(0, 5);

    return (
        <>
            <section className="mb-7">
                <div className="mb-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{place.name}</h1>
                            {place.categoryName && (
                                <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-800">
                                    {place.categoryName}
                                </span>
                            )}
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
                            {place.viewCount > 0 && (
                                <span className="inline-flex items-center gap-1.5">
                                    <span className="text-slate-400" aria-hidden="true">◉</span>
                                    {place.viewCount.toLocaleString('vi-VN')} lượt xem
                                </span>
                            )}
                            {place.openingHours && <span>◷ {place.openingHours}</span>}
                            {(place.priceFrom != null || place.priceTo != null) && (
                                <span>
                                    ₫ {place.priceFrom != null ? formatPrice(place.priceFrom) : '—'}
                                    {' – '}
                                    {place.priceTo != null ? formatPrice(place.priceTo) : '—'}
                                </span>
                            )}
                            {address && <span className="inline-flex items-center gap-1">⌖ {address}</span>}
                        </div>
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={toggleSaved}
                            aria-pressed={saved}
                            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-orange-300 hover:text-orange-700"
                        >
                            <span aria-hidden="true">{saved ? '♥' : '♡'}</span> {saved ? 'Đã lưu' : 'Lưu địa điểm'}
                        </button>
                        <button
                            type="button"
                            onClick={sharePlace}
                            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-orange-300 hover:text-orange-700"
                        >
                            Chia sẻ
                        </button>
                        <a
                            href={directionsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700"
                        >
                            Chỉ đường
                        </a>
                    </div>
                </div>
                {shareMessage && <p role="status" className="mb-3 text-right text-sm text-slate-600">{shareMessage}</p>}

                <div id="place-gallery" className="relative overflow-hidden rounded-2xl bg-slate-100 shadow-sm">
                    {heroImages.length > 0 ? (
                        <div className="grid h-[300px] grid-cols-2 gap-2 sm:h-[420px] md:grid-cols-4 md:grid-rows-2">
                            {heroImages.map((url, index) => (
                                <button
                                    key={`${url}-${index}`}
                                    type="button"
                                    onClick={() => setSelectedImage(index)}
                                    aria-label={`Mở ảnh ${index + 1} trong thư viện`}
                                    className={`${index === 0 ? 'col-span-2 row-span-2' : 'hidden md:block'} group relative min-h-0 overflow-hidden bg-slate-200`}
                                >
                                    <img
                                        src={url}
                                        alt={`${place.name} - ảnh ${index + 1}`}
                                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                    />
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="flex h-64 items-center justify-center text-slate-500">
                            {loadingImages ? 'Đang tải thư viện ảnh…' : 'Địa điểm chưa có ảnh'}
                        </div>
                    )}
                    {heroImages.length > 0 && (
                        <button
                            type="button"
                            onClick={() => setSelectedImage(0)}
                            className="absolute bottom-4 right-4 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-slate-800 shadow-lg backdrop-blur transition hover:bg-white"
                        >
                            Xem tất cả {gallery.length} ảnh
                        </button>
                    )}
                </div>
            </section>

            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
                <div className="space-y-6 lg:col-span-8">
                    <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-7">
                        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-orange-700">Khám phá địa điểm</p>
                        <h2 className="mb-4 text-2xl font-bold text-slate-950">Thông tin &amp; trải nghiệm</h2>
                        {contentBlocks.length > 0 ? (
                            <div className="prose max-w-none">
                                {contentBlocks.map((block, index) => <Block key={`${block.type}-${index}`} {...block} />)}
                            </div>
                        ) : place.description ? (
                            <p className="whitespace-pre-line leading-7 text-slate-600">{place.description}</p>
                        ) : (
                            <p className="text-slate-500">Thông tin giới thiệu đang được cập nhật.</p>
                        )}
                    </section>

                    {amenities.length > 0 && (
                        <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-7">
                            <h2 className="mb-4 text-xl font-bold text-slate-950">Tiện nghi &amp; đặc điểm</h2>
                            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {amenities.map((amenity) => (
                                    <li key={amenity} className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 text-slate-700">
                                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-700" aria-hidden="true">✓</span>
                                        <span>{amenity}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {tags.length > 0 && (
                        <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-7">
                            <h2 className="mb-4 text-xl font-bold text-slate-950">Chủ đề liên quan</h2>
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag) => (
                                    <Link
                                        key={tag.id}
                                        href={`/search?q=${encodeURIComponent(tag.name)}`}
                                        className="rounded-full bg-orange-50 px-3 py-1.5 text-sm font-medium text-orange-800 transition hover:bg-orange-100"
                                    >
                                        #{tag.name}
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    <PlaceComments placeId={place.id} />
                </div>

                <aside className="space-y-6 lg:sticky lg:top-24 lg:col-span-4">
                    <section className="space-y-5 rounded-2xl bg-white p-5 shadow-sm sm:p-6">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Thông tin cần biết</p>
                            <h2 className="mt-1 text-xl font-bold text-slate-950">{place.name}</h2>
                        </div>
                        <div className="rounded-xl bg-slate-100 p-4">
                            <div className="mb-3 flex h-28 items-center justify-center rounded-lg bg-gradient-to-br from-orange-100 via-amber-50 to-slate-200 text-4xl text-orange-700" aria-hidden="true">⌖</div>
                            <p className="font-semibold text-slate-900">{place.address || 'Chưa cập nhật địa chỉ'}</p>
                            <p className="mt-1 text-sm text-slate-600">{[place.districtName, place.provinceName].filter(Boolean).join(', ')}</p>
                            <a
                                href={directionsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-orange-700 hover:text-orange-900"
                            >
                                Mở bản đồ và chỉ đường <span aria-hidden="true">↗</span>
                            </a>
                        </div>

                        <dl className="space-y-3 text-sm">
                            {place.phoneNumber && (
                                <div className="flex items-center justify-between gap-3">
                                    <dt className="text-slate-500">Điện thoại</dt>
                                    <dd><a href={`tel:${place.phoneNumber}`} className="font-semibold text-orange-700">{place.phoneNumber}</a></dd>
                                </div>
                            )}
                            {place.openingHours && (
                                <div className="flex items-center justify-between gap-3">
                                    <dt className="text-slate-500">Giờ mở cửa</dt>
                                    <dd className="text-right font-semibold text-slate-800">{place.openingHours}</dd>
                                </div>
                            )}
                            {(place.priceFrom != null || place.priceTo != null) && (
                                <div className="flex items-center justify-between gap-3">
                                    <dt className="text-slate-500">Khoảng giá</dt>
                                    <dd className="text-right font-semibold text-slate-800">
                                        {place.priceFrom != null ? formatPrice(place.priceFrom) : '—'}
                                        {' – '}
                                        {place.priceTo != null ? formatPrice(place.priceTo) : '—'} ₫
                                    </dd>
                                </div>
                            )}
                        </dl>

                        {place.phoneNumber && (
                            <a
                                href={`tel:${place.phoneNumber}`}
                                className="block rounded-full bg-orange-600 px-4 py-3 text-center font-semibold text-white transition hover:bg-orange-700"
                            >
                                Gọi địa điểm
                            </a>
                        )}
                        {place.affiliateLink && (
                            <a
                                href={place.affiliateLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block rounded-full border border-slate-200 px-4 py-3 text-center font-semibold text-slate-800 transition hover:bg-slate-50"
                            >
                                Đặt chỗ / xem ưu đãi
                            </a>
                        )}
                    </section>

                    {relatedPlaces.length > 0 && (
                        <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
                            <h2 className="mb-1 text-lg font-bold text-slate-950">Khám phá gần đây</h2>
                            <p className="mb-4 text-sm text-slate-500">Thêm địa điểm cùng khu vực</p>
                            <div className="space-y-3">
                                {relatedPlaces.map((relatedPlace) => (
                                    <Link
                                        key={relatedPlace.id}
                                        href={`/place/${relatedPlace.normalizedName}`}
                                        className="group flex gap-3 rounded-xl bg-slate-50 p-2 transition hover:bg-orange-50"
                                    >
                                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-200">
                                            {relatedPlace.thumbnail && (
                                                <img
                                                    src={relatedPlace.thumbnail}
                                                    alt={relatedPlace.name}
                                                    className="h-full w-full object-cover transition group-hover:scale-105"
                                                />
                                            )}
                                        </div>
                                        <div className="min-w-0 self-center">
                                            <h3 className="line-clamp-2 font-semibold text-slate-800 group-hover:text-orange-800">{relatedPlace.name}</h3>
                                            <p className="mt-1 text-xs text-slate-500">{relatedPlace.districtName || relatedPlace.provinceName}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </aside>
            </div>

            {selectedImage !== null && gallery.length > 0 && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Thư viện ảnh địa điểm"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        type="button"
                        aria-label="Đóng thư viện ảnh"
                        onClick={() => setSelectedImage(null)}
                        className="absolute right-4 top-4 rounded-full bg-white/10 px-4 py-2 text-2xl text-white hover:bg-white/20"
                    >
                        ×
                    </button>
                    {gallery.length > 1 && (
                        <button
                            type="button"
                            aria-label="Ảnh trước"
                            onClick={(event) => {
                                event.stopPropagation();
                                setSelectedImage((selectedImage + gallery.length - 1) % gallery.length);
                            }}
                            className="absolute left-3 z-10 rounded-full bg-white/10 px-4 py-3 text-2xl text-white hover:bg-white/20 sm:left-8"
                        >
                            ‹
                        </button>
                    )}
                    <img
                        src={gallery[selectedImage]}
                        alt={`${place.name} - ảnh ${selectedImage + 1}`}
                        className="max-h-[85vh] max-w-[90vw] object-contain"
                        onClick={(event) => event.stopPropagation()}
                    />
                    {gallery.length > 1 && (
                        <button
                            type="button"
                            aria-label="Ảnh tiếp theo"
                            onClick={(event) => {
                                event.stopPropagation();
                                setSelectedImage((selectedImage + 1) % gallery.length);
                            }}
                            className="absolute right-3 z-10 rounded-full bg-white/10 px-4 py-3 text-2xl text-white hover:bg-white/20 sm:right-8"
                        >
                            ›
                        </button>
                    )}
                    <span className="absolute bottom-4 text-sm text-white/80">{selectedImage + 1} / {gallery.length}</span>
                </div>
            )}
        </>
    );
};

export default PlaceDetail;
