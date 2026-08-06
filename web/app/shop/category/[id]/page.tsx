/* eslint-disable @next/next/no-img-element */
import PageContainer from "@/components/layout/page-container";
import { apiProductsByCategory } from "@/services/shop/product";
import ProductList from "@/app/shop/components/product-list";
import { Metadata } from "next";

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;

    return {
        title: `Danh mục ${decodeURIComponent(id)}`,
        description: `Danh sách sản phẩm thuộc danh mục ${decodeURIComponent(id)}`,
    };
}

const Page = async ({ params }: PageProps) => {
    const { id } = await params;
    const normalizedName = decodeURIComponent(id);
    const response = await apiProductsByCategory(normalizedName, { current: 1, pageSize: 12 });
    const products = response.data || [];

    return (
        <PageContainer breadcrumbs={[
            {
                href: '/shop',
                label: 'Cửa hàng'
            },
            {
                href: '/shop/category',
                label: 'Danh mục sản phẩm'
            },
            {
                href: `/shop/category/${normalizedName}`,
                label: decodeURIComponent(normalizedName)
            }
        ]}>
            <div className="bg-slate-100 p-4 rounded-xl">
                <div className="mb-4 rounded-lg bg-white p-4 shadow-sm">
                    <h1 className="text-xl font-semibold text-slate-900">
                        Sản phẩm theo danh mục: {decodeURIComponent(normalizedName)}
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Hiển thị {products.length} sản phẩm
                    </p>
                </div>
                <ProductList products={products} />
            </div>
        </PageContainer>
    );
};

export default Page;