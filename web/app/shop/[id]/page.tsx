/* eslint-disable @next/next/no-img-element */
import PageContainer from "@/components/layout/page-container";
import AddToCartButton from "@/components/shop/add-to-cart-button";
import { apiProductDetail, apiProductTags } from "@/services/shop/product";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import LatestProducts from "./latest-products";
import BlockRender from "@/components/editor/block-render";
import ProductGallery from "./product-gallery";
import RandomArticleList from "@/components/article/random-list";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import dayjs from "dayjs";
import { faArrowLeft, faArrowRight, faArrowRightArrowLeft, faCheckCircle, faContactCard, faGift, faHeart, faHome, faHourglass, faPiggyBank, faPlay, faPlusCircle, faSearchPlus, faShare, faShoppingCart, faStar, faTags, faUserCheck, faUserShield } from "@fortawesome/free-solid-svg-icons";

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    try {
        const { id } = await params;

        const metaResponse = await apiProductDetail(id);
        const metaData = metaResponse.data || null;

        return {
            title: metaData?.name,
            description: metaData?.description,
            openGraph: {
                title: metaData?.name,
                description: metaData?.description,
                images: metaData?.thumbnail ? [{ url: metaData.thumbnail }] : [],
            },
        };
    } catch (error) {
        console.error('Failed to generate metadata:', error);
        return {
            title: 'Place',
            description: 'Place details',
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
        ...(Array.isArray(product.images) ? product.images.map((x) => x.url).filter(Boolean) : []),
        product.thumbnail,
    ].filter((x): x is string => !!x)));
    const hasDiscount = product.salePrice && product.salePrice < (product.price || 0);
    const discountPercent = hasDiscount
        ? Math.round(((product.price || 0) - product.salePrice!) / (product.price || 0) * 100)
        : 0;

    const localePrice = (value?: number | null) =>
        typeof value === "number" ? `${value.toLocaleString("vi-VN")}đ` : "Liên hệ";

    const tagsResponse = await apiProductTags(product.id);
    const tags = tagsResponse.data || [];

    return (
        <PageContainer breadcrumbs={[
            {
                href: '/shop',
                label: 'Sản phẩm'
            },
            {
                href: `/shop/category/${product.category?.normalizedName}`,
                label: product.category?.name
            }
        ]}>
            <main className="w-full bg-surface min-h-[calc(100vh-28rem)]">
                <div className="flex flex-col w-full">
                    {/* Main Product Section (2-Column Desktop Grid) */}
                    <section className="container mx-auto px-gutter py-4 w-full">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Left Column: Visual Showcase Gallery (7 Columns Desktop) */}
                            <ProductGallery
                                imageSources={imageSources}
                                productName={product.name}
                                unitInStock={product.unitInStock}
                                hasDiscount={!!hasDiscount}
                                discountPercent={discountPercent}
                            />
                            {/* Right Column: Product Detail & Commercial Engine (5 Columns Desktop) */}
                            <div className="lg:col-span-5 flex flex-col gap-4">
                                <div className="container mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2">
                                    <div className="flex items-center gap-4 flex-shrink-0 self-end md:self-auto">
                                        <span className="font-label-sm text-label-sm text-outline tracking-wider bg-surface-container px-2 py-0.5 rounded">
                                            MÃ SP: DDD-TH-8829
                                        </span>
                                        <div className="h-3 w-px bg-surface-variant" />
                                        <div className="flex items-center gap-1">
                                            <button
                                                aria-label="Chia sẻ sản phẩm"
                                                className="p-1.5 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors inline-flex items-center gap-1 text-label-sm"
                                                type="button"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">
                                                    <FontAwesomeIcon icon={faShare} />
                                                </span>
                                                <span className="hidden sm:inline">Chia sẻ</span>
                                            </button>
                                            <button
                                                className="p-1.5 px-2.5 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-primary transition-all inline-flex items-center gap-1.5"
                                                id="btn-wishlist"
                                                type="button"
                                            >
                                                <span
                                                    className="material-symbols-outlined text-[18px] text-primary"
                                                    style={{ fontVariationSettings: '"FILL" 1' }}
                                                >
                                                    <FontAwesomeIcon icon={faHeart} />
                                                </span>
                                                <span
                                                    className="font-label-md text-label-md text-on-surface"
                                                    id="wishlist-count"
                                                >
                                                    348 yêu thích
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {/* Studio Label & Title */}
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center gap-2">
                                        <span className="font-label-sm text-label-sm text-secondary bg-secondary-fixed/50 px-2 py-0.5 rounded-full">
                                            Di Sản Bản Địa OCOP 4★
                                        </span>
                                        <span className="font-label-sm text-label-sm text-tertiary bg-tertiary-fixed/40 px-2 py-0.5 rounded-full">
                                            Top 1 Quà tặng 2025
                                        </span>
                                    </div>
                                    <h1 className="font-bold text-lg md:text-xl lg:text-2xl 2xl:text-3xl text-on-surface leading-snug">
                                        {product.name}
                                    </h1>
                                </div>
                                {/* Rating & Social Proof Block */}
                                <div className="flex items-center flex-wrap gap-2 font-body-sm text-body-sm">
                                    <div className="flex items-center gap-1 bg-surface-container px-2 py-1 rounded-full">
                                        <span
                                            className="material-symbols-outlined text-[16px] text-tertiary-container"
                                            style={{ fontVariationSettings: '"FILL" 1' }}
                                        >
                                            <FontAwesomeIcon icon={faStar} />
                                        </span>
                                        <span className="font-label-md text-label-md text-on-surface">
                                            4.9
                                        </span>
                                        <span className="text-outline text-body-sm">(186 đánh giá)</span>
                                    </div>
                                    <span className="text-outline/40">•</span>
                                    <span className="text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[16px] text-secondary">
                                            <FontAwesomeIcon icon={faCheckCircle} />
                                        </span>
                                        420 đã may đo &amp; giao thành công
                                    </span>
                                </div>
                                {/* Pricing Card Container */}
                                <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-2">
                                    <div className="flex items-baseline gap-4">
                                        <span className="font-bold text-xl md:text-2xl 2xl:text-4xl text-primary tracking-tight">
                                            1.850.000₫
                                        </span>
                                        <span className="font-semibold text-lg text-outline line-through">
                                            2.350.000₫
                                        </span>
                                        <span className="px-2 py-0.5 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm font-semibold">
                                            -21%
                                        </span>
                                    </div>
                                    {/* Reward & Member Perk */}
                                    <div className="flex flex-col gap-1 pt-1">
                                        <div className="flex items-center gap-2 font-label-sm text-label-sm text-primary">
                                            <span className="material-symbols-outlined text-[16px]">
                                                <FontAwesomeIcon icon={faTags} />
                                            </span>
                                            <span>
                                                Nhập mã{" "}
                                                <strong className="bg-primary/10 px-1.5 py-0.5 rounded font-label-md">
                                                    DIDAUCHAOBAN
                                                </strong>{" "}
                                                giảm thêm 100.000₫
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant">
                                            <span className="material-symbols-outlined text-[16px] text-secondary">
                                                <FontAwesomeIcon icon={faPiggyBank} />
                                            </span>
                                            <span>
                                                Tích lũy <strong>+185 Điểm Thổ Địa</strong> vào ví Đi Đâu Đây
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {/* Special Gifts Highlight Box */}
                                <div className="p-4 rounded-xl bg-surface-container-high/60 flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary text-[18px]">
                                            <FontAwesomeIcon icon={faUserShield} />
                                        </span>
                                        <span className="font-label-md text-label-md text-on-surface font-semibold">
                                            Đặc quyền đặt hàng hôm nay:
                                        </span>
                                    </div>
                                    <ul className="flex flex-col gap-1.5 font-body-sm text-body-sm text-on-surface-variant pl-6 list-disc">
                                        <li>
                                            Tặng kèm <strong>01 Túi Thơm Hoa Hồi Thảo Mộc Bản Địa</strong>{" "}
                                            &amp; Hộp Quà Gỗ Khắc Tên.
                                        </li>
                                        <li>
                                            Miễn phí vận chuyển hỏa tốc toàn quốc &amp; Được{" "}
                                            <strong>kiểm tra độ óng tơ</strong> trước khi nhận.
                                        </li>
                                    </ul>
                                </div>
                                {/* Variation 1: Color / Natural Dye Options */}
                                <div className="flex flex-col gap-2 pt-1">
                                    <div className="flex items-center justify-between">
                                        <span className="font-label-md text-label-md text-on-surface">
                                            Màu sắc chất liệu:
                                        </span>
                                        <span
                                            className="font-label-sm text-label-sm text-secondary font-semibold"
                                            id="selected-color-label"
                                        >
                                            Trắng Ngà Vân Mây (Ivory Silk)
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2" id="color-selector">
                                        <button
                                            className="color-opt p-1.5 rounded-full flex items-center gap-2 bg-surface-container-lowest shadow-sm hover:scale-102 transition-all ring-2 ring-primary"
                                            data-color="Trắng Ngà Vân Mây (Ivory Silk)"
                                            type="button"
                                        >
                                            <span className="w-5 h-5 rounded-full bg-[#f4f0e6] shadow-inner" />
                                            <span className="font-body-sm text-body-sm text-on-surface pr-1.5">
                                                Trắng Ngà
                                            </span>
                                        </button>
                                        <button
                                            className="color-opt p-1.5 rounded-full flex items-center gap-2 bg-surface-container-lowest shadow-sm hover:scale-102 transition-all"
                                            data-color="Xanh Rêu Thảo Mộc (Sage Green)"
                                            type="button"
                                        >
                                            <span className="w-5 h-5 rounded-full bg-[#416657] shadow-inner" />
                                            <span className="font-body-sm text-body-sm text-on-surface pr-1.5">
                                                Xanh Rêu
                                            </span>
                                        </button>
                                        <button
                                            className="color-opt p-1.5 rounded-full flex items-center gap-2 bg-surface-container-lowest shadow-sm hover:scale-102 transition-all"
                                            data-color="Nâu Trầm Vỏ Cây (Earthy Terracotta)"
                                            type="button"
                                        >
                                            <span className="w-5 h-5 rounded-full bg-[#8c5042] shadow-inner" />
                                            <span className="font-body-sm text-body-sm text-on-surface pr-1.5">
                                                Nâu Trầm
                                            </span>
                                        </button>
                                    </div>
                                </div>
                                {/* Variation 2: Gender / Silhouette Fit */}
                                <div className="flex flex-col gap-2">
                                    <span className="font-label-md text-label-md text-on-surface">
                                        Dáng áo thiết kế:
                                    </span>
                                    <div
                                        className="grid grid-cols-2 gap-2"
                                        id="gender-fit-selector"
                                    >
                                        <button
                                            className="fit-opt p-3 rounded-xl bg-secondary text-on-secondary shadow-sm text-left flex flex-col gap-0.5 transition-all"
                                            type="button"
                                        >
                                            <span className="font-label-md text-label-md">
                                                Dáng Nữ (Tà Lửng)
                                            </span>
                                            <span className="font-body-sm text-body-sm text-secondary-fixed opacity-90">
                                                Thanh thoát, tà cao bay bổng
                                            </span>
                                        </button>
                                        <button
                                            className="fit-opt p-3 rounded-xl bg-surface-container text-on-surface shadow-sm text-left flex flex-col gap-0.5 hover:bg-surface-container-high transition-all"
                                            type="button"
                                        >
                                            <span className="font-label-md text-label-md">
                                                Dáng Nam (Suông Tự Do)
                                            </span>
                                            <span className="font-body-sm text-body-sm text-on-surface-variant">
                                                Cổ trụ 3cm, phong thái nhã nhặn
                                            </span>
                                        </button>
                                    </div>
                                </div>
                                {/* Variation 3: Sizes & Measure Guide */}
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                        <span className="font-label-md text-label-md text-on-surface">
                                            Kích cỡ áo:
                                        </span>
                                        <button
                                            className="text-primary hover:underline font-label-sm text-label-sm flex items-center gap-1"
                                            type="button"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">
                                                straighten
                                            </span>
                                            Hướng dẫn đo tà &amp; chọn size
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-5 gap-2" id="size-selector">
                                        <button
                                            className="size-btn py-2 text-center rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-all"
                                            type="button"
                                        >
                                            S
                                        </button>
                                        <button
                                            className="size-btn py-2 text-center rounded-lg bg-secondary text-on-secondary font-label-md text-label-md transition-all"
                                            type="button"
                                        >
                                            M
                                        </button>
                                        <button
                                            className="size-btn py-2 text-center rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-all"
                                            type="button"
                                        >
                                            L
                                        </button>
                                        <button
                                            className="size-btn py-2 text-center rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-all"
                                            type="button"
                                        >
                                            XL
                                        </button>
                                        <button
                                            className="size-btn py-2 px-1 text-center rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm transition-all"
                                            title="May đo chuẩn theo số đo của bạn"
                                            type="button"
                                        >
                                            May đo
                                        </button>
                                    </div>
                                    <span className="font-body-sm text-body-sm text-error/90 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[16px]">
                                            <FontAwesomeIcon icon={faHourglass} />
                                        </span>
                                        Chỉ còn 7 tấm lụa đạt tiêu chuẩn dệt cho đợt thủ công này
                                    </span>
                                </div>
                                {/* Quantity & Core Commercial Actions */}
                                <div className="flex flex-col gap-3 pt-2">
                                    <div className="flex items-center gap-4">
                                        {/* Counter */}
                                        <div className="flex items-center rounded-full bg-surface-container p-1 shadow-inner">
                                            <button
                                                aria-label="Giảm số lượng"
                                                className="w-8 h-8 rounded-full bg-surface-bright text-on-surface flex items-center justify-center hover:bg-surface-container-high transition-colors font-semibold"
                                                id="qty-minus"
                                                type="button"
                                            >
                                                -
                                            </button>
                                            <span
                                                className="w-10 text-center font-label-md text-label-md text-on-surface"
                                                id="qty-val"
                                            >
                                                1
                                            </span>
                                            <button
                                                aria-label="Tăng số lượng"
                                                className="w-8 h-8 rounded-full bg-surface-bright text-on-surface flex items-center justify-center hover:bg-surface-container-high transition-colors font-semibold"
                                                id="qty-plus"
                                                type="button"
                                            >
                                                +
                                            </button>
                                        </div>
                                        {/* Add to Cart (Secondary Pill) */}
                                        <button
                                            className="flex-1 py-3 px-space-md rounded-full bg-surface-container-low hover:bg-surface-container text-primary font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-sm transition-all"
                                            id="btn-add-cart"
                                            type="button"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">
                                                <FontAwesomeIcon icon={faShoppingCart} />
                                            </span>
                                            <span>Thêm vào giỏ</span>
                                        </button>
                                    </div>
                                    {/* Buy Now CTA (Primary Prominent Coral) */}
                                    <button
                                        className="w-full py-3.5 px-space-lg rounded-full bg-primary-container hover:bg-primary text-on-primary font-label-lg text-label-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                                        type="button"
                                    >
                                        <span>Mua ngay - Giao tận nơi</span>
                                        <span className="material-symbols-outlined text-[18px]">
                                            <FontAwesomeIcon icon={faArrowRight} />
                                        </span>
                                    </button>
                                    {/* Consult with Local Expert */}
                                    <button
                                        className="w-full py-2.5 px-space-md rounded-full bg-surface-container-low hover:bg-surface-container text-secondary font-label-md text-label-md transition-all flex items-center justify-center gap-1.5"
                                        type="button"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">
                                            <FontAwesomeIcon icon={faContactCard} />
                                        </span>
                                        <span>Đặt hẹn may đo tại xưởng hoặc tư vấn Zalo với Thổ Địa</span>
                                    </button>
                                </div>
                                {/* Trust Badges & Guarantee Matrix */}
                                <div className="grid grid-cols-1 gap-2 pt-2">
                                    <div className="flex items-center gap-2.5 text-on-surface-variant font-body-sm text-body-sm">
                                        <span className="material-symbols-outlined text-secondary text-[18px]">
                                            <FontAwesomeIcon icon={faUserCheck} />
                                        </span>
                                        <span>
                                            100% sợi tơ tự nhiên nguyên bản, kèm thẻ chứng thư làng nghề.
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2.5 text-on-surface-variant font-body-sm text-body-sm">
                                        <span className="material-symbols-outlined text-secondary text-[18px]">
                                            <FontAwesomeIcon icon={faArrowRightArrowLeft} />
                                        </span>
                                        <span>Đổi cỡ miễn phí trong 7 ngày nếu mặc chưa vừa ý.</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 text-on-surface-variant font-body-sm text-body-sm">
                                        <span className="material-symbols-outlined text-secondary text-[18px]">
                                            <FontAwesomeIcon icon={faGift} />
                                        </span>
                                        <span>
                                            Tặng thẻ giảm 15% cho BST gốm mộc và đồ trang trí bàn trà.
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* Cross-Sell / Combo Set Section "Phối Đồ & Không Gian Sống Cùng Thổ Địa" */}
                    <section className="w-full bg-surface-container-low py-8 px-gutter my-4">
                        <div className="container mx-auto flex flex-col gap-space-lg">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-2">
                                <div>
                                    <span className="font-label-sm text-label-sm text-primary tracking-widest uppercase">
                                        Gợi ý phong cách sống bản địa
                                    </span>
                                    <h2 className="font-headline-lg text-headline-lg text-on-surface">
                                        Combo Nghệ Thuật: Diện Áo Lụa &amp; Trang Trí Góc Trà Tĩnh Tại
                                    </h2>
                                    <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                                        Phối trọn bộ trang phục lụa cùng vật phẩm gốm mộc Bát Tràng độc
                                        bản để tôn vinh nét sống thanh lịch.
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 bg-surface-bright px-3 py-1.5 rounded-full shadow-sm">
                                    <span className="material-symbols-outlined text-secondary text-[18px]">
                                        <FontAwesomeIcon icon={faPiggyBank} />
                                    </span>
                                    <span className="font-label-sm text-label-sm text-secondary font-semibold">
                                        Tiết kiệm 260.000₫ khi mua combo
                                    </span>
                                </div>
                            </div>
                            {/* Combo Products Multi-Card Row */}
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                {/* Item 1 (The Main Dress) */}
                                <div className="md:col-span-3 bg-surface-bright rounded-xl p-4 shadow-sm flex flex-col gap-2">
                                    <div
                                        className="w-full aspect-square rounded-lg bg-cover bg-center"
                                        data-alt="Modern silk Ao Dai neatly folded on textured bamboo surface with gentle studio light."
                                        style={{
                                            backgroundImage:
                                                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBO0S_X17Hqc8lPNX7Nn0X7nJ5Qoi0Ee28YX90y1WX0svKDQ-7K1tP-yx5MRoT9W03o55GIgRUYg5e3V3mqAt-AkQnqaBFQ2SZGombpaS7THX7FgGWTOs6-IhadrbFWq7wpP5saPoIlt3njA7P0f2gNrx7_tIxOEd3AnkPSgp8WxSCm49gg6cKoTVCKdmm6uxxB2VDkPVfl8jH65hp0grq6mwdF4RT0w2gYk4NfBXlZ5VQpgQRUr_GrQQ")'
                                        }}
                                    />
                                    <div className="flex flex-col">
                                        <span className="font-label-sm text-label-sm text-outline">
                                            Vật phẩm chính
                                        </span>
                                        <h3 className="font-label-md text-label-md text-on-surface truncate">
                                            Áo Dài Lụa Tơ Tằm Hà Đông
                                        </h3>
                                        <span className="font-label-lg text-label-lg text-primary font-semibold mt-1">
                                            1.850.000₫
                                        </span>
                                    </div>
                                </div>
                                <div className="hidden md:flex md:col-span-1 justify-center text-outline">
                                    <span className="material-symbols-outlined text-[28px]">
                                        <FontAwesomeIcon icon={faPlusCircle} />
                                    </span>
                                </div>
                                {/* Item 2 (Ceramic Decor) */}
                                <div className="md:col-span-3 bg-surface-bright rounded-xl p-4 shadow-sm flex flex-col gap-2">
                                    <div
                                        className="w-full aspect-square rounded-lg bg-cover bg-center"
                                        data-alt="Artisanal Bat Trang crackle-glaze bell-shaped ceramic flower vase placed on wooden tea tray with dry lotus bloom."
                                        style={{
                                            backgroundImage:
                                                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDByhifeKO1X8-ET1Nw51vC-a0W4Q1ZmIJPotHR0uHe6SL0bG3mnw2cs08jvTs-Nc0ELZma8O2fRBN_pc8QVpB97Mo96ooBCEV_0NIx69Rc0Ht_1GzUs3sslaossNaRMDfFc0VV-xHs35JEwNaOwtrUGfy9Wn4v3asr0iSAfncVozQwOy2FOPL3PqelCCylhoH_YrRsoszrgyK05A4uujTiIATHRPW33IWmxEjiDe0aTO8v1Hva0lf7YA")'
                                        }}
                                    />
                                    <div className="flex flex-col">
                                        <span className="font-label-sm text-label-sm text-outline">
                                            Gốm mộc decor
                                        </span>
                                        <h3 className="font-label-md text-label-md text-on-surface truncate">
                                            Bình Gốm Men Rạn Chuông Bát Tràng
                                        </h3>
                                        <div className="flex items-baseline gap-2 mt-1">
                                            <span className="font-label-lg text-label-lg text-primary font-semibold">
                                                420.000₫
                                            </span>
                                            <span className="font-body-sm text-body-sm text-outline line-through">
                                                490.000₫
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="hidden md:flex md:col-span-1 justify-center text-outline">
                                    <span className="material-symbols-outlined text-[28px]">
                                        <FontAwesomeIcon icon={faPlusCircle} />
                                    </span>
                                </div>
                                {/* Item 3 (Silk Accessory) */}
                                <div className="md:col-span-2 bg-surface-bright rounded-xl p-4 shadow-sm flex flex-col gap-2">
                                    <div
                                        className="w-full aspect-square rounded-lg bg-cover bg-center"
                                        data-alt="Handcrafted square silk scarf accessory with hand-rolled hems and muted natural botanical dye pattern."
                                        style={{
                                            backgroundImage:
                                                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDhqq_R7vB_-1tURAUYxXPe6YyiGtUK7Agy4yruZC4PKZOTOl1BZCod8BSj6XqxB6s3qFe7DcnspZF2XeUY8wC1lQaC3ZVmKanV4lu-D5qOqCmS8rs1hxibPyKKi9aaxHbgPnC6-yLHX53AmVvqhhpYFSJTZVlJuSmpZ7PCnChbaDKvjf9YvgyxPeAvz0pbYHWI1s6fuDPf-1y7oQ97hreGOhHq3K43lhvG9OEnjcbWmaT8RAtmlF6JPQ")'
                                        }}
                                    />
                                    <div className="flex flex-col">
                                        <span className="font-label-sm text-label-sm text-outline">
                                            Phụ kiện kèm
                                        </span>
                                        <h3 className="font-label-md text-label-md text-on-surface truncate">
                                            Khăn Lụa Tơ Tằm Vuông
                                        </h3>
                                        <span className="font-label-lg text-label-lg text-primary font-semibold mt-1">
                                            280.000₫
                                        </span>
                                    </div>
                                </div>
                                {/* Combo Checkout Box */}
                                <div className="md:col-span-2 bg-surface-container rounded-xl p-4 flex flex-col justify-between h-full gap-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                                            Giá trọn bộ 3 món
                                        </span>
                                        <span className="font-headline-lg text-headline-lg text-primary font-bold">
                                            2.290.000₫
                                        </span>
                                        <span className="font-body-sm text-body-sm text-outline line-through">
                                            2.550.000₫
                                        </span>
                                    </div>
                                    <button
                                        className="w-full py-2.5 px-3 rounded-full bg-secondary hover:bg-on-secondary-container text-on-secondary font-label-md text-label-md transition-all flex items-center justify-center gap-1 shadow-md"
                                        type="button"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">
                                            <FontAwesomeIcon icon={faShoppingCart} />
                                        </span>
                                        <span>Thêm cả bộ (+ 1 click)</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* Detailed Tabbed Storytelling Section */}
                    <section className="container mx-auto px-gutter py-6 w-full">
                        {/* Navigation Tabs */}
                        <div
                            className="flex items-center gap-4 overflow-x-auto border-b border-surface-variant/60 pb-1 scrollbar-none"
                            id="product-tabs"
                        >
                            <button
                                className="tab-trigger pb-3 font-title text-title text-primary relative whitespace-nowrap active-tab"
                                data-tab="tab-story"
                                type="button"
                            >
                                Câu chuyện di sản &amp; Chất liệu
                                <span className="tab-line absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                            </button>
                            <button
                                className="tab-trigger pb-3 font-title text-title text-on-surface-variant hover:text-on-surface relative whitespace-nowrap"
                                data-tab="tab-specs"
                                type="button"
                            >
                                Thông số kỹ thuật &amp; Kích cỡ
                                <span className="tab-line absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full opacity-0" />
                            </button>
                            <button
                                className="tab-trigger pb-3 font-title text-title text-on-surface-variant hover:text-on-surface relative whitespace-nowrap"
                                data-tab="tab-decor"
                                type="button"
                            >
                                Bộ sưu tập Đồ Decor kết hợp
                                <span className="tab-line absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full opacity-0" />
                            </button>
                            <button
                                className="tab-trigger pb-3 font-title text-title text-on-surface-variant hover:text-on-surface relative whitespace-nowrap"
                                data-tab="tab-reviews"
                                type="button"
                            >
                                Đánh giá cộng đồng (186)
                                <span className="tab-line absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full opacity-0" />
                            </button>
                            <button
                                className="tab-trigger pb-3 font-title text-title text-on-surface-variant hover:text-on-surface relative whitespace-nowrap"
                                data-tab="tab-care"
                                type="button"
                            >
                                Bảo quản &amp; Giặt ủi lụa
                                <span className="tab-line absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full opacity-0" />
                            </button>
                        </div>
                        {/* Tab 1: Story & Heritage Material */}
                        <div
                            className="tab-content py-8 flex flex-col gap-8"
                            id="tab-story"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                                <div className="lg:col-span-6 flex flex-col gap-4">
                                    <span className="font-label-sm text-label-sm text-secondary font-bold tracking-widest uppercase">
                                        Từ kén tằm bên bờ sông Đáy
                                    </span>
                                    <h2 className="font-headline-lg text-headline-lg text-on-surface">
                                        Mỗi thớ lụa là một khúc ca của thời gian và đôi bàn tay nghệ nhân
                                    </h2>
                                    <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                                        Khác với lụa công nghiệp dệt từ sợi tổng hợp pha bóng, dòng lụa tơ
                                        tằm Nha Xá - Vạn Phúc giữ nguyên lớp sáp tơ tự nhiên (sericin) mộc
                                        mạc. Sợi dệt không ép phẳng tuyệt đối mà để lộ những nốt sần hạt
                                        gạo duyên dáng đặc trưng – minh chứng cho quy trình dệt thoi gỗ
                                        thủ công truyền thống.
                                    </p>
                                    <div className="grid grid-cols-3 gap-2 pt-2">
                                        <div className="p-4 rounded-xl bg-surface-container-low flex flex-col">
                                            <span className="font-headline-md text-headline-md text-primary font-bold">
                                                1.200
                                            </span>
                                            <span className="font-body-sm text-body-sm text-on-surface-variant">
                                                Kén tằm tự nhiên cho 1 mét vải
                                            </span>
                                        </div>
                                        <div className="p-4 rounded-xl bg-surface-container-low flex flex-col">
                                            <span className="font-headline-md text-headline-md text-secondary font-bold">
                                                14 Ngày
                                            </span>
                                            <span className="font-body-sm text-body-sm text-on-surface-variant">
                                                Ươm tơ &amp; thêu tay tỉ mỉ
                                            </span>
                                        </div>
                                        <div className="p-4 rounded-xl bg-surface-container-low flex flex-col">
                                            <span className="font-headline-md text-headline-md text-tertiary-container font-bold">
                                                0%
                                            </span>
                                            <span className="font-body-sm text-body-sm text-on-surface-variant">
                                                Hóa chất nhuộm tẩy độc hại
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="lg:col-span-6 grid grid-cols-2 gap-4">
                                    <div
                                        className="aspect-[3/4] rounded-xl bg-cover bg-center shadow-sm"
                                        data-alt="Vietnamese craftsman working meticulously on an antique wooden weaving loom, shuttle flying with creamy white natural silk yarn in workshop."
                                        style={{
                                            backgroundImage:
                                                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA78aHxvTgH2xgnJ4_sn2IXQjFE_rYtjFv5uZ-t1C4FDMIJzysiDdeYlM7O_A0FjY8ALYiz0hRVSX6Elr0X0EEmDr7KA3YGGgvAToK4-WYxzD6cpqF_Rtbs-GbQIdXkxUN_MJlDeOC5lEqHz_P-3Jy5fHY4mDbP9kSkX99bpHs60bAg8pJuKJDCONZR8QbJ1IjZFaF9dyK3RkY4HPb4SvGrS1CtR-xlrynV7exvA_0Z0mucYX-vZQYCJQ")'
                                        }}
                                    />
                                    <div className="flex flex-col gap-4">
                                        <div
                                            className="aspect-square rounded-xl bg-cover bg-center shadow-sm"
                                            data-alt="Close up of golden silkworm cocoons resting in shallow woven bamboo basket under warm sun."
                                            style={{
                                                backgroundImage:
                                                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD8y1xVVIrOb-ASlDnnwLyqOX2fJXaVCKz41CTqu73Lki572MgUy9rGgkQEGuNsPbc650KQ4QU-MkqFBAn9BOKXAgjH1qSeBBzqcIicPkG6KdkZKmvT0z6MRyZrsrN-id_URvzt-08u0ybjNT9M0y2z3p1I1PbJZfmHIrrX0w3biFEfEFWC3x6v2VwLS95VxQLF8BFwRfJ-wrGXDCmd5z1i0V1Uo9fwObfYKSZZo33urXScnMppkRcMcQ")'
                                            }}
                                        />
                                        <div
                                            className="aspect-square rounded-xl bg-cover bg-center shadow-sm"
                                            data-alt="Artisan hand holding wooden embroidery hoop, threading soft white floral silk thread onto fabric."
                                            style={{
                                                backgroundImage:
                                                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB2U0BnWIhabaPivBcMkmrGpNU_SXF_M3XK1B-o05Wm0_DAyips30TaVE9L-JdCt81mR4G0H8W3pP8C7NRiMJsXBIHWc1f6sbRLd9yeKRI5samiwwaWkhuoeyFTe_GwDAaCJisS16A5GprdV0hSX1Vex8zx_f-tgkCUCTFcuoS8LEWdlP2gCEWdNrura_RQTrcKr2SP8jGIaBahj1yCBkZHZY8dZnfIx8uaor4sDZglyIyVSpq76j6ATQ")'
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Tab 2: Specs Table */}
                        <div className="tab-content py-space-xl hidden" id="tab-specs">
                            <div className="max-w-4xl mx-auto rounded-xl bg-surface-container-lowest shadow-sm p-space-lg flex flex-col gap-4">
                                <h3 className="font-title text-title text-on-surface">
                                    Bảng thông số chi tiết trang phục
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-space-xl gap-y-space-md font-body-md text-body-md">
                                    <div className="flex justify-between py-2 border-b border-surface-variant/40">
                                        <span className="text-on-surface-variant">
                                            Xuất xứ chất liệu:
                                        </span>
                                        <span className="font-label-md text-label-md text-on-surface">
                                            Làng lụa Vạn Phúc (Hà Đông, Hà Nội)
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-surface-variant/40">
                                        <span className="text-on-surface-variant">Thành phần sợi:</span>
                                        <span className="font-label-md text-label-md text-on-surface">
                                            100% Tơ tằm tự nhiên (Mulberry Silk)
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-surface-variant/40">
                                        <span className="text-on-surface-variant">
                                            Kỹ thuật tạo hoa văn:
                                        </span>
                                        <span className="font-label-md text-label-md text-on-surface">
                                            Thêu tay nổi truyền thống bằng chỉ tơ bóng
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-surface-variant/40">
                                        <span className="text-on-surface-variant">Phom dáng (Fit):</span>
                                        <span className="font-label-md text-label-md text-on-surface">
                                            Dáng suông thoải mái (Relaxed Loose Fit)
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-surface-variant/40">
                                        <span className="text-on-surface-variant">Độ dày vải:</span>
                                        <span className="font-label-md text-label-md text-on-surface">
                                            16 Momme (Thoáng mát, giữ dáng tốt)
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-surface-variant/40">
                                        <span className="text-on-surface-variant">Cúc áo:</span>
                                        <span className="font-label-md text-label-md text-on-surface">
                                            Cúc bọc lụa thủ công cùng chất liệu
                                        </span>
                                    </div>
                                </div>
                                {/* Size Guide Chart Inline */}
                                <div className="mt-space-md pt-space-md border-t border-surface-variant/50">
                                    <h4 className="font-label-lg text-label-lg text-on-surface mb-3">
                                        Bảng kích thước tham khảo (cm):
                                    </h4>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left font-body-sm text-body-sm">
                                            <thead className="bg-surface-container text-on-surface font-label-sm">
                                                <tr>
                                                    <th className="p-2.5 rounded-l-lg">Size</th>
                                                    <th className="p-2.5">Rộng vai</th>
                                                    <th className="p-2.5">Vòng ngực</th>
                                                    <th className="p-2.5">Dài tay áo</th>
                                                    <th className="p-2.5">Dài tà áo (Nữ/Nam)</th>
                                                    <th className="p-2.5 rounded-r-lg">Cân nặng phù hợp</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-surface-variant/30 text-on-surface-variant">
                                                <tr>
                                                    <td className="p-2.5 font-label-md text-on-surface">S</td>
                                                    <td className="p-2.5">37 - 38</td>
                                                    <td className="p-2.5">82 - 86</td>
                                                    <td className="p-2.5">48</td>
                                                    <td className="p-2.5">105 / 112</td>
                                                    <td className="p-2.5">45 - 52 kg</td>
                                                </tr>
                                                <tr>
                                                    <td className="p-2.5 font-label-md text-on-surface">M</td>
                                                    <td className="p-2.5">39 - 40</td>
                                                    <td className="p-2.5">88 - 92</td>
                                                    <td className="p-2.5">49</td>
                                                    <td className="p-2.5">108 / 115</td>
                                                    <td className="p-2.5">53 - 60 kg</td>
                                                </tr>
                                                <tr>
                                                    <td className="p-2.5 font-label-md text-on-surface">L</td>
                                                    <td className="p-2.5">41 - 42</td>
                                                    <td className="p-2.5">94 - 98</td>
                                                    <td className="p-2.5">50</td>
                                                    <td className="p-2.5">110 / 118</td>
                                                    <td className="p-2.5">61 - 68 kg</td>
                                                </tr>
                                                <tr>
                                                    <td className="p-2.5 font-label-md text-on-surface">XL</td>
                                                    <td className="p-2.5">43 - 44</td>
                                                    <td className="p-2.5">100 - 106</td>
                                                    <td className="p-2.5">51</td>
                                                    <td className="p-2.5">112 / 120</td>
                                                    <td className="p-2.5">69 - 78 kg</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Tab 3: Curated Home Decor Matches */}
                        <div className="tab-content py-space-xl hidden" id="tab-decor">
                            <div className="flex flex-col gap-space-lg">
                                <div>
                                    <h3 className="font-headline-md text-headline-md text-on-surface">
                                        Vật phẩm thủ công bản địa tạo điểm nhấn không gian sống
                                    </h3>
                                    <p className="font-body-md text-body-md text-on-surface-variant">
                                        Sự hài hòa giữa trang phục lụa và đồ decor gốm mây tre đan tạo nên
                                        phong vị văn hóa bình an.
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="p-4 bg-surface-container-lowest rounded-xl shadow-sm flex flex-col gap-3">
                                        <div
                                            className="aspect-square rounded-lg bg-cover bg-center"
                                            data-alt="Handcrafted minimalist earthy ceramic vase on raw wood tabletop with warm side lighting."
                                            style={{
                                                backgroundImage:
                                                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuApzNJLn96HfmnSmsB1tXk8v9xFeSOr7SZ7vAlOBlxhd2TI7q5LWWy4YB7BySdUhrlyk-MxSlyVN-awU0q0pCitl9FTZAGqT_mvHVPpidqkBh12t2ppFEyuQ3Botvgrfr6Dbq8CRgkIem4-jXeqLnCAfkqOB9dky8LYK37AnrMBqcXh8zaLgjabEi60tP2sBrVOe-WBfYAqY8o3dFBehnGGmMl-4Ky2-YsD83nHD0dmW-UF2D_lSgkOuA")'
                                            }}
                                        />
                                        <div>
                                            <span className="font-label-sm text-label-sm text-secondary">
                                                Gốm Bát Tràng
                                            </span>
                                            <h4 className="font-title text-title text-on-surface">
                                                Bình Gốm Vuốt Tay Mộc Sắc Tro
                                            </h4>
                                            <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                                                Nung củi tự nhiên tại 1250°C, giữ nguyên vệt tro bay ngẫu
                                                hứng.
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between pt-2">
                                            <span className="font-label-lg text-label-lg text-primary font-semibold">
                                                520.000₫
                                            </span>
                                            <button
                                                className="px-3 py-1.5 rounded-full bg-surface-container hover:bg-secondary hover:text-on-secondary font-label-sm text-label-sm transition-all"
                                                type="button"
                                            >
                                                Xem chi tiết
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-surface-container-lowest rounded-xl shadow-sm flex flex-col gap-3">
                                        <div
                                            className="aspect-square rounded-lg bg-cover bg-center"
                                            data-alt="Traditional woven bamboo lantern hanging in cozy tea room interior, casting warm intricate geometric shadows."
                                            style={{
                                                backgroundImage:
                                                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBr-G6mMQS7q6yMcRD7ZDmkYFul-KVFt94vbBsJk8g5m-lcvu-5r5WwqAlVW1PdEuMUHmGi2_3DOkx3RARuquZ66aK3ufIhUjSOR9RrTKm9teJE_fhHN-ORfOYe2Z_R8MgTdS1PnfRS-D_IAoQ43Ig6bkcQLkHFKviNunMhSroa8B7pqofrF_NjAGd0_6djoWE5hdbcDp8T3PxXjx3LafYtRYGyFGje3rFM6e5KtFFo5GPxtKKfiM_ujA")'
                                            }}
                                        />
                                        <div>
                                            <span className="font-label-sm text-label-sm text-secondary">
                                                Mây tre Đan Phượng
                                            </span>
                                            <h4 className="font-title text-title text-on-surface">
                                                Đèn Lồng Mây Tre Nan Mảnh Tĩnh Tại
                                            </h4>
                                            <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                                                Xử lý hun khói thảo dược chống mối mọt tự nhiên không hóa
                                                chất.
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between pt-2">
                                            <span className="font-label-lg text-label-lg text-primary font-semibold">
                                                390.000₫
                                            </span>
                                            <button
                                                className="px-3 py-1.5 rounded-full bg-surface-container hover:bg-secondary hover:text-on-secondary font-label-sm text-label-sm transition-all"
                                                type="button"
                                            >
                                                Xem chi tiết
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-surface-container-lowest rounded-xl shadow-sm flex flex-col gap-3">
                                        <div
                                            className="aspect-square rounded-lg bg-cover bg-center"
                                            data-alt="Mother of pearl inlaid wooden tea tray with intricate floral inlay beside ceramic teacups."
                                            style={{
                                                backgroundImage:
                                                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBvL3BjR66rN6VIJTr-8mBUGA90IXc3dODdWkbzorUOdW-6eNYufeDBsc6ndR6Uywl8Htw-L9DE5pPzDhwSpxfBwN3zc3aOkJboHwz9tTTK_PtLxCyrL7s4ZICouJuQmlVGhCyaYEYVmF_EDTuKqQYqPrM9_ASGumsJ28gXhQBo4tQqEPEd2L4eVGDcKE55cb-CzLvwgLVChmDwg5RzWeKuSTJ9AfG_IwRfsMZabHW2GqPowAHIue3hlw")'
                                            }}
                                        />
                                        <div>
                                            <span className="font-label-sm text-label-sm text-secondary">
                                                Khảm trai Nam Định
                                            </span>
                                            <h4 className="font-title text-title text-on-surface">
                                                Khay Trà Gỗ Xà Cừ Cẩn Ốc Tinh Tế
                                            </h4>
                                            <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                                                Gỗ xà cừ già nguyên tấm khảm vỏ trai biển phát quang 7 màu kỳ
                                                ảo.
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between pt-2">
                                            <span className="font-label-lg text-label-lg text-primary font-semibold">
                                                680.000₫
                                            </span>
                                            <button
                                                className="px-3 py-1.5 rounded-full bg-surface-container hover:bg-secondary hover:text-on-secondary font-label-sm text-label-sm transition-all"
                                                type="button"
                                            >
                                                Xem chi tiết
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Tab 4: Reviews & Rating Analytics */}
                        <div className="tab-content py-space-xl hidden" id="tab-reviews">
                            <div className="flex flex-col gap-space-lg">
                                {/* Rating Header Overview */}
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-space-lg p-space-lg rounded-xl bg-surface-container-low items-center">
                                    <div className="md:col-span-4 flex flex-col items-center justify-center text-center">
                                        <span className="font-display text-display text-primary leading-none font-bold">
                                            4.9
                                        </span>
                                        <div className="flex items-center gap-1 my-2">
                                            <span
                                                className="material-symbols-outlined text-tertiary-container text-[22px]"
                                                style={{ fontVariationSettings: '"FILL" 1' }}
                                            >
                                                star
                                            </span>
                                            <span
                                                className="material-symbols-outlined text-tertiary-container text-[22px]"
                                                style={{ fontVariationSettings: '"FILL" 1' }}
                                            >
                                                star
                                            </span>
                                            <span
                                                className="material-symbols-outlined text-tertiary-container text-[22px]"
                                                style={{ fontVariationSettings: '"FILL" 1' }}
                                            >
                                                star
                                            </span>
                                            <span
                                                className="material-symbols-outlined text-tertiary-container text-[22px]"
                                                style={{ fontVariationSettings: '"FILL" 1' }}
                                            >
                                                star
                                            </span>
                                            <span
                                                className="material-symbols-outlined text-tertiary-container text-[22px]"
                                                style={{ fontVariationSettings: '"FILL" 1' }}
                                            >
                                                star
                                            </span>
                                        </div>
                                        <span className="font-body-sm text-body-sm text-on-surface-variant">
                                            Dựa trên 186 trải nghiệm kiểm thực
                                        </span>
                                    </div>
                                    {/* Rating Bar Chart */}
                                    <div className="md:col-span-5 flex flex-col gap-1.5 font-body-sm text-body-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="w-8 text-right font-label-sm">5 sao</span>
                                            <div className="flex-1 h-2 rounded-full bg-surface-variant overflow-hidden">
                                                <div
                                                    className="h-full bg-primary rounded-full"
                                                    style={{ width: "92%" }}
                                                />
                                            </div>
                                            <span className="w-10 text-on-surface-variant text-label-sm">
                                                92%
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="w-8 text-right font-label-sm">4 sao</span>
                                            <div className="flex-1 h-2 rounded-full bg-surface-variant overflow-hidden">
                                                <div
                                                    className="h-full bg-primary/70 rounded-full"
                                                    style={{ width: "7%" }}
                                                />
                                            </div>
                                            <span className="w-10 text-on-surface-variant text-label-sm">
                                                7%
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="w-8 text-right font-label-sm">3 sao</span>
                                            <div className="flex-1 h-2 rounded-full bg-surface-variant overflow-hidden">
                                                <div
                                                    className="h-full bg-primary/40 rounded-full"
                                                    style={{ width: "1%" }}
                                                />
                                            </div>
                                            <span className="w-10 text-on-surface-variant text-label-sm">
                                                1%
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="w-8 text-right font-label-sm">2 sao</span>
                                            <div className="flex-1 h-2 rounded-full bg-surface-variant overflow-hidden">
                                                <div
                                                    className="h-full bg-primary/20 rounded-full"
                                                    style={{ width: "0%" }}
                                                />
                                            </div>
                                            <span className="w-10 text-on-surface-variant text-label-sm">
                                                0%
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="w-8 text-right font-label-sm">1 sao</span>
                                            <div className="flex-1 h-2 rounded-full bg-surface-variant overflow-hidden">
                                                <div
                                                    className="h-full bg-primary/20 rounded-full"
                                                    style={{ width: "0%" }}
                                                />
                                            </div>
                                            <span className="w-10 text-on-surface-variant text-label-sm">
                                                0%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="md:col-span-3 flex flex-col items-center justify-center gap-2">
                                        <button
                                            className="w-full py-2.5 px-4 rounded-full bg-surface-bright text-on-surface hover:bg-surface-container font-label-md text-label-md shadow-sm transition-all flex items-center justify-center gap-1.5"
                                            type="button"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">
                                                rate_review
                                            </span>
                                            <span>Viết cảm nhận của bạn</span>
                                        </button>
                                        <span className="font-label-sm text-label-sm text-outline">
                                            Đã mua qua Đi Đâu Đây
                                        </span>
                                    </div>
                                </div>
                                {/* Review Cards List */}
                                <div className="flex flex-col gap-4">
                                    {/* Review 1 */}
                                    <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-10 h-10 rounded-full bg-cover bg-center"
                                                    data-alt="Portrait of an elegant young Vietnamese woman in her late 20s smiling warmly."
                                                    style={{
                                                        backgroundImage:
                                                            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCY9wRknV21y7dAtHiafMK2xN25tC1_ZG9IsuXh_8q7V9TBI0hUn-jehfAi96lOuWJvJajEb7P4ZRr0JrWIx7MmT8I85Gt99VKz0vhqAzpWzWI6qGQw76klX1SjF7_AVDFZM3i6fzchGLsYscI_a4WuyGwuafVTsZe51jTPWEQIZmzgTg0gSJY2RTuE7jXusgWVRx-RHgcjfmHWOTshJcBFX-NGjGwrxVnUwEmKCnJEjk33OQ0_MxvZZw")'
                                                    }}
                                                />
                                                <div>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="font-label-md text-label-md text-on-surface">
                                                            Lê Hoàng Yến
                                                        </span>
                                                        <span className="material-symbols-outlined text-[15px] text-secondary">
                                                            verified
                                                        </span>
                                                    </div>
                                                    <span className="font-body-sm text-body-sm text-outline">
                                                        Đã may size M • Màu Trắng Ngà • 2 ngày trước
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex text-tertiary-container">
                                                <span
                                                    className="material-symbols-outlined text-[16px]"
                                                    style={{ fontVariationSettings: '"FILL" 1' }}
                                                >
                                                    star
                                                </span>
                                                <span
                                                    className="material-symbols-outlined text-[16px]"
                                                    style={{ fontVariationSettings: '"FILL" 1' }}
                                                >
                                                    star
                                                </span>
                                                <span
                                                    className="material-symbols-outlined text-[16px]"
                                                    style={{ fontVariationSettings: '"FILL" 1' }}
                                                >
                                                    star
                                                </span>
                                                <span
                                                    className="material-symbols-outlined text-[16px]"
                                                    style={{ fontVariationSettings: '"FILL" 1' }}
                                                >
                                                    star
                                                </span>
                                                <span
                                                    className="material-symbols-outlined text-[16px]"
                                                    style={{ fontVariationSettings: '"FILL" 1' }}
                                                >
                                                    star
                                                </span>
                                            </div>
                                        </div>
                                        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                                            "Lụa sờ vào êm mát đến ngỡ ngàng, độ rủ tự nhiên rất sang mà
                                            không hề dính sát người khi trời nóng ẩm. Mũi thêu hoa sen trên
                                            ngực áo rất khéo, chỉ tơ óng nhẹ khi ra ánh nắng. Mình mua thêm
                                            bình hoa men rạn đặt ở góc trà, ai đến nhà cũng khen."
                                        </p>
                                        <div className="flex gap-2 pt-1">
                                            <div
                                                className="w-16 h-16 rounded-lg bg-cover bg-center shadow-sm"
                                                data-alt="Customer photo of woman wearing the loose ivory silk Ao Dai at an afternoon tea celebration."
                                                style={{
                                                    backgroundImage:
                                                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAmxrdgA5tH2v0ase-dn28mVRvItlET0AktV-wKKwAdizHecKoDIngLiMRHV6Rde9v3oxxVNnqrgT7wBBvM6y2wza8T1WBlv5NVdrj3Mm_ix2WQLA1StDOmVhao0mgODQgt_s4P5MOe9YThc2hMtQc1aCREw3IApD73-8jLFjk-Sdn10AmwDsqbE-5gAhYfJknVVSqNRc5Ydkno9HbkzLpoEeM51XrgwGshOsniOJg86lvWOrKHGBsOMQ")'
                                                }}
                                            />
                                            <div
                                                className="w-16 h-16 rounded-lg bg-cover bg-center shadow-sm"
                                                data-alt="Customer photo showing the handmade ceramic vase with lotus flower on dark wood tabletop."
                                                style={{
                                                    backgroundImage:
                                                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAmMJr84rEGEKbWL4bH8Tpb2FEbeXJeDSyr2p1SY-3Nb52RVMFz1jrUEMWbVRA2zoAo95JMCZ0I2X4oItd_CaQnYKWfyZjGf4HgRTNHXEa4u5fpqCBehx86JYCPiavFf0KOl05mz6ikepo79C5hIOjjXb2joBzLvpZz53rDCvXaE7VGUf1ARy34NHGY8w5C3yJ4XYicyfHVZmdiyx_fnR55YyVc2gXF7oUEaLU3igxXKa5CE8CRt1TLuw")'
                                                }}
                                            />
                                        </div>
                                    </div>
                                    {/* Review 2 */}
                                    <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-10 h-10 rounded-full bg-cover bg-center"
                                                    data-alt="Portrait of a young creative professional man wearing casual stylish spectacles."
                                                    style={{
                                                        backgroundImage:
                                                            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCctpu5xHs-RmnkzOvispkE8QqSusjGc8MN02z8dq6ol7vf4aRQrKYmx4ArrqmkvYMcHKhQM-VyQeG3zuw2CXn2QESR2w605nBqr0cFBeLaSZia5czm2PeHcOt0mQQEXuRJ_j17lyJjN7K1QT9mUTDhCXHDTuRawAUlIg92Zg9pTNVs0NmnjxpI_QuFvjxhtDeK0-mbE_H4XNr3SM37DiukPbgiSZhJBnAWDRhESu6pghsLgJk_oXrT6A")'
                                                    }}
                                                />
                                                <div>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="font-label-md text-label-md text-on-surface">
                                                            Trần Minh Quân (KTS)
                                                        </span>
                                                        <span className="material-symbols-outlined text-[15px] text-secondary">
                                                            verified
                                                        </span>
                                                    </div>
                                                    <span className="font-body-sm text-body-sm text-outline">
                                                        Đã may Dáng Nam size L • Màu Nâu Trầm • 1 tuần trước
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex text-tertiary-container">
                                                <span
                                                    className="material-symbols-outlined text-[16px]"
                                                    style={{ fontVariationSettings: '"FILL" 1' }}
                                                >
                                                    star
                                                </span>
                                                <span
                                                    className="material-symbols-outlined text-[16px]"
                                                    style={{ fontVariationSettings: '"FILL" 1' }}
                                                >
                                                    star
                                                </span>
                                                <span
                                                    className="material-symbols-outlined text-[16px]"
                                                    style={{ fontVariationSettings: '"FILL" 1' }}
                                                >
                                                    star
                                                </span>
                                                <span
                                                    className="material-symbols-outlined text-[16px]"
                                                    style={{ fontVariationSettings: '"FILL" 1' }}
                                                >
                                                    star
                                                </span>
                                                <span
                                                    className="material-symbols-outlined text-[16px]"
                                                    style={{ fontVariationSettings: '"FILL" 1' }}
                                                >
                                                    star
                                                </span>
                                            </div>
                                        </div>
                                        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                                            "Phom áo nam dáng suông đứng cổ 3cm rất hiện đại, mặc đi dự
                                            triển lãm kiến trúc ai cũng hỏi thăm. Điểm cộng lớn là đóng gói
                                            trong hộp gỗ khắc tên và túi hoa hồi thơm ngát hương vị Bắc Bộ."
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Tab 5: Care Guide & FAQ */}
                        <div className="tab-content py-space-xl hidden" id="tab-care">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
                                <div className="p-space-lg rounded-xl bg-surface-container-low flex flex-col gap-4">
                                    <div className="flex items-center gap-2 text-secondary">
                                        <span className="material-symbols-outlined text-[24px]">
                                            dry_cleaning
                                        </span>
                                        <h3 className="font-title text-title text-on-surface">
                                            Hướng dẫn giặt ủi lụa tơ tằm nguyên bản
                                        </h3>
                                    </div>
                                    <ul className="flex flex-col gap-2.5 font-body-sm text-body-sm text-on-surface-variant">
                                        <li className="flex items-start gap-2">
                                            <span className="material-symbols-outlined text-[16px] text-primary flex-shrink-0 mt-0.5">
                                                check
                                            </span>
                                            <span>
                                                <strong>Giặt tay với dầu gội dịu nhẹ:</strong> Tơ tằm có cấu
                                                trúc protein tương tự như tóc, nên dùng dầu gội em bé hoặc
                                                nước giặt sinh học pha loãng.
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="material-symbols-outlined text-[16px] text-primary flex-shrink-0 mt-0.5">
                                                check
                                            </span>
                                            <span>
                                                <strong>Không vắt xoắn mạnh:</strong> Bóp nhẹ bằng khăn bông
                                                khô rồi phơi trong bóng râm, tránh nắng gắt trực tiếp làm giòn
                                                sợi tơ.
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="material-symbols-outlined text-[16px] text-primary flex-shrink-0 mt-0.5">
                                                check
                                            </span>
                                            <span>
                                                <strong>Là (ủi) hơi nước khi còn ẩm:</strong> Ủi mặt trái của
                                                áo ở chế độ lụa (nhiệt độ dưới 120°C).
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="p-space-lg rounded-xl bg-surface-container-low flex flex-col gap-4">
                                    <div className="flex items-center gap-2 text-secondary">
                                        <span className="material-symbols-outlined text-[24px]">
                                            potted_plant
                                        </span>
                                        <h3 className="font-title text-title text-on-surface">
                                            Chăm sóc &amp; bảo quản bình gốm mộc
                                        </h3>
                                    </div>
                                    <ul className="flex flex-col gap-2.5 font-body-sm text-body-sm text-on-surface-variant">
                                        <li className="flex items-start gap-2">
                                            <span className="material-symbols-outlined text-[16px] text-primary flex-shrink-0 mt-0.5">
                                                check
                                            </span>
                                            <span>
                                                Bình gốm mộc men rạn tự nhiên cần tráng nước sạch và để khô
                                                ráo sau mỗi đợt cắm hoa tươi.
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="material-symbols-outlined text-[16px] text-primary flex-shrink-0 mt-0.5">
                                                check
                                            </span>
                                            <span>
                                                Nên kết hợp cắm hoa sen, hoa súng, hoặc cành quả khô để tôn
                                                vinh chất mộc của men tro Bát Tràng.
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="material-symbols-outlined text-[16px] text-primary flex-shrink-0 mt-0.5">
                                                check
                                            </span>
                                            <span>Không dùng cọ sắt kim loại để chùi rửa bề mặt gốm.</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* Related & Recommended Products Section */}
                    <section className="w-full bg-surface-container-low/50 py-space-xl px-gutter">
                        <div className="max-w-7xl mx-auto flex flex-col gap-space-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest font-bold">
                                        Cùng bộ sưu tập di sản
                                    </span>
                                    <h2 className="font-headline-md text-headline-md text-on-surface">
                                        Có thể bạn cũng yêu thích: Đồ Decor &amp; Thời Trang Bản Địa
                                    </h2>
                                </div>
                                <a
                                    className="hidden sm:inline-flex items-center gap-1 font-label-md text-label-md text-primary hover:underline"
                                    href="#"
                                >
                                    <span>Xem tất cả quà tặng</span>
                                    <span className="material-symbols-outlined text-[16px]">
                                        arrow_forward
                                    </span>
                                </a>
                            </div>
                            {/* Recommendation Cards Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Rec Card 1 */}
                                <div className="bg-surface-bright rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col">
                                    <div className="relative aspect-[4/5] bg-surface-container overflow-hidden">
                                        <div
                                            className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                                            data-alt="Editorial look of a modern sleeveless Vietnamese silk halter dress in pastel sage hue worn by model."
                                            style={{
                                                backgroundImage:
                                                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDHF08A4IB2nO4VMz3i3Jg3Xp1folheW1lPLsGCzZ2TaH2TJStKxjcAl4wCQ5VZuTd1VWKa5hLTB26-7z-CfhHT-W4T1ujAxMuCgkZk9BIx8u64_nS8BsOeT3dOApjFIMRlblksqFYsYz2pS0Xm-QHUfZXJu5p6IWPJTNYoAJdQcOZeCrBfnq40I56LTWVSf3myaMaD_LCRNmhVyBC2D5OLjEuGx6slgDK8TAfg2h753IbF8BLOV-jfRw")'
                                            }}
                                        />
                                        <span className="absolute top-3 left-3 bg-secondary text-on-secondary font-label-sm text-label-sm px-2 py-0.5 rounded-full">
                                            Lụa Tơ Sống
                                        </span>
                                        <button
                                            aria-label="Thêm vào yêu thích"
                                            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface-bright/80 backdrop-blur text-on-surface hover:text-primary flex items-center justify-center"
                                            type="button"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">
                                                favorite
                                            </span>
                                        </button>
                                    </div>
                                    <div className="p-4 flex flex-col flex-1 justify-between gap-2">
                                        <div>
                                            <span className="font-label-sm text-label-sm text-outline">
                                                Nha Xá • Hà Nam
                                            </span>
                                            <h3 className="font-title text-title text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
                                                Váy Yếm Lụa Tơ Sống Cách Tân
                                            </h3>
                                        </div>
                                        <div className="flex items-center justify-between pt-1">
                                            <span className="font-label-lg text-label-lg text-primary font-bold">
                                                1.250.000₫
                                            </span>
                                            <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-0.5">
                                                <span
                                                    className="material-symbols-outlined text-[14px] text-tertiary-container"
                                                    style={{ fontVariationSettings: '"FILL" 1' }}
                                                >
                                                    star
                                                </span>
                                                4.9
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {/* Rec Card 2 */}
                                <div className="bg-surface-bright rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col">
                                    <div className="relative aspect-[4/5] bg-surface-container overflow-hidden">
                                        <div
                                            className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                                            data-alt="Wood-fired handcrafted ceramic vase displaying natural crystalline ash glaze patterns with deep earthy and ember tones."
                                            style={{
                                                backgroundImage:
                                                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBF0sftUyT3XJ1dfLN-gXkC250GD1mSt6byPcDV_8bn2mrJTLlgwATdt_LkP2fLqBpcejAWNGtjJQvLYWlPDm-x3JfoaOCadNq-TYGJTyeTo6pdiNA3noVAvaz5wtiTjW6VjCt9nDAKTL6OeEx-d7o4-JcpSI1t6m6tIFcZlWeLIQBGIlL4Xt5WHHRAH6ek2-oBypaheqxLqfA2qDFdMFY2p7rgrOoMCnESfE-Lkb8OWvJCJGTeR0TCEA")'
                                            }}
                                        />
                                        <span className="absolute top-3 left-3 bg-primary-container text-on-primary font-label-sm text-label-sm px-2 py-0.5 rounded-full">
                                            Độc Bản Nung Củi
                                        </span>
                                        <button
                                            aria-label="Thêm vào yêu thích"
                                            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface-bright/80 backdrop-blur text-on-surface hover:text-primary flex items-center justify-center"
                                            type="button"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">
                                                favorite
                                            </span>
                                        </button>
                                    </div>
                                    <div className="p-4 flex flex-col flex-1 justify-between gap-2">
                                        <div>
                                            <span className="font-label-sm text-label-sm text-outline">
                                                Bát Tràng • Hà Nội
                                            </span>
                                            <h3 className="font-title text-title text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
                                                Bình Hoa Gốm Hỏa Biến Men Tro Nung Củi
                                            </h3>
                                        </div>
                                        <div className="flex items-center justify-between pt-1">
                                            <span className="font-label-lg text-label-lg text-primary font-bold">
                                                560.000₫
                                            </span>
                                            <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-0.5">
                                                <span
                                                    className="material-symbols-outlined text-[14px] text-tertiary-container"
                                                    style={{ fontVariationSettings: '"FILL" 1' }}
                                                >
                                                    star
                                                </span>
                                                5.0
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {/* Rec Card 3 */}
                                <div className="bg-surface-bright rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col">
                                    <div className="relative aspect-[4/5] bg-surface-container overflow-hidden">
                                        <div
                                            className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                                            data-alt="Men relaxed raw silk jacket with mandarin collar and embroidered subtle ancient Dong Son bird patterns on dark charcoal silk."
                                            style={{
                                                backgroundImage:
                                                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBK2lnpgYdxq0Jk2zdEWxzx8ID9QunL7SIt1heN842XlJNlSYcDDUAu7vwyMfWxE9Kox5d1ppZxHffw-FdFR_czcEPBiHkR4dt7DeV6gQc1AkxXesZK9FnNUGaSCcsi_Xx9aVBnIFzuMyw88Ptu8DDpJVwb-lU8xogkhB6eMYuYkC-xddKTrDlUyiJzWtp8UOiad2zQLEboEL9-vJG3kTXhr9velJV4wlInyL6zJYZ7nAN0TNNO85s1ow")'
                                            }}
                                        />
                                        <span className="absolute top-3 left-3 bg-secondary text-on-secondary font-label-sm text-label-sm px-2 py-0.5 rounded-full">
                                            Thời Trang Nam
                                        </span>
                                        <button
                                            aria-label="Thêm vào yêu thích"
                                            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface-bright/80 backdrop-blur text-on-surface hover:text-primary flex items-center justify-center"
                                            type="button"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">
                                                favorite
                                            </span>
                                        </button>
                                    </div>
                                    <div className="p-4 flex flex-col flex-1 justify-between gap-2">
                                        <div>
                                            <span className="font-label-sm text-label-sm text-outline">
                                                Lụa Tơ Đũi Nam Cao
                                            </span>
                                            <h3 className="font-title text-title text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
                                                Áo Khoác Đũi Cổ Trụ Họa Tiết Đông Sơn
                                            </h3>
                                        </div>
                                        <div className="flex items-center justify-between pt-1">
                                            <span className="font-label-lg text-label-lg text-primary font-bold">
                                                1.450.000₫
                                            </span>
                                            <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-0.5">
                                                <span
                                                    className="material-symbols-outlined text-[14px] text-tertiary-container"
                                                    style={{ fontVariationSettings: '"FILL" 1' }}
                                                >
                                                    star
                                                </span>
                                                4.8
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {/* Rec Card 4 */}
                                <div className="bg-surface-bright rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col">
                                    <div className="relative aspect-[4/5] bg-surface-container overflow-hidden">
                                        <div
                                            className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                                            data-alt="Delicate handmade Truc Chi bamboo paper artwork lamp emitting a warm circular glow with carved lotus mandala motifs on dark background."
                                            style={{
                                                backgroundImage:
                                                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB3krMYbYLkNAN6gNbLCFc24zxHK12pe7Oxg4nr0WY3krUmDuKy79HyTA2oUm5RXRNo1QZdVXu_cBhE6E7Md9VBZCyLt1Pu64uZmo_edRLv17iJnLvcU9F3Tz-TnFH7UfhahezIcOux3r-8KrkiPZkwI3ih5Ok5na-caEUxwyGfDjWQ6yvQ5pLCOuoHKmFkcRiCTNVSI-WrMYf4K0iZeYZhS9eJGVUqMBe4Z7IVEbhRERZ7yjAoSv8RFg")'
                                            }}
                                        />
                                        <span className="absolute top-3 left-3 bg-tertiary text-on-tertiary font-label-sm text-label-sm px-2 py-0.5 rounded-full">
                                            Nghệ Thuật Giấy
                                        </span>
                                        <button
                                            aria-label="Thêm vào yêu thích"
                                            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface-bright/80 backdrop-blur text-on-surface hover:text-primary flex items-center justify-center"
                                            type="button"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">
                                                favorite
                                            </span>
                                        </button>
                                    </div>
                                    <div className="p-4 flex flex-col flex-1 justify-between gap-2">
                                        <div>
                                            <span className="font-label-sm text-label-sm text-outline">
                                                Trúc Chỉ • Huế
                                            </span>
                                            <h3 className="font-title text-title text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
                                                Tranh Trúc Chỉ Để Bàn Đèn LED Thiền Định
                                            </h3>
                                        </div>
                                        <div className="flex items-center justify-between pt-1">
                                            <span className="font-label-lg text-label-lg text-primary font-bold">
                                                890.000₫
                                            </span>
                                            <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-0.5">
                                                <span
                                                    className="material-symbols-outlined text-[14px] text-tertiary-container"
                                                    style={{ fontVariationSettings: '"FILL" 1' }}
                                                >
                                                    star
                                                </span>
                                                4.9
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* Sticky Bottom Quick-Action Dock for Mobile / Fast Conversions */}
                    <aside className="sticky bottom-0 left-0 right-0 z-40 bg-surface-bright/95 backdrop-blur-md border-t border-surface-variant/40 py-2.5 px-gutter shadow-lg lg:hidden">
                        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
                            <div className="flex flex-col">
                                <span className="font-label-sm text-label-sm text-outline">
                                    Giá may ưu đãi
                                </span>
                                <span className="font-headline-sm text-headline-sm text-primary font-bold">
                                    1.850.000₫
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    className="p-2.5 rounded-full bg-surface-container text-primary"
                                    type="button"
                                >
                                    <span className="material-symbols-outlined text-[20px]">
                                        shopping_bag
                                    </span>
                                </button>
                                <button
                                    className="py-2.5 px-5 rounded-full bg-primary-container text-on-primary font-label-md text-label-md shadow-md"
                                    type="button"
                                >
                                    Đặt May Ngay
                                </button>
                            </div>
                        </div>
                    </aside>
                    {/* Client-side Micro-interactions */}
                </div>
            </main>

            <div className="relative mx-auto max-w-7xl px-4 py-12 sm:py-14 lg:py-16">
                <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute -left-24 top-6 h-56 w-56 rounded-full bg-amber-300/10 blur-3xl" />
                    <div className="absolute -right-20 top-1/4 h-72 w-72 rounded-full bg-slate-300/20 blur-3xl dark:bg-slate-500/20" />
                    <div className="absolute bottom-4 left-1/3 h-44 w-44 rounded-full bg-orange-300/10 blur-3xl" />
                </div>

                <div className="md:flex gap-4">
                    {/* Product Info */}
                    <div className="flex flex-col gap-4 flex-1">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-xs font-semibold text-amber-800 dark:border-amber-700/70 dark:bg-amber-900/20 dark:text-amber-300">
                                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                </svg>
                                Featured Product
                            </div>
                            <h1 className="text-2xl font-semibold text-slate-900">
                                {product.name}
                            </h1>
                            {product.description && (
                                <p className="text-sm md:text-base text-slate-600">
                                    {product.description}
                                </p>
                            )}
                            {product.brand && (
                                <Link
                                    href={`/shop/brand/${product.brand.normalizedName}`}
                                    className="inline-flex items-center gap-2 text-sm font-medium text-amber-700 hover:text-amber-900 hover:underline"
                                >
                                    {product.brand.name}
                                </Link>
                            )}
                        </div>

                        {/* Price */}
                        <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-amber-50/50 p-4">
                            <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-amber-300/20 blur-2xl" />
                            <div className="flex flex-col gap-2">
                                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Giá</span>
                                {hasDiscount ? (
                                    <div className="flex items-baseline gap-4">
                                        <span className="bg-gradient-to-r from-slate-800 to-amber-700 bg-clip-text text-xl font-black text-transparent sm:text-5xl dark:from-slate-100 dark:to-amber-300">
                                            {localePrice(product.salePrice)}
                                        </span>
                                        <span className="text-lg font-medium text-slate-400 line-through sm:text-xl">
                                            {localePrice(product.price)}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-xl font-black text-slate-900">
                                        {localePrice(product.price)}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Stock Status */}
                        <div hidden={!product.price && !product.salePrice} className="rounded-2xl border border-slate-200 bg-white/90 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                            {product.unitInStock !== undefined && (
                                <>
                                    {product.unitInStock > 0 ? (
                                        <div className="flex items-center gap-3">
                                            <div className="relative flex h-4 w-4">
                                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                                                <span className="relative inline-flex h-4 w-4 rounded-full bg-green-500"></span>
                                            </div>
                                            <div>
                                                <span className="block text-sm font-bold text-slate-900 dark:text-slate-100">
                                                    In Stock
                                                </span>
                                                <span className="text-xs text-slate-600 dark:text-slate-400">
                                                    {product.unitInStock} units available
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <span className="flex h-4 w-4 rounded-full bg-red-500"></span>
                                            <div>
                                                <span className="block text-sm font-bold text-slate-900 dark:text-slate-100">
                                                    Out of Stock
                                                </span>
                                                <span className="text-xs text-slate-600 dark:text-slate-400">
                                                    Currently unavailable
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3">
                            {product.affiliateLink ? (
                                <a
                                    href={product.affiliateLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative overflow-hidden btn btn-primary text-center bg-gradient-to-r from-slate-800 to-slate-700 px-8 py-5 text-lg font-bold text-white transition hover:-translate-y-0.5 hover:from-slate-900 hover:to-slate-800 active:scale-[0.98] dark:from-slate-100 dark:to-slate-300 dark:text-slate-900 dark:hover:from-white dark:hover:to-slate-200"
                                >
                                    <FontAwesomeIcon icon={faShoppingCart} /> Mua ngay
                                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition group-hover:translate-x-full group-hover:duration-1000"></div>
                                </a>
                            ) : product.price ? (
                                <AddToCartButton
                                    item={{
                                        productId: product.id,
                                        name: product.name,
                                        thumbnail: product.thumbnail,
                                        normalizedName: product.normalizedName,
                                        price: product.price,
                                        salePrice: product.salePrice,
                                    }}
                                    className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-800 to-slate-700 px-8 py-5 text-center text-lg font-bold text-white transition hover:-translate-y-0.5 hover:from-slate-900 hover:to-slate-800 active:scale-[0.98] dark:border-slate-500 dark:from-slate-100 dark:to-slate-300 dark:text-slate-900 dark:hover:from-white dark:hover:to-slate-200"
                                />
                            ) : (
                                <button
                                    hidden={!product.price && !product.salePrice}
                                    className="cursor-not-allowed rounded-2xl bg-slate-200 px-8 py-5 text-center text-lg font-semibold text-slate-400 dark:bg-slate-800 dark:text-slate-600"
                                >
                                    Not Available
                                </button>
                            )}
                            <Link
                                href="/shop"
                                className="group rounded-lg border border-slate-300 bg-white px-8 py-2 text-center font-semibold text-slate-700 transition hover:border-amber-500 hover:bg-amber-50 hover:text-amber-700"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    <FontAwesomeIcon icon={faArrowLeft} />
                                    Xem thêm sản phẩm khác
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="md:flex gap-4">
                    <div className="flex-1">
                        <div className="mt-12 rounded-lg p-4 bg-white backdrop-blur">
                            <BlockRender {...product.content} />

                            <div className="mt-4 flex flex-wrap gap-2">
                                {tags.map((tag) => (
                                    <Link
                                        key={tag.id}
                                        href={`/shop/tags/${tag.normalizedName}`}
                                        className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-amber-500 hover:bg-amber-50 hover:text-amber-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-amber-500 dark:hover:bg-amber-50 dark:hover:text-amber-700"
                                    >
                                        {tag.name}
                                    </Link>
                                ))}
                            </div>

                            <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                                <div>
                                    Ngày cập nhật: {dayjs(product.modifiedDate || product.createdDate).format("DD/MM/YYYY HH:mm")}
                                </div>
                                <div>
                                    Lượt xem: {product.viewCount?.toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="md:w-1/4">
                        <div className="mt-12">
                            <LatestProducts />
                        </div>
                    </div>
                </div>

                <div className="mt-12">
                    <RandomArticleList />
                </div>

                {/* Latest Products */}
            </div>
        </PageContainer>
    );
};

export default Page;