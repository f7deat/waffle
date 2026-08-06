/* eslint-disable @next/next/no-img-element */
import PageContainer from "@/components/layout/page-container";
import { apiProductCategories, apiProducts, apiProductsByCategory } from "@/services/shop/product";
import { SearchOutlined } from "@ant-design/icons";
import ProductList from "./components/product-list";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Sản phẩm - Dịch vụ",
    description: "Danh sách sản phẩm và dịch vụ của chúng tôi",
};

interface PageProps {
    searchParams?: Promise<{
        q?: string;
        category?: string;
    }>;
}

const Page: React.FC<PageProps> = async ({ searchParams }) => {
    const params = await searchParams;
    const keyword = (params?.q || "").trim();
    const selectedCategory = (params?.category || "").trim();

    const categoryResponse = await apiProductCategories({
        current: 1,
        pageSize: 100,
    });
    const categories = categoryResponse.data || [];

    const response = selectedCategory
        ? await apiProductsByCategory(selectedCategory, {
            current: 1,
            pageSize: 12,
            name: keyword || undefined,
        })
        : await apiProducts({
            current: 1,
            pageSize: 12,
            name: keyword || undefined,
        });

    const products = response.data || [];
    const selectedCategoryName = categories.find((x) => x.normalizedName === selectedCategory)?.name;

    return (
        <PageContainer>
            <div className="bg-slate-100 p-4 rounded-xl">
                <div className="mb-4 bg-white rounded-lg p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center">
                        <div className="flex-1 text-lg font-semibold">
                            Danh sách sản phẩm
                            {selectedCategoryName ? `: ${selectedCategoryName}` : ""}
                        </div>
                        <form action="/shop" className="w-full md:w-auto">
                            <div className="bg-slate-100 rounded-lg items-center text-sm flex">
                                {selectedCategory ? (
                                    <input type="hidden" name="category" value={selectedCategory} />
                                ) : null}
                                <button type="submit" className="text-slate-800 px-3" aria-label="Tìm kiếm sản phẩm">
                                    <SearchOutlined />
                                </button>
                                <input
                                    type="text"
                                    name="q"
                                    defaultValue={keyword}
                                    placeholder="Tìm kiếm sản phẩm"
                                    className="bg-slate-100 rounded-xl py-2 min-w-52"
                                />
                            </div>
                        </form>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                        <Link
                            href={keyword ? `/shop?q=${encodeURIComponent(keyword)}` : "/shop"}
                            className={`rounded-full px-3 py-1.5 text-sm transition ${selectedCategory ? "bg-slate-200 text-slate-700 hover:bg-slate-300" : "bg-slate-800 text-white"}`}
                        >
                            Tất cả
                        </Link>
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={keyword
                                    ? `/shop?category=${encodeURIComponent(category.normalizedName)}&q=${encodeURIComponent(keyword)}`
                                    : `/shop?category=${encodeURIComponent(category.normalizedName)}`
                                }
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

                {products.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-10 text-center text-slate-600">
                        Không có sản phẩm phù hợp.
                    </div>
                ) : (
                    <ProductList products={products} />
                )}
            </div>
        </PageContainer>
    );
}

export default Page;