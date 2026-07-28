/* eslint-disable @next/next/no-img-element */
import PageContainer from "@/components/layout/page-container";
import AddToCartButton from "@/components/shop/add-to-cart-button";
import { apiProductDetail } from "@/services/shop/product";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import LatestProducts from "./latest-products";
import BlockRender from "@/components/editor/block-render";
import ProductGallery from "./product-gallery";
import { ArrowLeftOutlined, CalendarOutlined, EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons";

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    try {
        const { id } = await params;

        const metaResponse = await apiProductDetail(id);
        const metaData = metaResponse.data || null;

        return {
            title: metaData?.name,
            description: metaData?.description,
            openGraph: {
                title: metaData?.name,
                description: metaData?.description,
                images: metaData?.thumbnail ? [{ url: metaData.thumbnail }] : [],
            },
        };
    } catch (error) {
        console.error('Failed to generate metadata:', error);
        return {
            title: 'Place',
            description: 'Place details',
        };
    }
}

const Page = async ({ params }: PageProps) => {
    const { id } = await params;
    const response = await apiProductDetail(id);
    if (!response.succeeded || !response.data) {
        notFound();
    }
    const product = response.data;
    const imageSources = Array.from(new Set([
        ...(Array.isArray(product.images) ? product.images.map((x) => x.url).filter(Boolean) : []),
        product.thumbnail,
    ].filter((x): x is string => !!x)));
    const hasDiscount = product.salePrice && product.salePrice < product.price;
    const discountPercent = hasDiscount
        ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
        : 0;

    const localePrice = (value?: number | null) =>
        typeof value === "number" ? `${value.toLocaleString("vi-VN")}đ` : "Liên hệ";

    return (
        <PageContainer breadcrumbs={[
            {
                href: '/shop',
                label: 'Sản phẩm'
            }
        ]}>
            <div className="relative mx-auto max-w-7xl px-4 py-12 sm:py-14 lg:py-16">
                <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute -left-24 top-6 h-56 w-56 rounded-full bg-amber-300/10 blur-3xl" />
                    <div className="absolute -right-20 top-1/4 h-72 w-72 rounded-full bg-slate-300/20 blur-3xl dark:bg-slate-500/20" />
                    <div className="absolute bottom-4 left-1/3 h-44 w-44 rounded-full bg-orange-300/10 blur-3xl" />
                </div>

                <div className="md:flex gap-4">
                    <ProductGallery
                        imageSources={imageSources}
                        productName={product.name}
                        unitInStock={product.unitInStock}
                        hasDiscount={!!hasDiscount}
                        discountPercent={discountPercent}
                    />

                    {/* Product Info */}
                    <div className="flex flex-col gap-4 flex-1">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-xs font-semibold text-amber-800 dark:border-amber-700/70 dark:bg-amber-900/20 dark:text-amber-300">
                                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                </svg>
                                Featured Product
                            </div>
                            <h1 className="text-2xl font-semibold text-slate-900">
                                {product.name}
                            </h1>
                            {product.description && (
                                <p className="text-sm md:text-base text-slate-600">
                                    {product.description}
                                </p>
                            )}
                        </div>

                        {/* Price */}
                        <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-amber-50/50 p-4">
                            <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-amber-300/20 blur-2xl" />
                            <div className="flex flex-col gap-2">
                                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Giá</span>
                                {hasDiscount ? (
                                    <div className="flex items-baseline gap-4">
                                        <span className="bg-gradient-to-r from-slate-800 to-amber-700 bg-clip-text text-xl font-black text-transparent sm:text-5xl dark:from-slate-100 dark:to-amber-300">
                                            {localePrice(product.salePrice)}
                                        </span>
                                        <span className="text-lg font-medium text-slate-400 line-through sm:text-xl">
                                            {localePrice(product.price)}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-xl font-black text-slate-900">
                                        {localePrice(product.price)}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Stock Status */}
                        <div hidden={!product.price && !product.salePrice} className="rounded-2xl border border-slate-200 bg-white/90 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                            {product.unitInStock !== undefined && (
                                <>
                                    {product.unitInStock > 0 ? (
                                        <div className="flex items-center gap-3">
                                            <div className="relative flex h-4 w-4">
                                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                                                <span className="relative inline-flex h-4 w-4 rounded-full bg-green-500"></span>
                                            </div>
                                            <div>
                                                <span className="block text-sm font-bold text-slate-900 dark:text-slate-100">
                                                    In Stock
                                                </span>
                                                <span className="text-xs text-slate-600 dark:text-slate-400">
                                                    {product.unitInStock} units available
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <span className="flex h-4 w-4 rounded-full bg-red-500"></span>
                                            <div>
                                                <span className="block text-sm font-bold text-slate-900 dark:text-slate-100">
                                                    Out of Stock
                                                </span>
                                                <span className="text-xs text-slate-600 dark:text-slate-400">
                                                    Currently unavailable
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3">
                            {product.affiliateLink ? (
                                <a
                                    href={product.affiliateLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative overflow-hidden btn btn-primary text-center"
                                >
                                    <ShoppingCartOutlined /> Mua ngay
                                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition group-hover:translate-x-full group-hover:duration-1000"></div>
                                </a>
                            ) : product.price ? (
                                <AddToCartButton
                                    item={{
                                        productId: product.id,
                                        name: product.name,
                                        thumbnail: product.thumbnail,
                                        normalizedName: product.normalizedName,
                                        price: product.price,
                                        salePrice: product.salePrice,
                                    }}
                                    className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-800 to-slate-700 px-8 py-5 text-center text-lg font-bold text-white transition hover:-translate-y-0.5 hover:from-slate-900 hover:to-slate-800 active:scale-[0.98] dark:border-slate-500 dark:from-slate-100 dark:to-slate-300 dark:text-slate-900 dark:hover:from-white dark:hover:to-slate-200"
                                />
                            ) : (
                                <button
                                    hidden={!product.price && !product.salePrice}
                                    className="cursor-not-allowed rounded-2xl bg-slate-200 px-8 py-5 text-center text-lg font-semibold text-slate-400 dark:bg-slate-800 dark:text-slate-600"
                                >
                                    Not Available
                                </button>
                            )}
                            <Link
                                href="/shop"
                                className="group rounded-lg border border-slate-300 bg-white px-8 py-2 text-center font-semibold text-slate-700 transition hover:border-amber-500 hover:bg-amber-50 hover:text-amber-700"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    <ArrowLeftOutlined />
                                    Xem thêm sản phẩm khác
                                </span>
                            </Link>
                        </div>

                        {/* Meta Info */}
                        <div className="space-y-2 rounded-lg border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 dark:border-slate-700 dark:from-slate-800 dark:to-slate-900">
                            <div className="flex items-center justify-between border-b border-slate-200 pb-2 dark:border-slate-700">
                                <span className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                                    <EyeOutlined />
                                    Lượt xem
                                </span>
                                <span className="text-base font-bold text-slate-900 dark:text-slate-100">
                                    {product.viewCount?.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex items-center justify-between border-b border-slate-200 pb-2 dark:border-slate-700">
                                <span className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                                    <CalendarOutlined />
                                    Ngày cập nhật
                                </span>
                                <span className="text-base font-bold text-slate-900 dark:text-slate-100">
                                    {new Date(product.createdDate).toLocaleDateString("vi-VN")}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-12 rounded-lg p-4 bg-white backdrop-blur">
                    <BlockRender {...product.content} />
                </div>

                {/* Latest Products */}
                <div className="mt-12">
                    <LatestProducts />
                </div>
            </div>
        </PageContainer>
    );
};

export default Page;