import PageContainer from "@/components/layout/page-container";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Đặt hàng thành công",
    description: "Đơn hàng của bạn đã được ghi nhận thành công.",
};

const Page: React.FC = () => {
    return (
        <PageContainer breadcrumbs={[{ label: "Cửa hàng", href: "/shop" }, { label: "Thanh toán", href: "/shop/cart" }, { label: "Thành công", href: "/shop/checkout/success" }]}>
            <div className="mx-auto max-w-2xl py-12">
                <div className="rounded-3xl border border-emerald-200 bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-600">
                        ✓
                    </div>
                    <h1 className="mb-2 text-3xl font-bold text-slate-900">Thanh toán thành công</h1>
                    <p className="mb-6 text-slate-600">
                        Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được gửi tới hệ thống và sẽ sớm được xác nhận.
                    </p>
                    <div className="flex flex-col justify-center gap-3 sm:flex-row">
                        <Link
                            href="/shop"
                            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                        >
                            Tiếp tục mua sắm
                        </Link>
                        <Link
                            href="/user/profile"
                            className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            Xem tài khoản
                        </Link>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
};

export default Page;
