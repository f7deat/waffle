const Footer: React.FC = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-slate-800 bg-slate-950 text-slate-100">
            <div className="mx-auto max-w-6xl px-4 py-10 grid gap-8 md:grid-cols-4">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-lg font-semibold text-white">
                            DZ
                        </div>
                        <div>
                            <div className="text-lg font-semibold">DefZone.Net</div>
                            <p className="text-sm text-slate-400">Noi chia se kien thuc, huong dan va kham pha cong nghe.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-slate-300">
                        <a href="https://facebook.com" aria-label="Facebook" className="hover:text-white transition-colors">
                            <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                                <path d="M13.5 9H15V6h-1.5C10.91 6 10 7.79 10 10v2H8v3h2v6h3v-6h2.07L15.5 12H13v-1.75c0-.69.18-1.25 1.25-1.25Z" />
                            </svg>
                        </a>
                        <a href="https://twitter.com" aria-label="Twitter" className="hover:text-white transition-colors">
                            <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                                <path d="M22 5.92c-.77.35-1.6.58-2.46.69a4.17 4.17 0 0 0 1.83-2.3 8.19 8.19 0 0 1-2.6.99 4.12 4.12 0 0 0-7.1 3.75 11.67 11.67 0 0 1-8.47-4.3 4.12 4.12 0 0 0 1.28 5.5 4.05 4.05 0 0 1-1.86-.51v.05a4.12 4.12 0 0 0 3.3 4.04 4.1 4.1 0 0 1-1.85.07 4.13 4.13 0 0 0 3.85 2.86A8.26 8.26 0 0 1 2 19.54 11.65 11.65 0 0 0 8.29 21c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.36-.02-.54A8.35 8.35 0 0 0 22 5.92Z" />
                            </svg>
                        </a>
                        <a href="https://www.youtube.com" aria-label="YouTube" className="hover:text-white transition-colors">
                            <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                                <path d="M21.6 7.2s-.2-1.4-.8-2a2.8 2.8 0 0 0-2-.8C16.4 4 12 4 12 4h0s-4.4 0-6.8.4a2.8 2.8 0 0 0-2 .8c-.6.6-.8 2-.8 2S2 8.8 2 10.3v1.4C2 13.2 2.4 15 2.4 15s.2 1.4.8 2a2.8 2.8 0 0 0 2 .8C7.6 18 12 18 12 18s4.4 0 6.8-.4a2.8 2.8 0 0 0 2-.8c.6-.6.8-2 .8-2s.4-1.8.4-3.3v-1.4c0-1.5-.4-3.3-.4-3.3Zm-11 6.6V8.2l4.8 2.8-4.8 2.8Z" />
                            </svg>
                        </a>
                        <a href="https://www.linkedin.com" aria-label="LinkedIn" className="hover:text-white transition-colors">
                            <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                                <path d="M6.9 19H4V9h2.9v10Zm-1.45-11.6a1.68 1.68 0 1 1 0-3.36 1.68 1.68 0 0 1 0 3.36ZM20 19h-2.9v-5.1c0-1.22-.02-2.79-1.7-2.79-1.7 0-1.96 1.33-1.96 2.7V19H10V9h2.78v1.37h.04c.39-.74 1.35-1.52 2.78-1.52 2.98 0 3.54 1.96 3.54 4.51V19Z" />
                            </svg>
                        </a>
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-base font-semibold text-white">Lien ket nhanh</h3>
                    <nav className="flex flex-col gap-2 text-sm text-slate-300">
                        <a href="/" className="hover:text-white transition-colors">Trang chủ</a>
                        <a href="/article" className="hover:text-white transition-colors">Bài viết</a>
                        <a href="/wiki" className="hover:text-white transition-colors">Wiki</a>
                        <a href="/shop" className="hover:text-white transition-colors">Cua hang</a>
                        <a href="/contact" className="hover:text-white transition-colors">Lien he</a>
                    </nav>
                </div>

                <div className="space-y-3">
                    <h3 className="text-base font-semibold text-white">Lien he</h3>
                    <div className="flex flex-col gap-2 text-sm text-slate-300">
                        <div>Email: <a className="hover:text-white" href="mailto:hello@defzone.net">hello@defzone.net</a></div>
                        <div>Dien thoai: <a className="hover:text-white" href="tel:+84999999999">+84 999 999 999</a></div>
                        <div>Dia chi: 123 Duong Cong Nghe, Ha Noi</div>
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-base font-semibold text-white">Dang ky nhan tin</h3>
                    <p className="text-sm text-slate-300">Nhan bai viet va cap nhat moi nhat qua email.</p>
                    <form className="space-y-2">
                        <label className="sr-only" htmlFor="footer-email">Email</label>
                        <input
                            id="footer-email"
                            type="email"
                            name="email"
                            required
                            placeholder="you@example.com"
                            className="w-full rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="w-full rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
                        >
                            Dang ky
                        </button>
                    </form>
                </div>
            </div>
            <div className="border-t border-slate-800">
                <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
                    <div>© {year} DefZone.Net. All rights reserved.</div>
                    <div className="flex flex-wrap items-center gap-4">
                        <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
                        <a href="/terms" className="hover:text-white transition-colors">Terms</a>
                        <a href="/sitemap" className="hover:text-white transition-colors">Sitemap</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;