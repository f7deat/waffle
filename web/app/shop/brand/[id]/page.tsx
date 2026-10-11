/* eslint-disable @next/next/no-img-element */
import PageContainer from "@/components/layout/page-container";
import ProductList from "@/app/shop/components/product-list";
import { apiBrandDetail, apiProducts } from "@/services/shop/product";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const response = await apiBrandDetail(decodeURIComponent(id));
    return {
        title: response.data?.name || "Thương hiệu",
        description: response.data?.description || `Sản phẩm thương hiệu ${decodeURIComponent(id)}`,
        openGraph: {
            title: response.data?.name,
            description: response.data?.description,
            images: response.data?.logo ? [{ url: response.data.logo }] : [],
        },
    };
}

const Page: React.FC<PageProps> = async ({ params }) => {
    const { id } = await params;
    const brandResponse = await apiBrandDetail(decodeURIComponent(id));
    const brand = brandResponse.data;
    if (!brandResponse.succeeded || !brand) notFound();

    const productResponse = await apiProducts({
        current: 1,
        pageSize: 100,
        brandId: brand.id,
    });
    const products = productResponse.data || [];

    return (
        <PageContainer breadcrumbs={[
            { href: "/shop", label: "Cửa hàng" },
            { href: "/shop/brand", label: "Thương hiệu" },
            { href: `/shop/brand/${brand.normalizedName}`, label: brand.name },
        ]}>
            <div className="rounded-2xl bg-slate-100 p-4 md:p-6">
                <header className="mb-5 flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm sm:flex-row sm:items-center">
                    {brand.logo ? (
                        <img src={brand.logo} alt={brand.name} className="h-24 w-24 rounded-xl object-contain p-2" />
                    ) : null}
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900">{brand.name}</h1>
                        {brand.description ? <p className="mt-2 text-slate-600">{brand.description}</p> : null}
                        <p className="mt-2 text-sm text-slate-500">{productResponse.total} sản phẩm</p>
                    </div>
                </header>
                {products.length ? (
                    <ProductList products={products} />
                ) : (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
                        Thương hiệu này chưa có sản phẩm.
                    </div>
                )}
            </div>
        </PageContainer>
    );
};

export default Page;
