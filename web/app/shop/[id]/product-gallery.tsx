"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";

type ProductGalleryProps = {
    imageSources: string[];
    productName: string;
};

const ProductGallery = ({ imageSources, productName }: ProductGalleryProps) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);
    const activeImage = imageSources[activeIndex];

    return (
        <div className="flex flex-col gap-4 lg:col-span-7">
            <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface-container sm:aspect-square lg:aspect-[4/5]">
                {activeImage ? (
                    <img
                        src={activeImage}
                        alt={productName}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center p-8 text-center text-on-surface-variant">
                        {productName}
                    </div>
                )}
                {activeImage && (
                    <button
                        type="button"
                        aria-label="Phóng to ảnh sản phẩm"
                        onClick={() => setIsZoomed(true)}
                        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-surface-bright/90 text-on-surface shadow transition hover:bg-surface-bright"
                    >
                        <span className="material-symbols-outlined">zoom_in</span>
                    </button>
                )}
            </div>

            {imageSources.length > 1 && (
                <div className="grid grid-cols-5 gap-2 sm:grid-cols-6">
                    {imageSources.map((image, index) => (
                        <button
                            key={`${image}-${index}`}
                            type="button"
                            aria-label={`Xem ảnh ${index + 1}`}
                            aria-pressed={activeIndex === index}
                            onClick={() => setActiveIndex(index)}
                            className={`aspect-square overflow-hidden rounded-lg bg-surface-container p-0.5 ${
                                activeIndex === index ? "ring-2 ring-primary" : "hover:ring-1 hover:ring-primary/50"
                            }`}
                        >
                            <img src={image} alt={`${productName} - ảnh ${index + 1}`} className="h-full w-full rounded-md object-cover" />
                        </button>
                    ))}
                </div>
            )}

            {isZoomed && activeImage && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Ảnh sản phẩm phóng to"
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
                    onClick={() => setIsZoomed(false)}
                >
                    <button
                        type="button"
                        aria-label="Đóng ảnh phóng to"
                        onClick={() => setIsZoomed(false)}
                        className="absolute right-4 top-4 rounded-full bg-white/10 px-4 py-2 text-white hover:bg-white/20"
                    >
                        Đóng
                    </button>
                    <img
                        src={activeImage}
                        alt={productName}
                        className="max-h-[90vh] max-w-full object-contain"
                        onClick={(event) => event.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
};

export default ProductGallery;
