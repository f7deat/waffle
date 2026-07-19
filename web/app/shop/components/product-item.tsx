import { ProductItemType } from "@/typings/shop/product";
import Link from "next/link";

const ProductItem: React.FC<ProductItemType> = (product) => {
    const formatPrice = (value?: number) => {
        if (typeof value !== "number") return null;
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            maximumFractionDigits: 0,
        }).format(value);
    };

    const salePercent =
        typeof product.price === "number" &&
        typeof product.salePrice === "number" &&
        product.price > product.salePrice
            ? Math.round(((product.price - product.salePrice) / product.price) * 100)
            : null;

    const displayPrice = formatPrice(product.salePrice ?? product.price);
    const originalPrice =
        typeof product.price === "number" &&
        typeof product.salePrice === "number" &&
        product.price > product.salePrice
            ? formatPrice(product.price)
            : null;

    const updatedDate = product.modifiedDate
        ? new Intl.DateTimeFormat("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
          }).format(new Date(product.modifiedDate))
        : null;

    return (
        <article className="group relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-gradient-to-b from-white via-white to-zinc-50/80 p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-zinc-900/10">
            <div className="relative mb-3 h-52 overflow-hidden rounded-xl md:h-64">
                <img
                    src={product.thumbnail}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/35 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                {salePercent ? (
                    <span className="absolute left-2 top-2 rounded-full bg-rose-500 px-2.5 py-1 text-xs font-semibold text-white shadow-lg">
                        -{salePercent}%
                    </span>
                ) : null}
            </div>

            <h3 className="mb-2 line-clamp-2 min-h-10 text-sm font-semibold text-zinc-800 transition-colors group-hover:text-amber-700 md:text-lg uppercase">
                <Link href={`/shop/${product.normalizedName}`} className="cursor-pointer">
                    {product.name}
                </Link>
            </h3>

            {product.description ? (
                <p className="mb-3 line-clamp-2 text-xs text-zinc-500 md:text-sm">{product.description}</p>
            ) : null}

            <div className="mt-auto flex items-end justify-between gap-2">
                <div>
                    <p className="text-base font-bold text-zinc-900 md:text-lg">{displayPrice ?? "Liên hệ"}</p>
                    {originalPrice ? <p className="text-xs text-zinc-400 line-through">{originalPrice}</p> : null}
                </div>
                <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-medium text-amber-700 md:text-xs">
                    Lượt xem {product.viewCount}
                </span>
            </div>

            {updatedDate ? <p className="mt-2 text-[11px] text-zinc-400">Cập nhật: {updatedDate}</p> : null}
        </article>
    );
}

export default ProductItem;