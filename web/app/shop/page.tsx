import PageContainer from "@/components/layout/page-container";
import { apiBrands, apiProductCategories, apiProducts, apiProductsByCategory } from "@/services/shop/product";
import ProductList from "./components/product-list";
import { Metadata } from "next";
import Link from "next/link";

const PAGE_SIZE = 12;

export const metadata: Metadata = {
    title: "Đặc sản & Quà tặng",
    description: "Khám phá sản phẩm, đặc sản và quà tặng được tuyển chọn.",
};

interface PageProps {
    searchParams?: Promise<{
        q?: string;
        category?: string;
        brand?: string;
        page?: string;
        sortBy?: string;
        minPrice?: string;
        maxPrice?: string;
        onSale?: string;
        inStock?: string;
    }>;
}

const Page: React.FC<PageProps> = async ({ searchParams }) => {
    const params = await searchParams;
    const keyword = (params?.q || "").trim();
    const selectedCategory = (params?.category || "").trim();
    const selectedBrand = (params?.brand || "").trim();
    const sortBy = ["popular", "price-asc", "price-desc", "newest"].includes(params?.sortBy || "")
        ? params?.sortBy || "newest"
        : "newest";
    const minPrice = params?.minPrice?.trim() ? Number(params.minPrice) : Number.NaN;
    const maxPrice = params?.maxPrice?.trim() ? Number(params.maxPrice) : Number.NaN;
    const validMinPrice = Number.isFinite(minPrice) && minPrice >= 0 ? minPrice : undefined;
    const validMaxPrice = Number.isFinite(maxPrice) && maxPrice >= 0 ? maxPrice : undefined;
    const onSale = params?.onSale === "true";
    const inStock = params?.inStock === "true";
    const parsedPage = Number.parseInt(params?.page || "1", 10);
    let currentPage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

    const [categoryResponse, brandResponse] = await Promise.all([
        apiProductCategories({ current: 1, pageSize: 100 }),
        apiBrands({ current: 1, pageSize: 100 }),
    ]);
    const categories = categoryResponse.data || [];
    const brands = brandResponse.data || [];
    const selectedCategoryItem = categories.find((category) => category.normalizedName === selectedCategory);
    const selectedBrandItem = brands.find((brand) => brand.normalizedName === selectedBrand);
    const productFilters = {
        current: currentPage,
        pageSize: PAGE_SIZE,
        name: keyword || undefined,
        brandId: selectedBrandItem?.id,
        sortBy,
        minPrice: validMinPrice,
        maxPrice: validMaxPrice,
        onSale,
        inStock,
    };

    const loadProducts = (current: number) => selectedCategory && !selectedCategoryItem
        ? apiProductsByCategory(selectedCategory, { ...productFilters, current })
        : apiProducts({ ...productFilters, current, categoryId: selectedCategoryItem?.id });

    let response = await loadProducts(currentPage);
    let pageCount = Math.ceil(response.total / PAGE_SIZE);
    if (pageCount > 0 && currentPage > pageCount) {
        currentPage = pageCount;
        response = await loadProducts(currentPage);
        pageCount = Math.ceil(response.total / PAGE_SIZE);
    }
    const products = response.data || [];
    const selectedFilterCount = [
        selectedCategory,
        selectedBrand,
        validMinPrice !== undefined || validMaxPrice !== undefined,
        onSale,
        inStock,
    ].filter(Boolean).length;

    const shopHref = (filters: {
        category?: string | null;
        brand?: string | null;
        page?: number;
        sortBy?: string;
        minPrice?: string | null;
        maxPrice?: string | null;
        onSale?: boolean;
        inStock?: boolean;
        q?: string;
    } = {}) => {
        const query = new URLSearchParams();
        const category = filters.category === undefined ? selectedCategory : filters.category;
        const brand = filters.brand === undefined ? selectedBrand : filters.brand;
        const queryKeyword = filters.q === undefined ? keyword : filters.q;
        const querySort = filters.sortBy === undefined ? sortBy : filters.sortBy;
        const queryMin = filters.minPrice === undefined
            ? (validMinPrice === undefined ? "" : String(validMinPrice))
            : filters.minPrice;
        const queryMax = filters.maxPrice === undefined
            ? (validMaxPrice === undefined ? "" : String(validMaxPrice))
            : filters.maxPrice;
        const queryOnSale = filters.onSale === undefined ? onSale : filters.onSale;
        const queryInStock = filters.inStock === undefined ? inStock : filters.inStock;

        if (category) query.set("category", category);
        if (brand) query.set("brand", brand);
        if (queryKeyword) query.set("q", queryKeyword);
        if (querySort !== "newest") query.set("sortBy", querySort);
        if (queryMin) query.set("minPrice", queryMin);
        if (queryMax) query.set("maxPrice", queryMax);
        if (queryOnSale) query.set("onSale", "true");
        if (queryInStock) query.set("inStock", "true");
        if (filters.page && filters.page > 1) query.set("page", String(filters.page));
        const queryString = query.toString();
        return queryString ? `/shop?${queryString}` : "/shop";
    };

    return (
        <PageContainer breadcrumbs={[{ label: "Đặc sản & Quà tặng", href: "/shop" }]} fluid>
            <div className="min-h-screen bg-surface px-3 pb-12 pt-5 text-on-surface md:px-6">
                <section className="relative mx-auto mb-7 max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-low p-6 shadow-sm md:p-10">
                    <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
                    <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(260px,0.8fr)] lg:items-center">
                        <div>
                            <div className="mb-4 flex flex-wrap items-center gap-2">
                                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                                    Hương vị tuyển chọn
                                </span>
                                <span className="text-sm text-on-surface-variant">
                                    {response.total.toLocaleString("vi-VN")} sản phẩm phù hợp
                                </span>
                            </div>
                            <h1 className="max-w-3xl text-balance text-3xl font-bold tracking-tight text-on-surface md:text-5xl">
                                Đặc sản quê nhà <span className="font-semibold italic text-primary">trao gửi thân tình</span>
                            </h1>
                            <p className="mt-4 max-w-2xl text-sm leading-7 text-on-surface-variant md:text-base">
                                Tìm những món ngon, sản vật địa phương và thức quà ý nghĩa. Khám phá bộ sưu tập
                                được sắp xếp gọn gàng để bạn dễ chọn món phù hợp.
                            </p>
                            <form action="/shop" className="mt-6 flex max-w-2xl flex-col gap-2 rounded-2xl bg-surface-container-lowest p-2 shadow-md sm:flex-row sm:items-center sm:rounded-full">
                                <label className="flex min-w-0 flex-1 items-center gap-3 px-3">
                                    <span aria-hidden="true" className="text-xl text-primary">⌕</span>
                                    <input
                                        aria-label="Tìm sản phẩm"
                                        className="min-w-0 flex-1 bg-transparent py-2 text-sm text-on-surface placeholder:text-outline focus:outline-none"
                                        defaultValue={keyword}
                                        name="q"
                                        placeholder="Tìm đặc sản, món ngon, quà tặng..."
                                        type="search"
                                    />
                                </label>
                                {selectedCategory ? <input name="category" type="hidden" value={selectedCategory} /> : null}
                                {selectedBrand ? <input name="brand" type="hidden" value={selectedBrand} /> : null}
                                {sortBy !== "newest" ? <input name="sortBy" type="hidden" value={sortBy} /> : null}
                                {validMinPrice !== undefined ? <input name="minPrice" type="hidden" value={validMinPrice} /> : null}
                                {validMaxPrice !== undefined ? <input name="maxPrice" type="hidden" value={validMaxPrice} /> : null}
                                {onSale ? <input name="onSale" type="hidden" value="true" /> : null}
                                {inStock ? <input name="inStock" type="hidden" value="true" /> : null}
                                <button className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-on-primary transition hover:bg-on-primary-container" type="submit">
                                    Khám phá sản phẩm <span aria-hidden="true">→</span>
                                </button>
                            </form>
                            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-on-surface-variant">
                                <span className="font-semibold text-outline">Gợi ý tìm kiếm:</span>
                                {["Đặc sản", "Quà tặng", "Bánh kẹo"].map((suggestion) => (
                                    <Link
                                        className="underline decoration-dotted underline-offset-4 transition hover:text-primary"
                                        href={shopHref({ q: suggestion })}
                                        key={suggestion}
                                    >
                                        {suggestion}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                            {[
                                { icon: "✓", title: "Danh mục rõ ràng", detail: "Dễ tìm sản phẩm theo nhóm" },
                                { icon: "◇", title: "Giá minh bạch", detail: "Giá bán và ưu đãi hiển thị rõ" },
                                { icon: "↗", title: "Chọn mua thuận tiện", detail: "Xem thông tin trước khi đặt" },
                            ].map((item) => (
                                <div className="flex items-start gap-3 rounded-2xl bg-surface-container-lowest/90 p-4 shadow-sm" key={item.title}>
                                    <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary-container font-bold text-secondary">
                                        {item.icon}
                                    </span>
                                    <div>
                                        <p className="text-sm font-bold">{item.title}</p>
                                        <p className="mt-1 text-xs leading-5 text-on-surface-variant">{item.detail}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section aria-label="Danh mục sản phẩm" className="mx-auto mb-7 max-w-7xl">
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        <Link
                            className={`flex shrink-0 items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold shadow-sm transition ${selectedCategory ? "bg-surface-container-lowest text-on-surface hover:bg-secondary-container" : "bg-primary text-on-primary"}`}
                            href={shopHref({ category: null, page: 1 })}
                        >
                            Tất cả sản phẩm
                        </Link>
                        {categories.map((category) => (
                            <Link
                                className={`flex shrink-0 items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold shadow-sm transition ${selectedCategory === category.normalizedName ? "bg-primary text-on-primary" : "bg-surface-container-lowest text-on-surface hover:bg-secondary-container"}`}
                                href={shopHref({ category: category.normalizedName, page: 1 })}
                                key={category.id}
                            >
                                {category.name}
                                <span className={`rounded-full px-2 py-0.5 text-xs ${selectedCategory === category.normalizedName ? "bg-white/20" : "bg-surface-container text-on-surface-variant"}`}>
                                    {category.productCount}
                                </span>
                            </Link>
                        ))}
                    </div>
                </section>

                <section className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
                    <aside className="space-y-5">
                        <form action="/shop" className="space-y-5 rounded-2xl bg-surface-container-lowest p-5 shadow-sm">
                            <div className="flex items-center justify-between border-b border-outline-variant/40 pb-4">
                                <h2 className="flex items-center gap-2 font-bold">
                                    <span aria-hidden="true" className="text-primary">☷</span> Bộ lọc sản phẩm
                                </h2>
                                <Link className="text-xs font-semibold text-primary hover:underline" href="/shop">Đặt lại</Link>
                            </div>
                            {keyword ? <input name="q" type="hidden" value={keyword} /> : null}
                            {selectedCategory ? <input name="category" type="hidden" value={selectedCategory} /> : null}
                            {sortBy !== "newest" ? <input name="sortBy" type="hidden" value={sortBy} /> : null}

                            <label className="block space-y-2 text-sm font-semibold">
                                Thương hiệu
                                <select
                                    className="w-full rounded-xl border border-outline-variant/50 bg-surface px-3 py-2.5 text-sm font-normal text-on-surface"
                                    defaultValue={selectedBrand}
                                    name="brand"
                                >
                                    <option value="">Tất cả thương hiệu</option>
                                    {brands.map((brand) => (
                                        <option key={brand.id} value={brand.normalizedName}>{brand.name}</option>
                                    ))}
                                </select>
                            </label>

                            <fieldset className="space-y-3 border-t border-outline-variant/40 pt-4">
                                <legend className="mb-3 text-sm font-bold">Ưu đãi & tình trạng</legend>
                                <label className="flex cursor-pointer items-center gap-2 text-sm text-on-surface-variant">
                                    <input className="h-4 w-4 accent-primary" defaultChecked={onSale} name="onSale" type="checkbox" value="true" />
                                    Đang có ưu đãi
                                </label>
                                <label className="flex cursor-pointer items-center gap-2 text-sm text-on-surface-variant">
                                    <input className="h-4 w-4 accent-primary" defaultChecked={inStock} name="inStock" type="checkbox" value="true" />
                                    Còn hàng
                                </label>
                            </fieldset>

                            <fieldset className="space-y-3 border-t border-outline-variant/40 pt-4">
                                <legend className="mb-1 text-sm font-bold">Khoảng giá (₫)</legend>
                                <div className="grid grid-cols-2 gap-2">
                                    <label className="text-xs text-outline">
                                        Từ
                                        <input
                                            className="mt-1 w-full rounded-lg bg-surface-container px-2.5 py-2 text-sm text-on-surface"
                                            defaultValue={validMinPrice}
                                            min="0"
                                            name="minPrice"
                                            placeholder="0"
                                            type="number"
                                        />
                                    </label>
                                    <label className="text-xs text-outline">
                                        Đến
                                        <input
                                            className="mt-1 w-full rounded-lg bg-surface-container px-2.5 py-2 text-sm text-on-surface"
                                            defaultValue={validMaxPrice}
                                            min="0"
                                            name="maxPrice"
                                            placeholder="Không giới hạn"
                                            type="number"
                                        />
                                    </label>
                                </div>
                            </fieldset>
                            <button className="w-full rounded-full bg-secondary px-4 py-3 text-sm font-bold text-on-secondary transition hover:opacity-90" type="submit">
                                Áp dụng {selectedFilterCount > 0 ? `${selectedFilterCount} bộ lọc` : "bộ lọc"}
                            </button>
                        </form>

                        <div className="rounded-2xl bg-gradient-to-br from-secondary/15 to-secondary/5 p-5">
                            <p className="text-xs font-bold uppercase tracking-wider text-secondary">Mẹo chọn quà</p>
                            <h3 className="mt-2 text-lg font-bold text-secondary">Chọn món hợp dịp, gửi trao đúng ý</h3>
                            <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                                Dùng bộ lọc giá và danh mục để nhanh chóng tìm sản phẩm phù hợp với nhu cầu của bạn.
                            </p>
                            <Link className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-secondary hover:underline" href="/shop">
                                Xem tất cả sản phẩm <span aria-hidden="true">→</span>
                            </Link>
                        </div>
                    </aside>

                    <div className="min-w-0 space-y-5">
                        <div className="flex flex-col gap-4 rounded-2xl bg-surface-container-lowest p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
                            <div>
                                <h2 className="text-lg font-bold">
                                    {selectedCategoryItem?.name || "Sản phẩm được tuyển chọn"}
                                    {selectedBrandItem ? ` · ${selectedBrandItem.name}` : ""}
                                </h2>
                                <p className="mt-1 text-sm text-on-surface-variant">
                                    {response.total > 0
                                        ? `Hiển thị ${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, response.total)} trong ${response.total} sản phẩm`
                                        : "Không tìm thấy sản phẩm phù hợp"}
                                </p>
                            </div>
                            <form action="/shop" className="flex items-center gap-2">
                                {keyword ? <input name="q" type="hidden" value={keyword} /> : null}
                                {selectedCategory ? <input name="category" type="hidden" value={selectedCategory} /> : null}
                                {selectedBrand ? <input name="brand" type="hidden" value={selectedBrand} /> : null}
                                {validMinPrice !== undefined ? <input name="minPrice" type="hidden" value={validMinPrice} /> : null}
                                {validMaxPrice !== undefined ? <input name="maxPrice" type="hidden" value={validMaxPrice} /> : null}
                                {onSale ? <input name="onSale" type="hidden" value="true" /> : null}
                                {inStock ? <input name="inStock" type="hidden" value="true" /> : null}
                                <label className="text-xs text-outline" htmlFor="sortBy">Sắp xếp</label>
                                <select
                                    className="max-w-[210px] rounded-full bg-surface-container px-3 py-2 text-sm font-semibold text-on-surface"
                                    defaultValue={sortBy}
                                    id="sortBy"
                                    name="sortBy"
                                >
                                    <option value="newest">Mới cập nhật</option>
                                    <option value="popular">Phổ biến nhất</option>
                                    <option value="price-asc">Giá thấp đến cao</option>
                                    <option value="price-desc">Giá cao đến thấp</option>
                                </select>
                                <button className="rounded-full bg-secondary px-3 py-2 text-xs font-bold text-on-secondary" type="submit">
                                    Áp dụng
                                </button>
                            </form>
                        </div>

                        {products.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-outline-variant bg-surface-container-lowest px-5 py-16 text-center">
                                <span aria-hidden="true" className="text-4xl text-outline">⌕</span>
                                <p className="mt-3 font-bold">Chưa có sản phẩm phù hợp</p>
                                <p className="mt-1 text-sm text-on-surface-variant">Thử thay đổi từ khóa hoặc bỏ bớt một vài bộ lọc nhé.</p>
                                <Link className="mt-4 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-on-primary" href="/shop">
                                    Xóa bộ lọc
                                </Link>
                            </div>
                        ) : (
                            <ProductList products={products} />
                        )}

                        {pageCount > 1 ? (
                            <nav aria-label="Phân trang sản phẩm" className="flex items-center justify-center gap-4 pt-3">
                                <Link
                                    aria-disabled={currentPage <= 1}
                                    className={`rounded-full px-5 py-2.5 text-sm font-semibold ${currentPage <= 1 ? "pointer-events-none bg-surface-container text-outline" : "bg-surface-container-lowest text-on-surface hover:bg-secondary-container"}`}
                                    href={shopHref({ page: currentPage - 1 })}
                                >
                                    ← Trước
                                </Link>
                                <span aria-current="page" className="text-sm text-on-surface-variant">
                                    Trang <strong className="text-on-surface">{currentPage}</strong> / {pageCount}
                                </span>
                                <Link
                                    aria-disabled={currentPage >= pageCount}
                                    className={`rounded-full px-5 py-2.5 text-sm font-semibold ${currentPage >= pageCount ? "pointer-events-none bg-surface-container text-outline" : "bg-surface-container-lowest text-on-surface hover:bg-secondary-container"}`}
                                    href={shopHref({ page: currentPage + 1 })}
                                >
                                    Tiếp →
                                </Link>
                            </nav>
                        ) : null}
                    </div>
                </section>
            </div>
        </PageContainer>
    );
};

export default Page;
