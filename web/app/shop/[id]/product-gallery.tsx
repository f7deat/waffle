"use client";

/* eslint-disable @next/next/no-img-element */
import { useMemo, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faFire, faPlay, faSearchPlus, faStore } from "@fortawesome/free-solid-svg-icons";

type ProductGalleryProps = {
    imageSources: string[];
    productName: string;
    unitInStock?: number;
    hasDiscount: boolean;
    discountPercent: number;
};

const ProductGallery = ({
    imageSources,
    productName,
    unitInStock,
    hasDiscount,
    discountPercent,
}: ProductGalleryProps) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const safeImages = useMemo(() => {
        const cleaned = imageSources.filter(Boolean);
        return cleaned.length > 0 ? cleaned : [];
    }, [imageSources]);

    const activeImage = safeImages[activeIndex] || safeImages[0];
    const hasMultipleImages = safeImages.length > 1;

    const goPrev = () => {
        if (!hasMultipleImages) return;
        setActiveIndex((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1));
    };

    const goNext = () => {
        if (!hasMultipleImages) return;
        setActiveIndex((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1));
    };

    return (
        <>
            <div className="lg:col-span-7 flex flex-col gap-4">
                {/* Main Large Media Stage */}
                <div className="relative w-full aspect-[4/5] sm:aspect-[1/1] lg:aspect-[4/5] rounded-xl overflow-hidden bg-surface-container shadow-sm group">
                    <div
                        className="w-full h-full bg-cover bg-center transition-all duration-500 ease-out"
                        data-alt="Editorial close up shot of a Vietnamese modern reformed Ao Dai made from natural off-white mulberry silk from Ha Dong loom, with delicate hand-embroidered white lotus petal patterns on chest. Soft golden natural daylight highlighting the organic raw slub weave texture, artisanal studio background with earthy pottery and muted sand tones."
                        id="main-product-display"
                        style={{
                            backgroundImage: `url(${activeImage})`
                        }}
                    ></div>
                    {/* Editorial Floating Badges */}
                    <div className="absolute top-4 left-4 flex flex-col items-start gap-2 pointer-events-none">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm shadow-md backdrop-blur-md">
                            <span className="material-symbols-outlined text-[14px] text-tertiary-fixed">
                                <FontAwesomeIcon icon={faCheckCircle} />
                            </span>
                            Nghệ nhân Hà Đông
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-bright/90 text-on-surface font-label-sm text-label-sm shadow-sm backdrop-blur-md">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary-container" />
                            100% Lụa Tơ Tằm Tự Nhiên
                        </span>
                    </div>
                    {/* Video Reel Pill Tag */}
                    <button
                        className="absolute bottom-4 left-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-bright/95 hover:bg-surface-bright text-on-surface shadow-md hover:scale-105 transition-all text-label-sm font-label-sm"
                        type="button"
                    >
                        <span className="material-symbols-outlined text-primary text-[18px]">
                            <FontAwesomeIcon icon={faPlay} />
                        </span>
                        <span>Xem video nghệ nhân dệt vải (0:45s)</span>
                    </button>
                    {/* Expand / Zoom Trigger */}
                    <button
                        aria-label="Phóng to ảnh"
                        className="absolute top-4 right-4 w-9 h-9 rounded-full bg-surface-bright/90 hover:bg-surface-bright text-on-surface flex items-center justify-center shadow-md transition-all"
                        type="button"
                    >
                        <span className="material-symbols-outlined text-[18px]">
                            <FontAwesomeIcon icon={faSearchPlus} />
                        </span>
                    </button>
                </div>
                {/* 5 Interactive Thumbnails Shelf */}
                {
                    hasMultipleImages && (
                        <div className="grid grid-cols-5 gap-2">
                            {
                                safeImages.map((image, index) => (
                                    <button
                                        className={`gallery-thumb relative aspect-square rounded-lg overflow-hidden bg-surface-container shadow-sm p-0.5 transition-all outline-none ${activeIndex === index ? "ring-2 ring-primary" : "hover:ring-1 hover:ring-primary/50"}`}
                                        key={index}
                                        data-target={index}
                                        type="button"
                                        aria-label={`Xem ảnh ${index + 1}`}
                                        onClick={() => setActiveIndex(index)}
                                    >
                                        <div
                                            className="w-full h-full bg-cover bg-center rounded"
                                            data-alt={productName + ` - ${index + 1}`}
                                            style={{
                                                backgroundImage: `url("${image}")`
                                            }}
                                        />
                                        {
                                            activeIndex === index && (
                                                <div className="absolute inset-0 bg-primary/10 rounded pointer-events-none opacity-100 thumb-active-indicator" />
                                            )
                                        }
                                    </button>
                                ))
                            }
                        </div>
                    )
                }

                {/* Artisan Micro-Banner */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container-low mt-space-xs">
                    <div className="flex items-center gap-4">
                        <div
                            className="w-12 h-12 rounded-full bg-cover bg-center shadow-sm flex-shrink-0"
                            data-alt="Portrait of an elderly master silk weaver in Van Phuc silk village smiling beside a traditional handloom workshop filled with wooden spindles."
                            style={{
                                backgroundImage:
                                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBooJe1adPVxAaVJgin9JDJIQRd107bzUD7xhZJ19fxkcHPYMoG7trOvzYZfJBtetC9ZkiMeY7_BPWMpGpFy9wfQvir-qxwT8xAu8MPDyGwhrIv1Z3ZLhSGjWePsowtSiQ4rc5wjXYthTKxTwFUf6Tg2GC94-lU0xLYQPFX694y5wtVx0v-3fwHSmFN1KPmzOwFJEqUZKFFCt6ygyN-O6KTnEuAOrk3NP59UITCAZBR86QY8nWSJexwHw")'
                            }}
                        />
                        <div>
                            <div className="flex items-center gap-1.5">
                                <span className="font-label-lg text-label-lg text-on-surface">
                                    Xưởng Lụa Triệu Thái Vinh
                                </span>
                                <span
                                    className="material-symbols-outlined text-[16px] text-secondary"
                                    title="Đã xác thực làng nghề cổ truyền"
                                >
                                    <FontAwesomeIcon icon={faCheckCircle} />
                                </span>
                            </div>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">
                                Làng Lụa Vạn Phúc, Hà Đông • 4 thế hệ gìn giữ cửi dệt truyền
                                thống
                            </p>
                        </div>
                    </div>
                    <a
                        className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-surface-container text-secondary font-label-md text-label-md hover:bg-secondary hover:text-on-secondary transition-all"
                        href="#"
                    >
                        <span>Thăm gian hàng</span>
                        <span className="material-symbols-outlined text-[16px]">
                            <FontAwesomeIcon icon={faStore} />
                        </span>
                    </a>
                </div>
            </div>
        </>
    );
};

export default ProductGallery;
