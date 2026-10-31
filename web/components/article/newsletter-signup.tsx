"use client";

import { FormEvent, useState } from "react";
import { apiNewsletterSubscribe } from "@/services/article";

const ArticleNewsletterSignup = () => {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const subscribe = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setStatus("loading");
        try {
            await apiNewsletterSubscribe(email);
            setStatus("success");
            setEmail("");
        } catch {
            setStatus("error");
        }
    };

    return (
        <section className="rounded-2xl bg-slate-900 p-5 text-white shadow-sm">
            <h2 className="text-lg font-bold">Nhận cẩm nang cuối tuần</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">Gợi ý điểm đến và bài viết mới, gửi gọn vào email của bạn.</p>
            <form className="mt-4 space-y-3" onSubmit={subscribe}>
                <label className="sr-only" htmlFor="article-newsletter-email">Email</label>
                <input
                    id="article-newsletter-email"
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Email của bạn"
                    className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none"
                />
                <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full rounded-lg bg-amber-400 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-amber-300 disabled:opacity-60"
                >
                    {status === "loading" ? "Đang đăng ký..." : "Đăng ký nhận tin"}
                </button>
                {status === "success" && <p role="status" className="text-sm text-emerald-300">Đăng ký nhận tin thành công.</p>}
                {status === "error" && <p role="alert" className="text-sm text-rose-300">Chưa thể đăng ký lúc này. Vui lòng thử lại.</p>}
            </form>
        </section>
    );
};

export default ArticleNewsletterSignup;
