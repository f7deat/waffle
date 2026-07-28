"use client";

/* eslint-disable @next/next/no-img-element */
import { FireFilled } from "@ant-design/icons";
import { useMemo, useState } from "react";

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
        <div className="md:w-96">
            <div className="group relative overflow-hidden rounded-[2rem] border border-slate-300/80 bg-white/90 backdrop-blur-sm">
                <div className="absolute left-5 top-5 z-20 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 backdrop-blur dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200">
                        Đang Hot <FireFilled className="text-orange-500" />
                    </span>
                    {unitInStock !== undefined && unitInStock > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                            Ready Stock
                        </span>
                    )}
                </div>

                <div className="aspect-square">
                    {activeImage ? (
                        <img
                            src={activeImage}
                            alt={productName}
                            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center bg-slate-100 dark:bg-slate-800">
                            <span className="rounded-full border border-dashed border-slate-300 px-4 py-2 text-sm font-medium text-slate-500 dark:border-slate-600 dark:text-slate-400">
                                No image available
                            </span>
                        </div>
                    )}
                </div>

                {hasMultipleImages && (
                    <>
                        <button
                            type="button"
                            aria-label="Ảnh trước"
                            onClick={goPrev}
                            className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/60 bg-white/80 px-3 py-2 text-xs font-semibold text-slate-700 shadow backdrop-blur transition hover:bg-white md:hidden"
                        >
                            Prev
                        </button>
                        <button
                            type="button"
                            aria-label="Ảnh sau"
                            onClick={goNext}
                            className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/60 bg-white/80 px-3 py-2 text-xs font-semibold text-slate-700 shadow backdrop-blur transition hover:bg-white md:hidden"
                        >
                            Next
                        </button>
                    </>
                )}

                {hasDiscount && (
                    <div className="absolute right-6 top-6 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 px-4 py-2 text-sm font-bold text-white ring-1 ring-white/70 dark:ring-white/30">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        -{discountPercent}%
                    </div>
                )}
            </div>

            {hasMultipleImages && (
                <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                    {safeImages.map((image, index) => (
                        <button
                            key={`${image}-${index}`}
                            type="button"
                            aria-label={`Xem ảnh ${index + 1}`}
                            onClick={() => setActiveIndex(index)}
                            className={`shrink-0 overflow-hidden rounded-xl border bg-white transition ${
                                activeIndex === index
                                    ? "border-amber-500 ring-2 ring-amber-200"
                                    : "border-slate-200 hover:border-amber-400"
                            }`}
                        >
                            <img
                                src={image}
                                alt={`${productName} - ${index + 1}`}
                                className="h-20 w-20 object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductGallery;
