"use client";

import { apiPlaceList } from "@/services/locations/place";
import { faCheckCircle, faEye, faHeart, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect, useState } from "react";

const pageSize = 10;

const InfluencerPlace: React.FC<{ userName: string }> = ({ userName }) => {
    const [places, setPlaces] = useState<API.PlaceListItem[]>([]);
    const [total, setTotal] = useState(0);
    const [current, setCurrent] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        let isCurrentRequest = true;

        const fetchPlaces = async () => {
            setLoading(true);
            setError(false);

            try {
                const response = await apiPlaceList({
                    influencerUserName: userName,
                    current,
                    pageSize,
                });

                if (isCurrentRequest) {
                    setPlaces(response.data ?? []);
                    setTotal(response.total ?? 0);
                }
            } catch (requestError) {
                console.error("Failed to fetch influencer places:", requestError);
                if (isCurrentRequest) {
                    setPlaces([]);
                    setTotal(0);
                    setError(true);
                }
            } finally {
                if (isCurrentRequest) {
                    setLoading(false);
                }
            }
        };

        fetchPlaces();

        return () => {
            isCurrentRequest = false;
        };
    }, [current, retryCount, userName]);

    const totalPages = Math.ceil(total / pageSize);

    return (
        <div>
            {loading ? (
                <div className="py-8 text-center text-sm text-on-surface-variant" role="status">
                    Đang tải địa điểm...
                </div>
            ) : error ? (
                <div role="alert" className="py-8 text-center text-sm text-red-600">
                    <p>Không thể tải danh sách địa điểm.</p>
                    <button
                        type="button"
                        onClick={() => setRetryCount((count) => count + 1)}
                        className="mt-2 font-semibold underline"
                    >
                        Thử lại
                    </button>
                </div>
            ) : places.length === 0 ? (
                <p className="py-8 text-center text-sm text-on-surface-variant">
                    Chưa có địa điểm nào.
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {places.map((place) => (
                        <article key={place.id} className="flex flex-col bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group">
                            <div className="relative h-56 w-full overflow-hidden">
                                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt={place.name} src={place.thumbnail} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                                    <span className="px-2.5 py-1 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm font-semibold backdrop-blur-md">Cafe Vibe</span>
                                    <span className="px-2 py-0.5 rounded-full bg-surface-container-lowest/90 text-on-surface font-label-sm text-label-sm font-semibold flex items-center gap-1 shadow-xs">
                                        <span className="material-symbols-outlined text-[13px] text-primary">
                                            <FontAwesomeIcon icon={faCheckCircle} />
                                        </span> Độc lập
                                    </span>
                                </div>
                                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-center text-on-surface shadow-sm">
                                    <span className="material-symbols-outlined text-[18px]"><FontAwesomeIcon icon={faHeart} /></span>
                                </div>
                                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-on-primary">
                                    <span className="font-label-sm text-label-sm flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[14px]"><FontAwesomeIcon icon={faEye} /></span> 320K lượt xem
                                    </span>
                                    <span className="font-label-sm text-label-sm flex items-center gap-1 bg-tertiary-container/90 px-2 py-0.5 rounded text-on-tertiary font-bold">
                                        ★ 9.5 / 10
                                    </span>
                                </div>
                            </div>
                            <div className="p-4 flex flex-col flex-1 justify-between">
                                <div>
                                    <div className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 mb-1">
                                        <span className="material-symbols-outlined text-[14px] text-secondary"><FontAwesomeIcon icon={faLocationDot} /></span> 33 Đinh Tiên Hoàng, Hồng Bàng
                                    </div>
                                    <Link href={`/place/${place.normalizedName}`}>
                                        <h3 className="font-semibold text-title text-on-surface group-hover:text-primary transition-colors line-clamp-2">
                                            {place.name}
                                        </h3>
                                    </Link>
                                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 line-clamp-2">
                                        {place.description}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between pt-3 mt-3 border-t border-surface-variant/40 font-label-sm text-label-sm text-on-surface-variant">
                                    <span>Khoảng giá: 45K - 85K</span>
                                    <span className="text-primary font-semibold hover:underline">Xem video review →</span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
            {totalPages > 1 && !error && (
                <nav aria-label="Phân trang địa điểm" className="mt-8 flex items-center justify-center gap-3">
                    <button
                        type="button"
                        onClick={() => setCurrent((page) => Math.max(1, page - 1))}
                        disabled={current === 1 || loading}
                        className="rounded-lg border border-surface-variant px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        ← Trước
                    </button>
                    <span className="text-sm text-on-surface-variant" aria-live="polite">
                        Trang {current} / {totalPages}
                    </span>
                    <button
                        type="button"
                        onClick={() => setCurrent((page) => Math.min(totalPages, page + 1))}
                        disabled={current === totalPages || loading}
                        className="rounded-lg border border-surface-variant px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Sau →
                    </button>
                </nav>
            )}
        </div>
    )
}

export default InfluencerPlace;