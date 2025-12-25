/* eslint-disable @next/next/no-img-element */
import PageContainer from "@/components/layout/page-container";
import { apiProductDetail } from "@/service/shop/product";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>;
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
            <div className="mx-auto max-w-7xl px-4 py-8">
                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Product Image */}
                    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
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
                            <div className="absolute right-4 top-4 rounded-full bg-red-500 px-3 py-1 text-sm font-bold text-white shadow-lg">
                                -{discountPercent}%
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col gap-6">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                                {product.name}
                            </h1>
                            {product.description && (
                                <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
                                    {product.description}
                                </p>
                            )}
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-3">
                            {hasDiscount ? (
                                <>
                                    <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                                        ${product.salePrice?.toFixed(2)}
                                    </span>
                                    <span className="text-2xl font-medium text-slate-400 line-through">
                                        ${product.price.toFixed(2)}
                                    </span>
                                </>
                            ) : (
                                <span className="text-4xl font-bold text-slate-900 dark:text-slate-100">
                                    ${product.price.toFixed(2)}
                                </span>
                            )}
                        </div>

                        {/* Stock Status */}
                        <div className="flex items-center gap-2">
                            {product.unitInStock !== undefined && (
                                <>
                                    {product.unitInStock > 0 ? (
                                        <>
                                            <span className="flex h-3 w-3 rounded-full bg-green-500"></span>
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                In stock ({product.unitInStock} units)
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="flex h-3 w-3 rounded-full bg-red-500"></span>
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                Out of stock
                                            </span>
                                        </>
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
                                    className="rounded-xl bg-blue-600 px-8 py-4 text-center text-lg font-semibold text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                                >
                                    Buy Now
                                </a>
                            ) : (
                                <button
                                    disabled
                                    className="rounded-xl bg-slate-300 px-8 py-4 text-center text-lg font-semibold text-slate-500 cursor-not-allowed"
                                >
                                    Not Available
                                </button>
                            )}
                            <Link
                                href="/shop"
                                className="rounded-xl border-2 border-slate-300 px-8 py-4 text-center text-lg font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800"
                            >
                                Continue Shopping
                            </Link>
                        </div>

                        {/* Meta Info */}
                        <div className="mt-4 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-800 dark:bg-slate-900">
                            <div className="flex justify-between">
                                <span className="text-slate-600 dark:text-slate-400">Views:</span>
                                <span className="font-medium text-slate-900 dark:text-slate-100">
                                    {product.viewCount?.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-600 dark:text-slate-400">Added:</span>
                                <span className="font-medium text-slate-900 dark:text-slate-100">
                                    {new Date(product.createdDate).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-600 dark:text-slate-400">Product ID:</span>
                                <span className="font-mono text-xs font-medium text-slate-900 dark:text-slate-100">
                                    {product.id}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Content/Details */}
                {product.content && (
                    <div className="mt-12">
                        <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-slate-100">
                            Product Details
                        </h2>
                        <div 
                            className="prose prose-slate max-w-none dark:prose-invert"
                            dangerouslySetInnerHTML={{ __html: product.content }}
                        />
                    </div>
                )}
            </div>
        </PageContainer>
    );
};

export default Page;