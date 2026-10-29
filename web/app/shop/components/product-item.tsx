/* eslint-disable @next/next/no-img-element */
import { ProductItemType } from "@/typings/shop/product";
import Link from "next/link";

const formatPrice = (value?: number) => {
    if (typeof value !== "number") return null;
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
    }).format(value);
};

const ProductItem: React.FC<ProductItemType> = (product) => {
    const hasDiscount = typeof product.price === "number"
        && typeof product.salePrice === "number"
        && product.salePrice < product.price;
    const salePercent = hasDiscount && product.price
        ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
        : null;
    const displayPrice = formatPrice(hasDiscount ? product.salePrice : product.price);
    const originalPrice = hasDiscount ? formatPrice(product.price) : null;

    return (
        <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            <Link
                aria-label={`Xem sản phẩm ${product.name}`}
                className="relative block aspect-[4/3] overflow-hidden bg-surface-container"
                href={`/shop/${product.normalizedName}`}
            >
                {product.thumbnail ? (
                    <img
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        src={product.thumbnail}
                    />
                ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-surface-container-high to-surface-container text-4xl text-outline" aria-hidden="true">
                        ◇
                    </div>
                )}
                <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                    {product.categoryName ? (
                        <span className="max-w-[200px] truncate rounded-full bg-secondary px-3 py-1 text-xs font-bold text-on-secondary shadow-sm">
                            {product.categoryName}
                        </span>
                    ) : null}
                    {typeof product.unitInStock === "number" && product.unitInStock <= 0 ? (
                        <span className="rounded-full bg-surface-container-lowest/95 px-2.5 py-1 text-xs font-semibold text-outline">
                            Tạm hết hàng
                        </span>
                    ) : null}
                </div>
                {salePercent ? (
                    <span className="absolute right-3 top-3 rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-on-primary shadow-sm">
                        -{salePercent}%
                    </span>
                ) : null}
            </Link>

            <div className="flex flex-1 flex-col p-4">
                <div className="mb-2 flex items-center justify-between gap-2 text-xs text-outline">
                    <span>{product.categoryName || "Sản phẩm"}</span>
                    {typeof product.unitInStock === "number" ? (
                        <span className="shrink-0 rounded-full bg-tertiary-fixed/60 px-2 py-1 text-on-tertiary-container">
                            {product.unitInStock > 0 ? "Còn hàng" : "Hết hàng"}
                        </span>
                    ) : null}
                </div>
                <h3 className="line-clamp-2 min-h-11 text-base font-bold leading-6 text-on-surface transition-colors group-hover:text-primary">
                    <Link href={`/shop/${product.normalizedName}`}>{product.name}</Link>
                </h3>
                {product.description ? (
                    <p className="mt-2 line-clamp-2 text-sm leading-5 text-on-surface-variant">{product.description}</p>
                ) : (
                    <p className="mt-2 line-clamp-2 text-sm leading-5 text-on-surface-variant">
                        Xem thông tin chi tiết và lựa chọn phù hợp với nhu cầu của bạn.
                    </p>
                )}

                <div className="mt-auto flex items-end justify-between gap-3 border-t border-outline-variant/40 pt-4">
                    <div className="min-w-0">
                        <span className="block text-[11px] text-outline">Giá bán</span>
                        <span className="block truncate text-lg font-bold text-primary">{displayPrice || "Liên hệ"}</span>
                        {originalPrice ? <span className="text-xs text-outline line-through">{originalPrice}</span> : null}
                    </div>
                    <Link
                        className="flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-3.5 py-2.5 text-xs font-bold text-on-primary shadow-sm transition hover:bg-on-primary-container"
                        href={`/shop/${product.normalizedName}`}
                    >
                        <span aria-hidden="true">＋</span> Chọn mua
                    </Link>
                </div>
            </div>
        </article>
    );
};

export default ProductItem;
