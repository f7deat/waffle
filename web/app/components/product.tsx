import { apiProducts } from "@/services/shop/product";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

const Product: React.FC = async () => {

    const productsResponse = await apiProducts({ current: 1, pageSize: 4 });
    const products = productsResponse.data || [];

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-6 h-1 bg-primary rounded-full" />
                        <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider font-semibold">
                            Tinh hoa ẩm thực bản địa
                        </span>
                    </div>
                    <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
                        Quán ngon được cộng đồng yêu thích
                    </h2>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                        Hải sản tươi rói, lẩu cua đồng đậm đà và những món ăn truyền thống
                        danh bất hư truyền
                    </p>
                </div>
                <button className="px-4 py-2 rounded-full bg-surface-container-lowest text-primary font-label-md text-label-md shadow-sm hover:bg-primary hover:text-on-primary transition-colors cursor-pointer">
                    Xem cẩm nang ẩm thực Hải Phòng →
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                {
                    products.map((product) => (
                        <div key={product.id} className="group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
                            <div className="relative w-full h-48 overflow-hidden">
                                <div
                                    className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                                    data-alt="Platter of steamed fresh sea mantis shrimp, king prawns, and mud crabs with chili lime dipping sauce, vibrant authentic seafood feast."
                                    style={{
                                        backgroundImage: `url("${product.thumbnail}")`
                                    }}
                                />
                                <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-primary text-on-primary font-label-sm text-label-sm">
                                    {product.categoryName || 'Mới'}
                                </span>
                                <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-on-surface/75 text-surface font-label-sm text-label-sm flex items-center gap-1">
                                    <span
                                        className="material-symbols-outlined text-[14px] text-tertiary"
                                        style={{ fontVariationSettings: '"FILL" 1' }}
                                    >
                                        <FontAwesomeIcon icon={faStar} />
                                    </span>{" "}
                                    4.9
                                </div>
                            </div>
                            <div className="p-4 flex-1 flex flex-col justify-between">
                                <div>
                                    <Link href={`/shop/${product.normalizedName}`}>
                                        <h3 className="font-bold text-title line-clamp-2 text-on-surface group-hover:text-primary transition-colors">
                                            {product.name}
                                        </h3>
                                    </Link>
                                    <p className="font-body-sm text-body-sm text-outline mt-1 line-clamp-2">
                                        {product.description}
                                    </p>
                                </div>
                                <div className="mt-3 pt-3 flex items-center justify-between font-label-sm text-label-sm">
                                    <span className="text-primary font-bold">
                                        {product.salePrice ? `${product.salePrice.toLocaleString()}đ` : 'Liên hệ'} <span className="text-sm text-gray-500 line-through">{product.price ? `${product.price.toLocaleString()}đ` : ''}</span>
                                    </span>
                                    <span className="text-outline">{product.viewCount.toLocaleString()} lượt xem</span>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Product;