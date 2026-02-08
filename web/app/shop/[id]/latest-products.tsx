'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiProducts } from '@/services/shop/product';

const LatestProducts: React.FC = () => {
    const [products, setProducts] = useState<API.ProductListItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLatestProducts = async () => {
            try {
                setLoading(true);
                const response = await apiProducts({ current: 1, pageSize: 4 });
                setProducts(response.data || []);
            } catch (error) {
                console.error('Failed to fetch latest products:', error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchLatestProducts();
    }, []);

    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
        );
    }

    if (products.length === 0) {
        return null;
    }

    return (
        <div className="mt-20">
            <div className="mb-10 text-center">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-2 text-sm font-semibold text-blue-700 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-300">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    Explore More
                </div>
                <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
                    Latest Products
                </h2>
                <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
                    Discover our newest arrivals and trending items
                </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {products.map((product) => {
                    const hasDiscount = product.salePrice && product.salePrice < product.price;
                    const discountPercent = hasDiscount 
                        ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
                        : 0;

                    return (
                        <Link 
                            key={product.id} 
                            href={`/shop/${product.normalizedName}`}
                            className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md transition hover:shadow-2xl hover:scale-[1.02] hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700"
                        >
                            <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900">
                                {product.thumbnail ? (
                                    <img
                                        src={product.thumbnail}
                                        alt={product.name}
                                        className="h-full w-full object-cover transition group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center">
                                        <span className="text-slate-400">No image</span>
                                    </div>
                                )}
                                {hasDiscount && (
                                    <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-gradient-to-r from-red-500 to-pink-600 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        -{discountPercent}%
                                    </div>
                                )}
                            </div>
                            <div className="p-5">
                                <h3 className="mb-3 line-clamp-2 text-lg font-bold text-slate-900 transition group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400">
                                    {product.name}
                                </h3>
                                {product.description && (
                                    <p className="mb-3 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                                        {product.description}
                                    </p>
                                )}
                                <div className="mt-4 flex items-baseline gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                                    {hasDiscount ? (
                                        <>
                                            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-2xl font-bold text-transparent dark:from-blue-400 dark:to-indigo-400">
                                                ${product.salePrice?.toFixed(2)}
                                            </span>
                                            <span className="text-base text-slate-400 line-through">
                                                ${product.price?.toFixed(2)}
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                            {product.price ? `${product.price.toFixed(2)}đ` : 'Liên hệ'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default LatestProducts;
