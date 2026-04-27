"use client";

import { useAppContext } from "@/contexts/app-context";
import { useCartContext } from "@/contexts/cart-context";
import { apiPlaceOrder } from "@/services/shop/order";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const CartClient: React.FC = () => {
    const { items, hydrated, updateQuantity, removeFromCart, clearCart } = useCartContext();
    const { user } = useAppContext();
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [checkoutForm, setCheckoutForm] = useState({
        name: "",
        phoneNumber: "",
        address: "",
        note: "",
    });

    useEffect(() => {
        setCheckoutForm((current) => ({
            name: current.name || user?.name || "",
            phoneNumber: current.phoneNumber || user?.phoneNumber || "",
            address: current.address || "",
            note: current.note,
        }));
    }, [user?.name, user?.phoneNumber]);

    const subtotal = useMemo(
        () =>
            items.reduce((sum, item) => {
                const currentPrice = item.salePrice ?? item.price;
                if (typeof currentPrice !== "number") {
                    return sum;
                }
                return sum + currentPrice * item.quantity;
            }, 0),
        [items]
    );

    const handlePlaceOrder = async () => {
        const name = checkoutForm.name.trim();
        const phoneNumber = checkoutForm.phoneNumber.trim();
        const address = checkoutForm.address.trim();

        if (!name) {
            setError("Vui lòng nhập họ và tên.");
            return;
        }

        if (!phoneNumber) {
            setError("Vui lòng nhập số điện thoại.");
            return;
        }

        if (!address) {
            setError("Vui lòng nhập địa chỉ.");
            return;
        }

        if (items.length < 1) {
            setError("Không có sản phẩm trong giỏ hàng.");
            return;
        }

        const orderDetails = items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.salePrice ?? item.price ?? 0,
        }));

        setSubmitting(true);
        setError(null);

        try {
            const redirectPath = await apiPlaceOrder({
                name,
                phoneNumber,
                address,
                note: checkoutForm.note.trim(),
                orderDetails,
            });

            clearCart();

            if (redirectPath && typeof redirectPath === "string") {
                if (/^https?:\/\//i.test(redirectPath)) {
                    window.location.href = redirectPath;
                    return;
                }

                if (/checkout\/finish/i.test(redirectPath)) {
                    router.push("/shop/checkout/success");
                    return;
                }

                router.push(redirectPath);
                return;
            }

            router.push("/shop/checkout/success");
        } catch (err: unknown) {
            if (typeof err === "object" && err && "response" in err) {
                const response = (err as { response?: { data?: string } }).response;
                if (typeof response?.data === "string" && response.data.trim()) {
                    setError(response.data);
                } else {
                    setError("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.");
                }
            } else {
                setError("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (!hydrated) {
        return (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
                Đang tải giỏ hàng...
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
                <h2 className="mb-2 text-xl font-semibold text-slate-900">Giỏ hàng đang trống</h2>
                <p className="mb-5 text-sm text-slate-600">Hãy thêm sản phẩm để bắt đầu mua sắm.</p>
                <Link
                    href="/shop"
                    className="inline-flex items-center rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700"
                >
                    Khám phá sản phẩm
                </Link>
            </div>
        );
    }

    return (
        <div className="grid gap-6 lg:grid-cols-[1.4fr,0.8fr]">
            <div className="space-y-4">
                {items.map((item) => {
                    const currentPrice = item.salePrice ?? item.price;

                    return (
                        <div
                            key={item.productId}
                            className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                        >
                            <div className="h-24 w-24 overflow-hidden rounded-xl bg-slate-100">
                                {item.thumbnail ? (
                                    <img src={item.thumbnail} alt={item.name ?? item.productId} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                                        No image
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-1 flex-col justify-between gap-2">
                                <div>
                                    {item.normalizedName ? (
                                        <Link href={`/shop/${item.normalizedName}`} className="text-base font-semibold text-slate-900 hover:text-blue-600">
                                            {item.name ?? item.productId}
                                        </Link>
                                    ) : (
                                        <p className="text-base font-semibold text-slate-900">{item.name ?? item.productId}</p>
                                    )}
                                    <p className="mt-1 text-sm text-slate-500">Mã sản phẩm: {item.productId}</p>
                                </div>

                                <div className="flex flex-wrap items-center gap-3">
                                    <div className="flex items-center rounded-lg border border-slate-200">
                                        <button
                                            type="button"
                                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                            className="h-9 w-9 text-slate-700 disabled:cursor-not-allowed disabled:text-slate-300"
                                        >
                                            -
                                        </button>
                                        <span className="w-10 text-center text-sm font-semibold text-slate-900">{item.quantity}</span>
                                        <button
                                            type="button"
                                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                            className="h-9 w-9 text-slate-700"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => removeFromCart(item.productId)}
                                        className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                                    >
                                        Xóa
                                    </button>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="text-sm text-slate-500">Đơn giá</p>
                                <p className="text-lg font-bold text-slate-900">
                                    {typeof currentPrice === "number" ? `${currentPrice.toLocaleString()}đ` : "Liên hệ"}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-bold text-slate-900">Tóm tắt đơn hàng</h3>
                <div className="mb-5 flex items-center justify-between border-b border-slate-200 pb-4">
                    <span className="text-sm text-slate-600">Tạm tính</span>
                    <span className="text-2xl font-bold text-slate-900">{subtotal.toLocaleString()}đ</span>
                </div>

                <div className="mb-4 space-y-3 border-b border-slate-200 pb-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Họ và tên</label>
                        <input
                            type="text"
                            value={checkoutForm.name}
                            onChange={(event) =>
                                setCheckoutForm((current) => ({ ...current, name: event.target.value }))
                            }
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500"
                            placeholder="Nhập họ và tên"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Số điện thoại</label>
                        <input
                            type="tel"
                            value={checkoutForm.phoneNumber}
                            onChange={(event) =>
                                setCheckoutForm((current) => ({ ...current, phoneNumber: event.target.value }))
                            }
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500"
                            placeholder="Nhập số điện thoại"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Địa chỉ</label>
                        <input
                            type="text"
                            value={checkoutForm.address}
                            onChange={(event) =>
                                setCheckoutForm((current) => ({ ...current, address: event.target.value }))
                            }
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500"
                            placeholder="Nhập địa chỉ nhận hàng"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Ghi chú</label>
                        <textarea
                            value={checkoutForm.note}
                            onChange={(event) =>
                                setCheckoutForm((current) => ({ ...current, note: event.target.value }))
                            }
                            className="min-h-20 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500"
                            placeholder="Ghi chú thêm cho đơn hàng (tuỳ chọn)"
                        />
                    </div>
                    {error && (
                        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                            {error}
                        </p>
                    )}
                </div>

                <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={submitting}
                    className="mb-3 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                    {submitting ? "Đang xử lý..." : "Tiến hành thanh toán"}
                </button>
                <button
                    type="button"
                    disabled={submitting}
                    onClick={clearCart}
                    className="w-full rounded-xl border border-slate-300 py-3 font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400"
                >
                    Xóa toàn bộ giỏ hàng
                </button>
            </aside>
        </div>
    );
};

export default CartClient;
