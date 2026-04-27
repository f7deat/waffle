import PageContainer from "@/components/layout/page-container";
import CartClient from "./cart-client";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Giỏ hàng",
    description: "Quản lý sản phẩm trong giỏ hàng của bạn",
};

const Page: React.FC = () => {
    return (
        <PageContainer breadcrumbs={[{ label: "Cửa hàng", href: "/shop" }, { label: "Giỏ hàng", href: "/shop/cart" }]}>
            <div className="py-6">
                <h1 className="mb-6 text-3xl font-bold text-slate-900">Giỏ hàng</h1>
                <CartClient />
            </div>
        </PageContainer>
    );
};

export default Page;
