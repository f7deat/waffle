/* eslint-disable @next/next/no-img-element */
import PageContainer from "@/components/layout/page-container";
import Link from "next/link";
import { SearchOutlined } from "@ant-design/icons";
import { apiProductCategories } from "@/services/shop/product";

interface PageProps {
    searchParams?: Promise<{
        q?: string;
    }>;
}

const Page: React.FC<PageProps> = async ({ searchParams }) => {
    const params = await searchParams;
    const keyword = (params?.q || "").trim();

    const response = await apiProductCategories({
        current: 1,
        pageSize: 100,
        name: keyword || undefined,
    });

    const categories = response.data || [];

    return (
        <PageContainer
            breadcrumbs={[
                {
                    href: "/shop",
                    label: "Cửa hàng",
                },
                {
                    href: "/shop/category",
                    label: "Danh mục sản phẩm",
                },
            ]}
        >
            <div className="rounded-2xl bg-slate-100 p-4 md:p-6">
                <div className="mb-5 rounded-2xl bg-white p-4 shadow-sm md:p-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-xl font-semibold text-slate-900 md:text-2xl">
                                Danh mục sản phẩm
                            </h1>
                            <p className="mt-1 text-sm text-slate-500">
                                Có {categories.length} danh mục đang có sản phẩm
                            </p>
                        </div>

                        <form action="/shop/category" className="w-full md:max-w-sm">
                            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-2">
                                <button type="submit" aria-label="Tìm kiếm danh mục" className="px-2 text-slate-500">
                                    <SearchOutlined />
                                </button>
                                <input
                                    name="q"
                                    defaultValue={keyword}
                                    placeholder="Tìm kiếm danh mục"
                                    className="w-full bg-transparent py-2.5 text-sm text-slate-700 outline-none"
                                />
                            </div>
                        </form>
                    </div>
                </div>

                {categories.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                        <p className="text-slate-700">Không tìm thấy danh mục phù hợp.</p>
                        <p className="mt-1 text-sm text-slate-500">Thử từ khóa khác hoặc quay lại trang cửa hàng.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/shop/category/${category.normalizedName}`}
                                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                            >
                                <div className="relative h-40 w-full overflow-hidden bg-slate-200">
                                    {category.thumbnail ? (
                                        <img
                                            src={category.thumbnail}
                                            alt={category.name}
                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300 text-sm font-medium text-slate-600">
                                            {category.name}
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h2 className="line-clamp-1 text-lg font-semibold text-slate-900">
                                        {category.name}
                                    </h2>
                                    {category.description ? (
                                        <p className="mt-1 line-clamp-2 text-sm text-slate-500">{category.description}</p>
                                    ) : null}
                                    <div className="mt-3 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                                        {category.productCount} sản phẩm
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </PageContainer>
    );
};

export default Page;