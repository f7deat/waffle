import PageContainer from "@/components/layout/page-container";
import { apiProducts } from "@/service/shop/product";
import { SearchOutlined, ShoppingCartOutlined, StarFilled } from "@ant-design/icons";
import Link from "next/link";

const Page: React.FC = async () => {

    const response = await apiProducts({ current: 1, pageSize: 14 });
    const products = response.data;

    const renderPrice = (price?: number, salePrice?: number) => {
        if (!price && !salePrice) return null;
        if (price && salePrice) {
            return (
                <div>
                    <span className="text-red-600 font-semibold">{salePrice.toLocaleString()}đ</span>
                    <span className="text-gray-500 line-through ml-2 text-xs">{price.toLocaleString()}đ</span>
                </div>
            )
        }
        return <span className="font-semibold">{(price ?? salePrice)?.toLocaleString()}đ</span>;
    };

    return (
        <PageContainer title="Shop">
            <div className="bg-slate-100 p-4">
                <div className="mb-4 bg-white rounded-lg p-4">
                    <div className="flex">
                        <div className="flex-1 text-lg font-semibold">
                            Danh sách sản phẩm
                        </div>
                        <div>
                            <div className="bg-slate-100 rounded-lg items-center text-sm flex">
                                <button className="text-slate-800 px-3">
                                    <SearchOutlined />
                                </button>
                                <input type="text" placeholder="Tìm kiếm sản phẩm" className="bg-slate-100 rounded-xl py-2" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 2xl:grid-cols-7">
                    {products.map((product) => (
                        <div key={product.id} className="bg-white transition duration-300 rounded-lg p-2 flex flex-col hover:shadow-xl">
                            <img src={product.thumbnail} alt={product.name} className="w-full h-40 md:h-48 object-cover mb-2 rounded-lg" />
                            <h3 className="font-semibold mb-1 line-clamp-2 flex-1 text-sm md:text-base">
                                <Link href={`/shop/${product.normalizedName}`} className="cursor-pointer">
                                    {product.name}
                                </Link>
                            </h3>
                            <p className="text-gray-600 mb-2">{renderPrice(product.price, product.salePrice)}</p>
                            <div className="flex justify-between items-center">
                                <div className="text-yellow-500 text-sm md:text-base font-bold">
                                    5<StarFilled />
                                </div>
                                <button className="hover:bg-blue-100 transition duration-300 border font-medium text-sm px-2 md:px-6 py-1 md:py-2 rounded-full hover:text-blue-600">
                                    <ShoppingCartOutlined /> Thêm vào giỏ
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </PageContainer>
    );
}

export default Page;