import { CaretRightFilled, EnvironmentOutlined, FacebookFilled, InstagramFilled, LinkedinFilled, MailOutlined, PhoneOutlined, TikTokFilled } from "@ant-design/icons";
import Link from "next/link";
import LanguageSelector from "./language";

const Footer: React.FC = () => {

    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-slate-800 bg-slate-950 text-slate-100">
            <div className="mx-auto container px-4 py-10 grid gap-8 md:grid-cols-4">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-16 items-center justify-center rounded-full bg-blue-500 text-lg font-semibold text-white">
                            DZ
                        </div>
                        <div>
                            <div className="text-lg font-semibold">DefZone.Net</div>
                            <p className="text-sm text-slate-400">Noi chia se kien thuc, huong dan va kham pha cong nghe.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-slate-300">
                        <a href="https://www.facebook.com/defzone.net/" aria-label="Facebook" className="hover:text-white transition-colors border rounded-lg h-10 w-10 flex items-center justify-center border-slate-700">
                            <FacebookFilled />
                        </a>
                        <a href="https://www.instagram.com/f7deat/" aria-label="Instagram" className="hover:text-white transition-colors border rounded-lg h-10 w-10 flex items-center justify-center border-slate-700">
                            <InstagramFilled />
                        </a>
                        <a href="https://www.tiktok.com/@f7deat" aria-label="TikTok" className="hover:text-white transition-colors border rounded-lg h-10 w-10 flex items-center justify-center border-slate-700">
                            <TikTokFilled />
                        </a>
                        <a href="https://www.linkedin.com/in/f7deat/" aria-label="LinkedIn" className="hover:text-white transition-colors border rounded-lg h-10 w-10 flex items-center justify-center border-slate-700">
                            <LinkedinFilled />
                        </a>
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-base font-semibold text-white">Liên kết nhanh</h3>
                    <nav className="grid grid-cols-2 gap-2 text-sm text-slate-300">
                        <Link href="/" className="hover:text-white transition-colors"><CaretRightFilled /> Trang chủ</Link>
                        <Link href="/article" className="hover:text-white transition-colors"><CaretRightFilled /> Bài viết</Link>
                        <Link href="/wiki" className="hover:text-white transition-colors"><CaretRightFilled /> Wiki</Link>
                        <Link href="/shop" className="hover:text-white transition-colors"><CaretRightFilled /> Cửa hàng</Link>
                        <Link href="/contact" className="hover:text-white transition-colors"><CaretRightFilled /> Liên hệ</Link>
                        <Link href="/influencer" className="hover:text-white transition-colors"><CaretRightFilled /> Influencers</Link>
                    </nav>
                </div>

                <div className="space-y-3">
                    <h3 className="text-base font-semibold text-white">Liên hệ</h3>
                    <div className="flex flex-col gap-2 text-sm text-slate-300">
                        <div><MailOutlined className="mr-1" />Email: <a className="hover:text-white" href="mailto:defzone.net@gmail.com">defzone.net@gmail.com</a></div>
                        <div><PhoneOutlined className="mr-1" />Điện thoại: <a className="hover:text-white" href="tel:+84762559696">+84 762 559 696</a></div>
                        <div><EnvironmentOutlined className="mr-1" />Địa chỉ: Thiên Hương, Thủy Nguyên, Hải Phòng</div>
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-base font-semibold text-white">Đăng ký nhận tin</h3>
                    <p className="text-sm text-slate-300">Nhận bài viết và cập nhật mới nhất qua email.</p>
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
                            Đăng ký
                        </button>
                    </form>
                </div>
            </div>
            <div className="border-t border-slate-800">
                <div className="mx-auto flex container flex-col gap-3 px-4 py-4 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
                    <div>© {year} DefZone.Net. All rights reserved.</div>
                    <div className="flex flex-wrap items-center gap-4">
                        <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
                        <a href="/terms" className="hover:text-white transition-colors">Terms</a>
                        <a href="/sitemap" className="hover:text-white transition-colors">Sitemap</a>
                        <LanguageSelector />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;