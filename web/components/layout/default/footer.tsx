import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import LanguageSelector from "../language";
import { faFacebook, faInstagram, faTiktok, faLinkedin } from '@fortawesome/free-brands-svg-icons';

const DEFAULT_LINKS = [
    { name: "Trang chủ", href: "/" },
    { name: "Bài viết", href: "/article" },
    { name: "Wiki", href: "/wiki" },
    { name: "Cửa hàng", href: "/shop" },
    { name: "Liên hệ", href: "/contact" },
    { name: "Influencers", href: "/influencer" },
    { name: "Album", href: "/album" },
];

const DefaultFooter: React.FC = () => {

    const year = new Date().getFullYear();
    const companyName = "DefZone.Net";
    const email = "defzone.net@gmail.com";
    const phoneNumber = "+84 762 559 696";
    const address = "Thiên Hương, Thủy Nguyên, Hải Phòng";

    return (
        <footer className="border-t border-slate-800 bg-slate-950 text-slate-100">
            <div className="mx-auto container px-4 py-10 grid gap-8 md:grid-cols-4">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-16 items-center justify-center rounded-full bg-blue-500 text-lg font-semibold text-white">
                            {companyName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <div className="text-lg font-semibold">{companyName}</div>
                            <p className="text-sm text-slate-400">Noi chia se kien thuc, huong dan va kham pha cong nghe.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-slate-300">
                        <a href={"https://www.facebook.com/defzone.net"} aria-label="Facebook" className="hover:text-white transition-colors border rounded-lg h-10 w-10 flex items-center justify-center border-slate-700">
                                <FontAwesomeIcon icon={faFacebook} />
                            </a>
                        <a href={"https://www.instagram.com/f7deat/"} aria-label="Instagram" className="hover:text-white transition-colors border rounded-lg h-10 w-10 flex items-center justify-center border-slate-700">
                                <FontAwesomeIcon icon={faInstagram} />
                            </a>
                        <a href="https://www.tiktok.com/@f7deat" aria-label="TikTok" className="hover:text-white transition-colors border rounded-lg h-10 w-10 flex items-center justify-center border-slate-700">
                            <FontAwesomeIcon icon={faTiktok} />
                        </a>
                        <a href="https://www.linkedin.com/in/f7deat/" aria-label="LinkedIn" className="hover:text-white transition-colors border rounded-lg h-10 w-10 flex items-center justify-center border-slate-700">
                            <FontAwesomeIcon icon={faLinkedin} />
                        </a>
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-base font-semibold text-white">Liên kết nhanh</h3>
                    <nav className="grid grid-cols-2 gap-2 text-sm text-slate-300">
                        
                    </nav>
                </div>

                <div className="space-y-3">
                    <h3 className="text-base font-semibold text-white">Liên hệ</h3>
                    <div className="flex flex-col gap-2 text-sm text-slate-300">
                        {/* <div><MailOutlined className="mr-1" />Email: <a className="hover:text-white" href={`mailto:${email}`}>{email}</a></div> */}
                        {/* <div><PhoneOutlined className="mr-1" />Điện thoại: <a className="hover:text-white" href={`tel:${phoneNumber}`}>{phoneNumber}</a></div> */}
                        {/* <div><EnvironmentOutlined className="mr-1" />Địa chỉ: {address}</div> */}
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
                    <div>© {year} {companyName}. All rights reserved.</div>
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

export default DefaultFooter;