/* eslint-disable @next/next/no-img-element */
import PageContainer from "@/components/layout/page-container";
import { apiProducts } from "@/services/shop/product";
import { SearchOutlined } from "@ant-design/icons";
import ProductList from "./components/product-list";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sản phẩm - Dịch vụ",
    description: "Danh sách sản phẩm và dịch vụ của chúng tôi",
};

const Page: React.FC = async () => {

    const response = await apiProducts({ current: 1, pageSize: 12 });
    const products = response.data;

    return (
        <PageContainer>
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

                <ProductList products={products} />
            </div>
        </PageContainer>
    );
}

export default Page;