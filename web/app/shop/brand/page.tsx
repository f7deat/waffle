/* eslint-disable @next/next/no-img-element */
import PageContainer from "@/components/layout/page-container";
import { apiBrands } from "@/services/shop/product";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Thương hiệu",
    description: "Danh sách thương hiệu sản phẩm",
};

interface PageProps {
    searchParams?: Promise<{ q?: string }>;
}

const Page: React.FC<PageProps> = async ({ searchParams }) => {
    const params = await searchParams;
    const response = await apiBrands({
        current: 1,
        pageSize: 100,
        name: params?.q?.trim() || undefined,
    });
    const brands = response.data || [];

    return (
        <PageContainer breadcrumbs={[
            { href: "/shop", label: "Cửa hàng" },
            { href: "/shop/brand", label: "Thương hiệu" },
        ]}>
            <div className="rounded-2xl bg-slate-100 p-4 md:p-6">
                <div className="mb-5 flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between md:p-5">
                    <div>
                        <h1 className="text-xl font-semibold text-slate-900 md:text-2xl">Thương hiệu</h1>
                        <p className="mt-1 text-sm text-slate-500">{response.total} thương hiệu</p>
                    </div>
                    <form action="/shop/brand" className="w-full md:max-w-sm">
                        <input
                            name="q"
                            defaultValue={params?.q}
                            placeholder="Tìm thương hiệu"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none"
                        />
                    </form>
                </div>
                {brands.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
                        Không tìm thấy thương hiệu phù hợp.
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                        {brands.map((brand) => (
                            <Link
                                key={brand.id}
                                href={`/shop/brand/${brand.normalizedName}`}
                                className="group rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                            >
                                <div className="flex h-32 items-center justify-center overflow-hidden rounded-xl bg-slate-50">
                                    {brand.logo ? (
                                        <img src={brand.logo} alt={brand.name} className="h-full w-full object-contain p-3" />
                                    ) : (
                                        <span className="text-lg font-semibold text-slate-500">{brand.name}</span>
                                    )}
                                </div>
                                <h2 className="mt-3 line-clamp-1 font-semibold text-slate-900 group-hover:text-amber-700">{brand.name}</h2>
                                <p className="mt-1 text-sm text-slate-500">{brand.productCount} sản phẩm</p>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </PageContainer>
    );
};

export default Page;
