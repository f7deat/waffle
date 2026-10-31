"use client";

import { apiNewsletterSubscribe } from "@/services/article";
import { useState } from "react";

const NewsletterForm = () => {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [total, setTotal] = useState<number>();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;
        setStatus("loading");
        try {
            const res = await apiNewsletterSubscribe(email.trim());
            setTotal(res.total);
            setStatus("success");
            setEmail("");
        } catch {
            setStatus("error");
        }
    };

    return (
        <form onSubmit={onSubmit} className="mt-1 flex flex-col gap-2">
            <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn..."
                className="w-full rounded-xl bg-white px-4 py-2.5 text-sm text-on-surface shadow-sm placeholder:text-outline"
            />
            <button
                type="submit"
                disabled={status === "loading"}
                className="w-full rounded-xl bg-secondary py-2.5 text-sm font-semibold text-on-secondary transition hover:opacity-90 disabled:opacity-60"
            >
                {status === "loading" ? "Đang gửi..." : "Đăng ký nhận bản tin"}
            </button>
            {status === "success" && (
                <span className="text-center text-xs text-secondary">
                    Đăng ký thành công!{total ? ` Hơn ${total.toLocaleString("vi-VN")} bạn đọc đã tham gia.` : ""}
                </span>
            )}
            {status === "error" && (
                <span className="text-center text-xs text-error">Email không hợp lệ hoặc có lỗi xảy ra, vui lòng thử lại.</span>
            )}
        </form>
    );
};

export default NewsletterForm;
