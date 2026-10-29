"use client";

import { useCartContext } from "@/contexts/cart-context";
import type { ProductVariantType } from "@/typings/shop/product";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ProductPurchasePanelProps = {
    id: string;
    name: string;
    normalizedName: string;
    thumbnail: string;
    price?: number;
    salePrice?: number;
    unitInStock?: number;
    sku?: string;
    variants: ProductVariantType[];
};

const formatPrice = (value?: number) =>
    typeof value === "number" ? `${value.toLocaleString("vi-VN")}₫` : "Liên hệ";

const ProductPurchasePanel = (product: ProductPurchasePanelProps) => {
    const router = useRouter();
    const { addToCart } = useCartContext();
    const [selectedVariantId, setSelectedVariantId] = useState(
        product.variants.find((variant) => {
            const variantStock = variant.unitInStock ?? product.unitInStock;
            return variantStock === undefined || variantStock > 0;
        })?.id
            ?? product.variants[0]?.id
            ?? ""
    );
    const [quantity, setQuantity] = useState(1);
    const selectedVariant = product.variants.find((variant) => variant.id === selectedVariantId);
    const price = selectedVariant?.price ?? product.price;
    const salePrice = selectedVariant?.salePrice ?? product.salePrice;
    const currentPrice = typeof salePrice === "number" && (price === undefined || salePrice < price)
        ? salePrice
        : price;
    const stock = selectedVariant?.unitInStock ?? product.unitInStock;
    const hasDiscount = typeof currentPrice === "number" && typeof price === "number" && currentPrice < price;
    const discountPercent = hasDiscount ? Math.round(((price! - currentPrice!) / price!) * 100) : 0;
    const canPurchase = typeof currentPrice === "number" && (stock === undefined || stock > 0);

    const addSelectedProduct = () => {
        if (!canPurchase) return;

        addToCart({
            productId: product.id,
            variantId: selectedVariant?.id,
            variantName: selectedVariant?.name,
            name: product.name,
            normalizedName: product.normalizedName,
            thumbnail: selectedVariant?.thumbnail || product.thumbnail,
            price,
            salePrice: hasDiscount ? salePrice : undefined,
            quantity,
        });
    };

    return (
        <section className="flex flex-col gap-5 rounded-2xl bg-surface-bright p-5 shadow-sm lg:sticky lg:top-24">
            <div className="flex flex-wrap items-center gap-2">
                {selectedVariant?.sku || product.sku ? (
                    <span className="rounded-full bg-surface-container px-3 py-1 text-xs tracking-wide text-on-surface-variant">
                        MÃ SP: {selectedVariant?.sku || product.sku}
                    </span>
                ) : null}
                {stock !== undefined && (
                    <span className={`rounded-full px-3 py-1 text-xs ${stock > 0 ? "bg-secondary-fixed/50 text-secondary" : "bg-error/10 text-error"}`}>
                        {stock > 0 ? `Còn ${stock} sản phẩm` : "Tạm hết hàng"}
                    </span>
                )}
            </div>

            <div className="flex flex-wrap items-baseline gap-3">
                <span className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">{formatPrice(currentPrice)}</span>
                {hasDiscount && (
                    <>
                        <span className="text-lg text-outline line-through">{formatPrice(price)}</span>
                        <span className="rounded-full bg-primary-container px-2 py-0.5 text-sm font-semibold text-on-primary">
                            -{discountPercent}%
                        </span>
                    </>
                )}
            </div>

            {product.variants.length > 0 && (
                <fieldset className="flex flex-col gap-2">
                    <legend className="mb-2 text-sm font-semibold text-on-surface">Phiên bản sản phẩm</legend>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {product.variants.map((variant) => {
                            const isSelected = variant.id === selectedVariantId;
                            const variantStock = variant.unitInStock ?? product.unitInStock;
                            const isUnavailable = variantStock !== undefined && variantStock <= 0;
                            const variantPrice = variant.price ?? product.price;
                            const variantSalePrice = variant.salePrice ?? product.salePrice;
                            const displayPrice = typeof variantSalePrice === "number"
                                && (variantPrice === undefined || variantSalePrice < variantPrice)
                                ? variantSalePrice
                                : variantPrice;

                            return (
                                <button
                                    key={variant.id}
                                    type="button"
                                    aria-pressed={isSelected}
                                    disabled={isUnavailable}
                                    onClick={() => {
                                        setSelectedVariantId(variant.id);
                                        setQuantity(1);
                                    }}
                                    className={`rounded-xl border p-3 text-left transition ${
                                        isSelected ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-surface-variant hover:border-primary/50"
                                    } disabled:cursor-not-allowed disabled:opacity-50`}
                                >
                                    <span className="block font-medium text-on-surface">{variant.name || "Phiên bản"}</span>
                                    <span className="mt-1 block text-sm text-on-surface-variant">
                                        {formatPrice(displayPrice)}
                                        {variantStock !== undefined ? ` · Còn ${variantStock}` : ""}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </fieldset>
            )}

            {selectedVariant?.name && (
                <p className="text-sm text-on-surface-variant">
                    Đang chọn: <span className="font-semibold text-on-surface">{selectedVariant.name}</span>
                </p>
            )}

            <div className="flex items-center gap-3">
                <div className="flex items-center rounded-full bg-surface-container p-1">
                    <button
                        type="button"
                        aria-label="Giảm số lượng"
                        onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                        disabled={quantity <= 1}
                        className="h-9 w-9 rounded-full bg-surface-bright text-on-surface disabled:opacity-40"
                    >
                        −
                    </button>
                    <span className="w-10 text-center text-sm font-semibold text-on-surface" aria-live="polite">{quantity}</span>
                    <button
                        type="button"
                        aria-label="Tăng số lượng"
                        onClick={() => setQuantity((value) => stock === undefined ? value + 1 : Math.min(stock, value + 1))}
                        disabled={stock !== undefined && quantity >= stock}
                        className="h-9 w-9 rounded-full bg-surface-bright text-on-surface disabled:opacity-40"
                    >
                        +
                    </button>
                </div>
                <button
                    type="button"
                    disabled={!canPurchase}
                    onClick={addSelectedProduct}
                    className="flex-1 rounded-full bg-surface-container-low px-4 py-3 font-semibold text-primary transition hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Thêm vào giỏ
                </button>
            </div>

            <button
                type="button"
                disabled={!canPurchase}
                onClick={() => {
                    addSelectedProduct();
                    router.push("/shop/cart");
                }}
                className="w-full rounded-full bg-primary-container px-5 py-3.5 font-semibold text-on-primary shadow transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
                Mua ngay - Giao tận nơi
            </button>

            <div className="space-y-2 border-t border-surface-variant/60 pt-4 text-sm text-on-surface-variant">
                <p>Giá và tồn kho được cập nhật theo phiên bản đang chọn.</p>
                {product.sku && <p>Mã sản phẩm: {product.sku}</p>}
            </div>
        </section>
    );
};

export default ProductPurchasePanel;
