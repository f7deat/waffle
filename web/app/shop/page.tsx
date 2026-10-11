/* eslint-disable @next/next/no-img-element */
import PageContainer from "@/components/layout/page-container";
import { apiBrands, apiProductCategories, apiProducts, apiProductsByCategory } from "@/services/shop/product";
import ProductList from "./components/product-list";
import { Metadata } from "next";
import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from "@fortawesome/free-solid-svg-icons/faSearch";

const PAGE_SIZE = 12;

export const metadata: Metadata = {
    title: "Sản phẩm - Dịch vụ",
    description: "Danh sách sản phẩm và dịch vụ của chúng tôi",
};

interface PageProps {
    searchParams?: Promise<{
        q?: string;
        category?: string;
        brand?: string;
        page?: string;
    }>;
}

const Page: React.FC<PageProps> = async ({ searchParams }) => {
    const params = await searchParams;
    const keyword = (params?.q || "").trim();
    const selectedCategory = (params?.category || "").trim();
    const selectedBrand = (params?.brand || "").trim();
    const parsedPage = Number.parseInt(params?.page || "1", 10);
    let currentPage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

    const [categoryResponse, brandResponse] = await Promise.all([
        apiProductCategories({ current: 1, pageSize: 100 }),
        apiBrands({ current: 1, pageSize: 100 }),
    ]);
    const categories = categoryResponse.data || [];
    const brands = brandResponse.data || [];
    const selectedCategoryItem = categories.find((x) => x.normalizedName === selectedCategory);
    const selectedBrandItem = brands.find((x) => x.normalizedName === selectedBrand);

    const loadProducts = (current: number) => selectedCategory && !selectedCategoryItem
        ? apiProductsByCategory(selectedCategory, {
            current,
            pageSize: PAGE_SIZE,
            name: keyword || undefined,
        })
        : apiProducts({
            current,
            pageSize: PAGE_SIZE,
            name: keyword || undefined,
            categoryId: selectedCategoryItem?.id,
            brandId: selectedBrandItem?.id,
        });

    let response = await loadProducts(currentPage);
    let pageCount = Math.ceil(response.total / PAGE_SIZE);
    if (pageCount > 0 && currentPage > pageCount) {
        currentPage = pageCount;
        response = await loadProducts(currentPage);
        pageCount = Math.ceil(response.total / PAGE_SIZE);
    }
    const products = response.data || [];

    const shopHref = (filters: { category?: string | null; brand?: string | null; page?: number } = {}) => {
        const query = new URLSearchParams();
        const category = filters.category === undefined ? selectedCategory : filters.category;
        const brand = filters.brand === undefined ? selectedBrand : filters.brand;
        if (category) query.set("category", category);
        if (brand) query.set("brand", brand);
        if (keyword) query.set("q", keyword);
        if (filters.page && filters.page > 1) query.set("page", String(filters.page));
        const queryString = query.toString();
        return queryString ? `/shop?${queryString}` : "/shop";
    };

    return (
        <PageContainer breadcrumbs={[
            {
                label: 'Cửa hàng',
                href: '/shop'
            }
        ]}>
            <div className="bg-slate-100 p-4 rounded-xl">
                <div className="mb-4 bg-white rounded-lg p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center">
                        <div className="flex-1 text-lg font-semibold">
                            Danh sách sản phẩm
                            {selectedCategoryItem ? `: ${selectedCategoryItem.name}` : ""}
                            {selectedBrandItem ? ` - ${selectedBrandItem.name}` : ""}
                        </div>
                        <Link href="/shop/brand" className="text-sm font-medium text-amber-700 hover:underline">
                            Xem thương hiệu
                        </Link>
                        <form action="/shop" className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
                            {selectedCategory ? <input type="hidden" name="category" value={selectedCategory} /> : null}
                            <select
                                name="brand"
                                defaultValue={selectedBrand}
                                aria-label="Lọc theo thương hiệu"
                                className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700"
                            >
                                <option value="">Tất cả thương hiệu</option>
                                {brands.map((brand) => (
                                    <option key={brand.id} value={brand.normalizedName}>{brand.name}</option>
                                ))}
                            </select>
                            <div className="bg-slate-100 rounded-lg items-center text-sm flex">
                                <button type="submit" className="text-slate-800 px-3" aria-label="Tìm kiếm và lọc sản phẩm">
                                    <FontAwesomeIcon icon={faSearch} />
                                </button>
                                <input
                                    type="text"
                                    name="q"
                                    defaultValue={keyword}
                                    placeholder="Tìm kiếm sản phẩm"
                                    className="min-w-0 rounded-xl bg-slate-100 py-2 sm:min-w-52"
                                />
                            </div>
                        </form>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                        <Link
                            href={shopHref({ category: null })}
                            className={`rounded-full px-3 py-1.5 text-sm transition ${selectedCategory ? "bg-slate-200 text-slate-700 hover:bg-slate-300" : "bg-slate-800 text-white"}`}
                        >
                            Tất cả
                        </Link>
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={shopHref({ category: category.normalizedName })}
                                className={`rounded-full px-3 py-1.5 text-sm transition ${selectedCategory === category.normalizedName
                                    ? "bg-slate-800 text-white"
                                    : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                                    }`}
                            >
                                {category.name}
                            </Link>
                        ))}
                    </div>
                </div>

                <p className="mb-3 text-sm text-slate-600">
                    Hiển thị {products.length} / {response.total} sản phẩm
                </p>
                {products.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-10 text-center text-slate-600">
                        Không có sản phẩm phù hợp.
                    </div>
                ) : (
                    <ProductList products={products} />
                )}
                {pageCount > 1 ? (
                    <nav className="mt-6 flex items-center justify-center gap-4" aria-label="Phân trang sản phẩm">
                        <Link
                            href={shopHref({ page: currentPage - 1 })}
                            aria-disabled={currentPage <= 1}
                            tabIndex={currentPage <= 1 ? -1 : undefined}
                            className={`rounded-lg px-4 py-2 text-sm ${currentPage <= 1 ? "pointer-events-none bg-slate-200 text-slate-400" : "bg-white text-slate-700 hover:bg-slate-200"}`}
                        >
                            Trước
                        </Link>
                        <span className="text-sm text-slate-700" aria-current="page">
                            Trang {currentPage} / {pageCount}
                        </span>
                        <Link
                            href={shopHref({ page: currentPage + 1 })}
                            aria-disabled={currentPage >= pageCount}
                            tabIndex={currentPage >= pageCount ? -1 : undefined}
                            className={`rounded-lg px-4 py-2 text-sm ${currentPage >= pageCount ? "pointer-events-none bg-slate-200 text-slate-400" : "bg-white text-slate-700 hover:bg-slate-200"}`}
                        >
                            Tiếp
                        </Link>
                    </nav>
                ) : null}
            </div>
        </PageContainer>
    );
}

export default Page;