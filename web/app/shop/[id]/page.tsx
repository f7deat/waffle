/* eslint-disable @next/next/no-img-element */
import PageContainer from "@/components/layout/page-container";
import { apiCatalogMeta } from "@/service/catalog";
import { apiProductDetail } from "@/service/shop/product";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import LatestProducts from "./latest-products";

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    try {
        const { id } = await params;

        let metaData: API.Meta | null = null;
        try {
            const metaResponse = await apiCatalogMeta(id);
            metaData = metaResponse.data || null;
        } catch (error) {
            console.error('Failed to fetch meta:', error);
        }

        return {
            title: metaData?.title,
            description: metaData?.description,
            openGraph: {
                title: metaData?.title,
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
    const hasDiscount = product.salePrice && product.salePrice < product.price;
    const discountPercent = hasDiscount 
        ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
        : 0;

    return (
        <PageContainer>
            <div className="mx-auto max-w-7xl px-4 py-12">
                <div className="grid gap-12 lg:grid-cols-[1.2fr,1fr]">
                    {/* Product Image */}
                    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
                        <div className="aspect-square w-full">
                            {product.thumbnail ? (
                                <img
                                    src={product.thumbnail}
                                    alt={product.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center bg-slate-100 dark:bg-slate-800">
                                    <span className="text-slate-400">No image</span>
                                </div>
                            )}
                        </div>
                        {hasDiscount && (
                            <div className="absolute right-6 top-6 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-red-500 to-pink-600 px-4 py-2 text-sm font-bold text-white shadow-2xl ring-2 ring-white ring-offset-2">
                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                -{discountPercent}%
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col gap-8">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                </svg>
                                Featured Product
                            </div>
                            <h1 className="text-4xl font-bold leading-tight text-slate-900 dark:text-slate-100 lg:text-5xl">
                                {product.name}
                            </h1>
                            {product.description && (
                                <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                                    {product.description}
                                </p>
                            )}
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 p-6 dark:from-slate-800/50 dark:to-slate-900/50">
                            <div className="flex flex-col gap-2">
                                <span className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Price</span>
                                {hasDiscount ? (
                                    <div className="flex items-baseline gap-4">
                                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-5xl font-bold text-transparent dark:from-blue-400 dark:to-indigo-400">
                                            ${product.salePrice?.toFixed(2)}
                                        </span>
                                        <span className="text-2xl font-medium text-slate-400 line-through">
                                            ${product.price?.toFixed(2)}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-5xl font-bold text-slate-900 dark:text-slate-100">
                                        {`${product.price ? `${product.price.toFixed(2)}đ` : 'Liên hệ'}`}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Stock Status */}
                        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/50">
                            {product.unitInStock !== undefined && (
                                <>
                                    {product.unitInStock > 0 ? (
                                        <div className="flex items-center gap-3">
                                            <div className="relative flex h-4 w-4">
                                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                                                <span className="relative inline-flex h-4 w-4 rounded-full bg-green-500"></span>
                                            </div>
                                            <div>
                                                <span className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
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
                                                <span className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
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
                        <div className="flex flex-col gap-4">
                            {product.affiliateLink ? (
                                <a
                                    href={product.affiliateLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-5 text-center text-lg font-bold text-white shadow-xl transition hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] dark:from-blue-500 dark:to-indigo-500"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        Buy Now
                                    </span>
                                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition group-hover:translate-x-full group-hover:duration-1000"></div>
                                </a>
                            ) : (
                                <button
                                    disabled
                                    className="cursor-not-allowed rounded-2xl bg-slate-200 px-8 py-5 text-center text-lg font-semibold text-slate-400 dark:bg-slate-800 dark:text-slate-600"
                                >
                                    Not Available
                                </button>
                            )}
                            <Link
                                href="/shop"
                                className="group rounded-2xl border-2 border-slate-300 bg-white px-8 py-5 text-center text-lg font-semibold text-slate-700 transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:bg-blue-950 dark:hover:text-blue-300"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="h-5 w-5 transition group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Continue Shopping
                                </span>
                            </Link>
                        </div>

                        {/* Meta Info */}
                        <div className="space-y-3 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm dark:border-slate-700 dark:from-slate-800 dark:to-slate-900">
                            <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-700">
                                <span className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    Views
                                </span>
                                <span className="text-base font-bold text-slate-900 dark:text-slate-100">
                                    {product.viewCount?.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-700">
                                <span className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Added
                                </span>
                                <span className="text-base font-bold text-slate-900 dark:text-slate-100">
                                    {new Date(product.createdDate).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex items-center justify-between pt-1">
                                <span className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                    </svg>
                                    Product ID
                                </span>
                                <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs font-semibold text-slate-900 dark:bg-slate-800 dark:text-slate-100">
                                    {product.id}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Content/Details */}
                {product.content && (
                    <div className="mt-16">
                        <div className="mb-8 flex items-center gap-3">
                            <div className="h-1 w-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                                Product Details
                            </h2>
                        </div>
                        <div 
                            className="prose prose-lg prose-slate max-w-none rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:prose-invert dark:border-slate-800 dark:bg-slate-900 lg:p-12"
                            dangerouslySetInnerHTML={{ __html: product.content }}
                        />
                    </div>
                )}

                {/* Latest Products */}
                <LatestProducts />
            </div>
        </PageContainer>
    );
};

export default Page;