/* eslint-disable @next/next/no-img-element */
import BlockRender from "@/components/editor/block-render";
import PageContainer from "@/components/layout/page-container";
import { apiProductDetail, apiProductTags, apiProductsByCategory } from "@/services/shop/product";
import { ProductItemType } from "@/typings/shop/product";
import dayjs from "dayjs";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductGallery from "./product-gallery";
import ProductPurchasePanel from "./product-purchase-panel";
import ProductTabs from "./product-tabs";

interface PageProps {
    params: Promise<{ id: string }>;
}

const formatPrice = (value?: number) =>
    typeof value === "number" ? `${value.toLocaleString("vi-VN")}₫` : "Liên hệ";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    try {
        const { id } = await params;
        const response = await apiProductDetail(id);
        const product = response.data;

        return {
            title: product?.name,
            description: product?.description,
            openGraph: {
                title: product?.name,
                description: product?.description,
                images: product?.thumbnail ? [{ url: product.thumbnail }] : [],
            },
        };
    } catch (error) {
        console.error("Failed to generate product metadata:", error);
        return {
            title: "Sản phẩm",
            description: "Chi tiết sản phẩm",
        };
    }
}

const Page = async ({ params }: PageProps) => {
    const { id } = await params;
    const response = await apiProductDetail(id);
    if (!response.succeeded || !response.data) {
        notFound();
    }

    const product = response.data;
    const imageSources = Array.from(new Set([
        ...(product.images?.map((image) => image.url).filter(Boolean) ?? []),
        product.thumbnail,
    ].filter((url): url is string => Boolean(url))));

    const [tagsResponse, relatedResponse] = await Promise.all([
        apiProductTags(product.id),
        product.category?.normalizedName
            ? apiProductsByCategory(product.category.normalizedName, { current: 1, pageSize: 5 }).catch((error) => {
                console.error("Failed to load related products:", error);
                return null;
            })
            : Promise.resolve(null),
    ]);

    if (!tagsResponse.succeeded) {
        console.error("Failed to load product tags:", tagsResponse);
    }
    const tags = tagsResponse.succeeded ? tagsResponse.data ?? [] : [];
    const relatedProducts = (relatedResponse?.data ?? [])
        .filter((item: ProductItemType) => item.id !== product.id)
        .slice(0, 4);
    const details = [
        product.sku ? { label: "Mã sản phẩm", value: product.sku } : null,
        product.category?.name ? { label: "Danh mục", value: product.category.name } : null,
        product.brand?.name ? { label: "Thương hiệu", value: product.brand.name } : null,
        typeof product.unitInStock === "number"
            ? { label: "Tình trạng kho", value: product.unitInStock > 0 ? `Còn ${product.unitInStock} sản phẩm` : "Tạm hết hàng" }
            : null,
        typeof product.viewCount === "number"
            ? { label: "Lượt xem", value: product.viewCount.toLocaleString("vi-VN") }
            : null,
        product.modifiedDate || product.createdDate
            ? { label: "Cập nhật lần cuối", value: dayjs(product.modifiedDate || product.createdDate).format("DD/MM/YYYY") }
            : null,
    ].filter((detail): detail is { label: string; value: string } => detail !== null);

    return (
        <PageContainer
            breadcrumbs={[
                { href: "/shop", label: "Sản phẩm" },
                ...(product.category?.normalizedName
                    ? [{ href: `/shop/category/${product.category.normalizedName}`, label: product.category.name }]
                    : []),
            ]}
        >
            <main className="min-h-[calc(100vh-28rem)] bg-surface">
                <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:py-10">
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-surface-variant/50 pb-4">
                        <div className="flex flex-wrap items-center gap-2 text-sm text-on-surface-variant">
                            {product.category?.name && (
                                <Link
                                    href={`/shop/category/${product.category.normalizedName}`}
                                    className="transition hover:text-primary"
                                >
                                    {product.category.name}
                                </Link>
                            )}
                            {product.brand?.name && (
                                <>
                                    <span aria-hidden="true">/</span>
                                    <Link href={`/shop/brand/${product.brand.normalizedName}`} className="transition hover:text-primary">
                                        {product.brand.name}
                                    </Link>
                                </>
                            )}
                        </div>
                        {product.sku && (
                            <span className="rounded bg-surface-container px-2.5 py-1 text-xs tracking-wide text-on-surface-variant">
                                MÃ SP: {product.sku}
                            </span>
                        )}
                    </div>

                    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
                        <ProductGallery imageSources={imageSources} productName={product.name} />

                        <div className="flex flex-col gap-5 lg:col-span-5">
                            <div className="flex flex-col gap-3">
                                {product.category?.name && (
                                    <span className="w-fit rounded-full bg-secondary-fixed/50 px-3 py-1 text-xs font-medium text-secondary">
                                        {product.category.name}
                                    </span>
                                )}
                                <h1 className="text-2xl font-bold leading-snug text-on-surface sm:text-3xl">
                                    {product.name}
                                </h1>
                                {product.description && (
                                    <p className="leading-relaxed text-on-surface-variant">{product.description}</p>
                                )}
                            </div>

                            <ProductPurchasePanel
                                id={product.id}
                                name={product.name}
                                normalizedName={product.normalizedName}
                                thumbnail={product.thumbnail}
                                price={product.price}
                                salePrice={product.salePrice}
                                unitInStock={product.unitInStock}
                                sku={product.sku}
                                variants={product.variants ?? []}
                            />
                        </div>
                    </div>

                    <ProductTabs
                        description={product.description}
                        content={product.content?.blocks?.length ? <BlockRender {...product.content} /> : undefined}
                        details={details}
                        tags={tags}
                    />
                </section>

                {relatedProducts.length > 0 && (
                    <section className="bg-surface-container-low px-4 py-10 sm:px-6">
                        <div className="mx-auto flex max-w-7xl flex-col gap-6">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
                                    Khám phá thêm
                                </p>
                                <h2 className="mt-2 text-2xl font-bold text-on-surface">Sản phẩm cùng danh mục</h2>
                            </div>
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                {relatedProducts.map((item) => {
                                    const discounted = typeof item.salePrice === "number"
                                        && typeof item.price === "number"
                                        && item.salePrice < item.price;

                                    return (
                                        <Link
                                            key={item.id}
                                            href={`/shop/${item.normalizedName}`}
                                            className="group overflow-hidden rounded-xl bg-surface-bright shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                                        >
                                            <div className="aspect-square overflow-hidden bg-surface-container">
                                                {item.thumbnail ? (
                                                    <img
                                                        src={item.thumbnail}
                                                        alt={item.name}
                                                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center p-4 text-center text-sm text-on-surface-variant">
                                                        {item.name}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-3 sm:p-4">
                                                <h3 className="line-clamp-2 min-h-10 text-sm font-medium text-on-surface group-hover:text-primary">
                                                    {item.name}
                                                </h3>
                                                <div className="mt-2 flex flex-wrap items-baseline gap-2">
                                                    <span className="font-semibold text-primary">
                                                        {formatPrice(discounted ? item.salePrice : item.price)}
                                                    </span>
                                                    {discounted && (
                                                        <span className="text-xs text-outline line-through">
                                                            {formatPrice(item.price)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                )}
            </main>
        </PageContainer>
    );
};

export default Page;
