import PageContainer from "@/components/layout/page-container";
import ProductList from "@/app/shop/components/product-list";
import { apiProductsByTag } from "@/services/shop/product";
import { apiGetTagByName } from "@/services/contents/tag";
import { Metadata } from "next";
import Link from "next/link";

interface PageProps {
    params: Promise<{ slug: string }>;
    searchParams?: Promise<{ q?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const tagName = decodeURIComponent(slug);

    return {
        title: `Sản phẩm theo tag: ${tagName}`,
        description: `Danh sách sản phẩm thuộc tag ${tagName}`,
    };
}

const Page = async ({ params, searchParams }: PageProps) => {
    const { slug } = await params;
    const normalizedName = decodeURIComponent(slug);
    const keyword = ((await searchParams)?.q || "").trim();

    const [tagResponse, productsResponse] = await Promise.all([
        apiGetTagByName(normalizedName),
        apiProductsByTag(normalizedName, {
            current: 1,
            pageSize: 12,
            name: keyword || undefined,
        }),
    ]);
    const tag = tagResponse.data;
    const products = productsResponse.data || [];
    const tagLabel = tag?.name || normalizedName;

    return (
        <PageContainer breadcrumbs={[
            {
                label: "Cửa hàng",
                href: '/shop'
            },
            {
                label: "Tag sản phẩm",
                href: '/shop/tags'
            },
            {
                label: tagLabel,
                href: `/shop/tags/${normalizedName}`
            }
        ]}>
            <div className="rounded-xl bg-slate-100 p-4">
                <div className="mb-4 rounded-lg bg-white p-4 shadow-sm">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.08em] text-slate-500">Tag sản phẩm</p>
                            <h1 className="text-xl font-semibold text-slate-900 md:text-2xl">{tagLabel}</h1>
                            <p className="mt-1 text-sm text-slate-500">Hiển thị {productsResponse.total || products.length} sản phẩm</p>
                        </div>
                        <form action={`/shop/tags/${normalizedName}`} className="w-full md:w-auto">
                            <div className="flex items-center rounded-lg bg-slate-100 px-3 text-sm">
                                <input
                                    type="text"
                                    name="q"
                                    defaultValue={keyword}
                                    placeholder="Tìm kiếm sản phẩm"
                                    className="w-full min-w-52 bg-transparent py-2 outline-none"
                                />
                            </div>
                        </form>
                    </div>
                </div>

                {products.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-10 text-center text-slate-600">
                        Không có sản phẩm nào thuộc tag này.
                        <div className="mt-3">
                            <Link href="/shop" className="font-medium text-amber-700 hover:text-amber-800">
                                Quay lại cửa hàng
                            </Link>
                        </div>
                    </div>
                ) : (
                    <ProductList products={products} />
                )}
            </div>
        </PageContainer>
    );
};

export default Page;