/* eslint-disable @next/next/no-img-element */
import PageContainer from "@/components/layout/page-container";
import { apiShopeeBaseInfoAndLinks } from "@/services/apps/shopee";
import { apiProducts } from "@/services/shop/product";
import { SearchOutlined, ShoppingCartOutlined, StarFilled } from "@ant-design/icons";
import Link from "next/link";

const Page: React.FC = async () => {

    const data = await apiShopeeBaseInfoAndLinks({ pageNum: "1", pageSize: 12 });

    const response = await apiProducts({ current: 1, pageSize: 12 });
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
        <PageContainer fluid>
            <div className="bg-slate-100">
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

                {/* Filter and Products Layout */}
                <div className="flex gap-4">
                    {/* Left Sidebar - Filters */}
                    <div className="hidden md:block w-64 flex-shrink-0">
                        <div className="bg-white rounded-lg p-4 sticky top-4">
                            <h3 className="font-semibold text-lg mb-4">Bộ lọc</h3>

                            {/* Category Filter */}
                            <div className="mb-6">
                                <h4 className="font-semibold mb-3 text-sm">Danh mục</h4>
                                <div className="space-y-2">
                                    <label className="flex items-center cursor-pointer hover:bg-slate-50 p-2 rounded">
                                        <input type="checkbox" className="mr-2" />
                                        <span className="text-sm">Tất cả</span>
                                    </label>
                                    <label className="flex items-center cursor-pointer hover:bg-slate-50 p-2 rounded">
                                        <input type="checkbox" className="mr-2" />
                                        <span className="text-sm">Điện thoại</span>
                                    </label>
                                    <label className="flex items-center cursor-pointer hover:bg-slate-50 p-2 rounded">
                                        <input type="checkbox" className="mr-2" />
                                        <span className="text-sm">Laptop</span>
                                    </label>
                                    <label className="flex items-center cursor-pointer hover:bg-slate-50 p-2 rounded">
                                        <input type="checkbox" className="mr-2" />
                                        <span className="text-sm">Phụ kiện</span>
                                    </label>
                                    <label className="flex items-center cursor-pointer hover:bg-slate-50 p-2 rounded">
                                        <input type="checkbox" className="mr-2" />
                                        <span className="text-sm">Đồng hồ</span>
                                    </label>
                                </div>
                            </div>

                            {/* Price Range Filter */}
                            <div className="mb-6">
                                <h4 className="font-semibold mb-3 text-sm">Khoảng giá</h4>
                                <div className="space-y-2">
                                    <label className="flex items-center cursor-pointer hover:bg-slate-50 p-2 rounded">
                                        <input type="radio" name="price" className="mr-2" />
                                        <span className="text-sm">Dưới 1 triệu</span>
                                    </label>
                                    <label className="flex items-center cursor-pointer hover:bg-slate-50 p-2 rounded">
                                        <input type="radio" name="price" className="mr-2" />
                                        <span className="text-sm">1 - 5 triệu</span>
                                    </label>
                                    <label className="flex items-center cursor-pointer hover:bg-slate-50 p-2 rounded">
                                        <input type="radio" name="price" className="mr-2" />
                                        <span className="text-sm">5 - 10 triệu</span>
                                    </label>
                                    <label className="flex items-center cursor-pointer hover:bg-slate-50 p-2 rounded">
                                        <input type="radio" name="price" className="mr-2" />
                                        <span className="text-sm">10 - 20 triệu</span>
                                    </label>
                                    <label className="flex items-center cursor-pointer hover:bg-slate-50 p-2 rounded">
                                        <input type="radio" name="price" className="mr-2" />
                                        <span className="text-sm">Trên 20 triệu</span>
                                    </label>
                                </div>
                            </div>

                            {/* Rating Filter */}
                            <div className="mb-6">
                                <h4 className="font-semibold mb-3 text-sm">Đánh giá</h4>
                                <div className="space-y-2">
                                    <label className="flex items-center cursor-pointer hover:bg-slate-50 p-2 rounded">
                                        <input type="checkbox" className="mr-2" />
                                        <span className="text-sm flex items-center">
                                            5 <StarFilled className="text-yellow-500 ml-1" />
                                        </span>
                                    </label>
                                    <label className="flex items-center cursor-pointer hover:bg-slate-50 p-2 rounded">
                                        <input type="checkbox" className="mr-2" />
                                        <span className="text-sm flex items-center">
                                            4 <StarFilled className="text-yellow-500 ml-1" /> trở lên
                                        </span>
                                    </label>
                                    <label className="flex items-center cursor-pointer hover:bg-slate-50 p-2 rounded">
                                        <input type="checkbox" className="mr-2" />
                                        <span className="text-sm flex items-center">
                                            3 <StarFilled className="text-yellow-500 ml-1" /> trở lên
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* Reset Button */}
                            <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium py-2 rounded-lg transition duration-300">
                                Xóa bộ lọc
                            </button>
                        </div>
                    </div>

                    {/* Right Side - Products */}
                    <div className="flex-1">

                        <div className="grid grid-cols-2 md:grid-cols-4 2xl:grid-cols-6 gap-4 mb-4">
                            {
                                data.data.data.landingPageLinkList.linkList.map((link: {
                                    linkId: string;
                                    link: string;
                                    linkName: string;
                                    image: string;
                                    linkType: string;
                                    groupIds: string[];
                                }) => {
                                    return (
                                        <div key={link.linkId} className="bg-white">
                                            <a href={link.link} target="_blank" rel="noreferrer">
                                                <img src={link.image} loading="lazy" alt={link.linkName} className="mb-1 transition-transform duration-300 ease-in-out transform hover:scale-105" />
                                                <div className="hover:text-blue-500 py-1 px-2 font-medium line-clamp-2">{link.linkName}</div>
                                            </a>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 2xl:grid-cols-6">
                            {products.map((product) => (
                                <div key={product.id} className="bg-white transition duration-300 rounded-lg p-2 flex flex-col hover:shadow-xl">
                                    <img src={product.thumbnail} alt={product.name} className="w-full h-40 md:h-48 object-cover mb-2 rounded-lg" />
                                    <h3 className="font-semibold mb-1 line-clamp-2 flex-1 text-sm md:text-base">
                                        <Link href={`/shop/${product.normalizedName}`} className="cursor-pointer">
                                            {product.name}
                                        </Link>
                                    </h3>
                                    <div className="text-gray-600 mb-2">{renderPrice(product.price, product.salePrice)}</div>
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
                </div>
            </div>
        </PageContainer>
    );
}

export default Page;