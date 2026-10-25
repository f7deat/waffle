/* eslint-disable @next/next/no-img-element */
import PageContainer from "@/components/layout/page-container";
import { apiGetUserByUserName } from "@/services/user/user";
import Link from "next/link";
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import { apiInfluencerCompletedJobs } from "@/services/kol/kol";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faBookmark, faCalendar, faCamera, faCheckCircle, faChevronCircleRight, faEnvelope, faEyeLowVision, faFire, faHeart, faLocation, faMap, faMessage, faPieChart, faPlay, faShare, faShieldHalved, faShop, faStar, faThunderstorm, faTrophy, faUserCheck, faUserFriends, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faInstagram, faTiktok, faYoutube } from "@fortawesome/free-brands-svg-icons";
import ContactForm from "./contact-form";
import InfluencerPlace from "./components/place";

type Params = Promise<{
    id: string;
}>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { id } = await params;
    try {
        const res = await apiGetUserByUserName(id);
        const user = res.data;
        if (!user) return {};
        return {
            title: `${user.name} - ${user.userName} - ${process.env.NEXT_PUBLIC_SITE_NAME || 'DefZone.Net'}`,
            description: user.name,

            openGraph: {
                title: user.name,
                description: user.name,
                images: user.avatar ? [user.avatar] : []
            },
        };
    }
    catch (error) {
        return {};
    }
}

const Page = async ({ params }: { params: Params }) => {
    const { id: userName } = await params;

    let user: API.UserBasicInfo | null = null;
    try {
        const userRes = await apiGetUserByUserName(userName);
        user = userRes.data || null;
    } catch (error) {
        console.error('Failed to fetch influencer:', error);
    }

    const breadcrumbs = [
        { label: "Influencer", href: "/influencer" },
        { label: user?.name || userName, href: "#" },
    ];

    if (!user) {
        return (
            <PageContainer breadcrumbs={breadcrumbs}>
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 shadow-sm">
                    <div className="text-4xl mb-3">👤</div>
                    <p className="font-semibold text-slate-700">Influencer không tồn tại.</p>
                    <p className="mt-1 text-sm text-slate-500">Influencer này có thể đã bị xóa hoặc không tồn tại.</p>
                    <Link
                        href="/influencer"
                        className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                    >
                        Quay lại danh sách Influencer
                    </Link>
                </div>
            </PageContainer>
        );
    }

    let completedJobs: API.InfluencerCompletedJobItem[] = [];
    try {
        const jobsRes = await apiInfluencerCompletedJobs(user.userName, { current: 1, pageSize: 6 });
        completedJobs = jobsRes.data ?? [];
    } catch (error) {
        console.error("Failed to fetch influencer completed jobs:", error);
    }

    const joinedDate = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString("vi-VN")
        : "Chưa có thông tin";

    const genderLabel = user.gender === null || user.gender === undefined
        ? "Chưa cập nhật"
        : user.gender
            ? "Nữ"
            : "Nam";

    return (
        <PageContainer breadcrumbs={breadcrumbs}>
            <section className="container mx-auto px-gutter w-full">
                <div className="relative w-full rounded-2xl overflow-hidden shadow-sm bg-surface-container">
                    <div className="bg-cover bg-center h-64 md:h-80 w-full relative" data-alt="Cinematic panorama of colonial heritage streets and aesthetic French architectural cafe exterior in Hai Phong with lush green foliage, warm morning sunlight, vintage bicycles, and a cozy outdoor seating area, photographed in warm editorial film photography tones with soft ambient glow." style={{
                        backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBFnGLx9i9soMfjcTMO_swpwmEfEPBwdETxbAaqbdxDxelMDllaihQWH-q9A3SrV0wng3-i1oa8U-6I809yp0K0Z0ERPa_GdiHiZdLY-xIUXRCf3LhepzNTeKKuQgl27wku3P1DcI3vZhJXoGeh1BTWP_LCM0CsRAhaOVYdYd8kdN2kgVOpZ_CqdrmYSgwZ3Xs_VCfbotz2ilFmPDHdzFcWADmE8G3zlwYqPK4f8Cpdu8SFVuto68lf7w')`
                    }}>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent"></div>
                        <div className="absolute top-4 right-4 flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-secondary font-label-sm text-label-sm shadow-sm">
                                <span className="text-sm">
                                    <FontAwesomeIcon icon={faCamera} />
                                </span>
                                <span>Ảnh bìa: Phố cổ Tam Bạc &amp; Đinh Tiên Hoàng</span>
                            </span>
                        </div>
                    </div>
                    <div className="relative bg-surface-container-lowest px-6 md:px-10 pb-8 pt-4">
                        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 -mt-20 md:-mt-24 mb-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
                                <div className="relative flex-shrink-0">
                                    <img className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover p-1 bg-surface-container-lowest shadow-xl ring-4 ring-surface-container-lowest" data-alt="Close-up portrait of Nguyen Thuy Linh, a charismatic 26-year-old Vietnamese female food creator smiling warmly, natural makeup, candid lifestyle fashion, holding a ceramic coffee cup outdoors in Hai Phong, soft golden hour lighting, authentic, sharp high-resolution photography." src={user.avatar} />
                                    <span className="absolute bottom-1 right-2 w-8 h-8 rounded-full bg-green-500 text-on-secondary flex items-center justify-center shadow-md" title="Tài khoản đã xác minh">
                                        <span className="text-lg text-white">
                                            <FontAwesomeIcon icon={faCheckCircle} />
                                        </span>
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                                        <h1 className="text-xl 2xl:text-4xl font-bold text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">{user.name}</h1>
                                        <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-secondary-container font-label-sm text-label-sm font-bold">
                                            <span className="text-yellow-500 text-[15px]">
                                                <FontAwesomeIcon icon={faTrophy} />
                                            </span>
                                            #1 Foodie Hải Phòng 2024
                                        </span>
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm">
                                            <span className="material-symbols-outlined text-[14px]">
                                                <FontAwesomeIcon icon={faFire} />
                                            </span>
                                            Top Trending
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-body-md text-body-md text-on-surface-variant">
                                        <span className="font-semibold text-primary">@{user.userName}</span>
                                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px] text-secondary">
                                            <FontAwesomeIcon icon={faLocation} />
                                        </span> Hải Phòng &amp; Hà Nội</span>
                                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px] text-tertiary">
                                            <FontAwesomeIcon icon={faShop} />
                                        </span> Ẩm thực, Cafe &amp; Local Tour</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
                                <button className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg shadow-md hover:bg-primary transition-all duration-200 hover:-translate-y-0.5" >
                                    <span className="material-symbols-outlined text-[18px]">
                                        <FontAwesomeIcon icon={faEnvelope} />
                                    </span>
                                    <span>Hợp tác / Booking</span>
                                </button>
                                <button className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-secondary text-on-secondary font-label-lg text-label-lg hover:bg-on-secondary-container transition-all shadow-sm" id="followBtn">
                                    <FontAwesomeIcon icon={faUserPlus} />
                                    <span id="followText">Theo dõi</span>
                                </button>
                                <button aria-label="Chia sẻ hồ sơ" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors">
                                    <FontAwesomeIcon icon={faShare} />
                                </button>
                                <button aria-label="Lưu creator" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:text-primary transition-colors">
                                    <FontAwesomeIcon icon={faBookmark} />
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2 items-center">
                            <div className="lg:col-span-8 flex flex-col gap-2">
                                <p className="font-body-lg text-body-lg text-on-surface leading-relaxed">
                                    “Cùng mình đi càn quét 1001 quán bánh đa cua, cafe phố cổ và những góc bí mật của Đất Cảng nhé! Khám phá ẩm thực chân thực, nói không với tâng bốc vô lý, công khai rõ ràng mọi trải nghiệm.”
                                </p>
                                <div className="flex flex-wrap gap-2 pt-2">
                                    <span className="px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm">#FoodieHaiPhong</span>
                                    <span className="px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm">#FoodTourBaoNgon</span>
                                    <span className="px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm">#CatBaIslandGuide</span>
                                    <span className="px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm">#CafeCheckinPhoCo</span>
                                </div>
                            </div>
                            <div className="lg:col-span-4 flex flex-col gap-2.5 p-4 rounded-xl bg-surface-container-low">
                                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-bold">Kênh mạng xã hội chính thức</span>
                                <div className="grid grid-cols-2 gap-2 font-body-sm text-body-sm">
                                    <a className="flex items-center gap-2 p-2 rounded-lg bg-surface-container-lowest hover:bg-surface-variant transition-colors group" href="#">
                                        <span className="material-symbols-outlined text-primary text-[20px]">
                                            <FontAwesomeIcon icon={faTiktok} />
                                        </span>
                                        <div className="flex flex-col min-w-0">
                                            <span className="font-semibold text-on-surface leading-tight">TikTok</span>
                                            <span className="text-on-surface-variant font-label-sm text-label-sm">450K • 12M Likes</span>
                                        </div>
                                    </a>
                                    <a className="flex items-center gap-2 p-2 rounded-lg bg-surface-container-lowest hover:bg-surface-variant transition-colors group" href="#">
                                        <span className="material-symbols-outlined text-primary-container text-[20px]">
                                            <FontAwesomeIcon icon={faInstagram} />
                                        </span>
                                        <div className="flex flex-col min-w-0">
                                            <span className="font-semibold text-on-surface leading-tight">Instagram</span>
                                            <span className="text-on-surface-variant font-label-sm text-label-sm">180K followers</span>
                                        </div>
                                    </a>
                                    <a className="flex items-center gap-2 p-2 rounded-lg bg-surface-container-lowest hover:bg-surface-variant transition-colors group" href="#">
                                        <span className="material-symbols-outlined text-error text-[20px]">
                                            <FontAwesomeIcon icon={faYoutube} />
                                        </span>
                                        <div className="flex flex-col min-w-0">
                                            <span className="font-semibold text-on-surface leading-tight">YouTube</span>
                                            <span className="text-on-surface-variant font-label-sm text-label-sm">65K subscribers</span>
                                        </div>
                                    </a>
                                    <a className="flex items-center gap-2 p-2 rounded-lg bg-surface-container-lowest hover:bg-surface-variant transition-colors group" href="#">
                                        <span className="material-symbols-outlined text-secondary text-[20px]">
                                            <FontAwesomeIcon icon={faFacebook} />
                                        </span>
                                        <div className="flex flex-col min-w-0">
                                            <span className="font-semibold text-on-surface leading-tight">Facebook</span>
                                            <span className="text-on-surface-variant font-label-sm text-label-sm">120K followers</span>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="container mx-auto px-gutter w-full my-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-2">
                    <div>
                        <div className="flex items-center gap-2 text-secondary font-label-sm text-label-sm uppercase tracking-wider font-bold">
                            <span className="w-2 h-2 rounded-full bg-secondary"></span>
                            <span>Dữ liệu xác thực độc lập</span>
                        </div>
                        <h2 className="font-headline-md text-headline-md text-on-surface mt-1">Chỉ số khán giả &amp; Tầm ảnh hưởng</h2>
                    </div>
                    <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant bg-surface-container px-3 py-1.5 rounded-full">
                        <span className="material-symbols-outlined text-[16px] text-secondary">
                            <FontAwesomeIcon icon={faUserCheck} />
                        </span>
                        <span>Cập nhật ngày 15/10/2024 qua API TikTok &amp; Meta Insights</span>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col justify-between">
                        <div className="flex items-center justify-between text-on-surface-variant">
                            <span className="font-label-md text-label-md">Tổng người theo dõi</span>
                            <span className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-primary">
                                <FontAwesomeIcon icon={faUserFriends} />
                            </span>
                        </div>
                        <div className="mt-4">
                            <div className="font-display-mobile text-display-mobile text-on-surface font-bold tracking-tight">815.000+</div>
                            <div className="flex items-center gap-1 font-label-sm text-label-sm text-secondary mt-1">
                                <span className="material-symbols-outlined text-[15px]">trending_up</span>
                                <span className="font-semibold">+14.2%</span> trong 30 ngày qua
                            </div>
                        </div>
                    </div>
                    <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col justify-between">
                        <div className="flex items-center justify-between text-on-surface-variant">
                            <span className="font-label-md text-label-md">Tỷ lệ tương tác (ER)</span>
                            <span className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-secondary">
                                <span className="material-symbols-outlined text-[18px]">
                                    <FontAwesomeIcon icon={faThunderstorm} />
                                </span>
                            </span>
                        </div>
                        <div className="mt-4">
                            <div className="font-display-mobile text-display-mobile text-secondary font-bold tracking-tight">8.4%</div>
                            <div className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant mt-1">
                                <span className="font-semibold text-secondary">Gấp 2.1x</span> so với mặt bằng Food Review
                            </div>
                        </div>
                    </div>
                    <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col justify-between">
                        <div className="flex items-center justify-between text-on-surface-variant">
                            <span className="font-label-md text-label-md">Lượt xem trung bình/video</span>
                            <span className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-tertiary">
                                <span className="material-symbols-outlined text-[18px]">
                                    <FontAwesomeIcon icon={faEyeLowVision} />
                                </span>
                            </span>
                        </div>
                        <div className="mt-4">
                            <div className="font-display-mobile text-display-mobile text-on-surface font-bold tracking-tight">285K</div>
                            <div className="font-label-sm text-label-sm text-on-surface-variant mt-1">
                                Khoảng dao động: <span className="font-medium text-on-surface">185K – 450K</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col justify-between">
                        <div className="flex items-center justify-between text-on-surface-variant">
                            <span className="font-label-md text-label-md">Tệp người xem chủ đạo</span>
                            <span className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-primary-container">
                                <span className="material-symbols-outlined text-[18px]">
                                    <FontAwesomeIcon icon={faPieChart} />
                                </span>
                            </span>
                        </div>
                        <div className="mt-3 flex flex-col gap-1.5">
                            <div className="flex justify-between items-center font-label-sm text-label-sm">
                                <span className="text-on-surface font-medium">18 - 34 tuổi (72% Nữ)</span>
                                <span className="text-secondary font-bold">88%</span>
                            </div>
                            <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden flex">
                                <div className="bg-primary h-full" title="Hải Phòng (60%)"></div>
                                <div className="bg-secondary h-full" title="Hà Nội (25%)"></div>
                                <div className="bg-tertiary-fixed-dim h-full" title="Tỉnh khác (15%)"></div>
                            </div>
                            <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant mt-0.5">
                                <span>60% Hải Phòng</span>
                                <span>25% Hà Nội</span>
                                <span>15% Khác</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="container mx-auto px-gutter w-full">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-surface-variant/70">
                    <button className="tab-btn px-5 py-3 rounded-t-xl font-title text-title flex items-center gap-2 border-b-2 border-primary text-primary transition-all" id="tab-reviews">
                        <span className="material-symbols-outlined text-[20px]">
                            <FontAwesomeIcon icon={faStar} />
                        </span>
                        <span>Bài đánh giá &amp; Video</span>
                        <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-label-sm font-semibold">42</span>
                    </button>
                    <button className="tab-btn px-5 py-3 rounded-t-xl font-title text-title flex items-center gap-2 border-b-2 border-transparent text-on-surface-variant hover:text-on-surface transition-all" id="tab-map">
                        <span className="material-symbols-outlined text-[20px]">
                            <FontAwesomeIcon icon={faMap} />
                        </span>
                        <span>Bản đồ gợi ý của Linh</span>
                        <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-label-sm font-medium">35 điểm</span>
                    </button>
                    <button className="tab-btn px-5 py-3 rounded-t-xl font-title text-title flex items-center gap-2 border-b-2 border-transparent text-on-surface-variant hover:text-on-surface transition-all" id="tab-itineraries">
                        <span className="material-symbols-outlined text-[20px]">
                            <FontAwesomeIcon icon={faCalendar} />
                        </span>
                        <span>Lịch trình đề xuất</span>
                        <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-label-sm font-medium">4 Tour</span>
                    </button>
                    <button className="tab-btn px-5 py-3 rounded-t-xl font-title text-title flex items-center gap-2 border-b-2 border-transparent text-on-surface-variant hover:text-on-surface transition-all" id="tab-collab">
                        <span className="material-symbols-outlined text-[20px]">
                            <FontAwesomeIcon icon={faEnvelope} />
                        </span>
                        <span>Báo giá &amp; Booking</span>
                    </button>
                </div>
            </section>
            <main className="container mx-auto px-gutter w-full py-4 mb-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        <div className="tab-content flex flex-col gap-6" id="content-reviews">
                            <div className="flex items-center justify-between flex-wrap gap-3 bg-surface-container-low p-3 rounded-xl">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-label-sm text-label-sm text-on-surface-variant font-bold uppercase ml-1">Lọc:</span>
                                    <button className="px-3.5 py-1 rounded-full bg-secondary text-on-secondary font-label-md text-label-md shadow-xs">Tất cả (42)</button>
                                    <button className="px-3.5 py-1 rounded-full bg-surface-container-lowest text-on-surface font-label-md text-label-md hover:bg-surface-variant transition-colors">Bánh đa &amp; Đặc sản</button>
                                    <button className="px-3.5 py-1 rounded-full bg-surface-container-lowest text-on-surface font-label-md text-label-md hover:bg-surface-variant transition-colors">Cafe sống ảo</button>
                                    <button className="px-3.5 py-1 rounded-full bg-surface-container-lowest text-on-surface font-label-md text-label-md hover:bg-surface-variant transition-colors">Ốc &amp; Ăn vặt đêm</button>
                                    <button className="px-3.5 py-1 rounded-full bg-surface-container-lowest text-on-surface font-label-md text-label-md hover:bg-surface-variant transition-colors">Cát Bà &amp; Biển</button>
                                </div>
                                <div className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
                                    <span>Sắp xếp:</span>
                                    <span className="font-semibold text-on-surface cursor-pointer flex items-center">Mới nhất <span className="material-symbols-outlined text-[16px]">
                                        <FontAwesomeIcon icon={faArrowDown} />
                                    </span></span>
                                </div>
                            </div>
                            <InfluencerPlace userName={userName} />
                        </div>
                        <div className="tab-content hidden flex-col gap-5" id="content-map">
                            <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                    <div>
                                        <h3 className="font-headline-sm text-headline-sm text-on-surface">Bản đồ ẩm thực &amp; Cafe Hải Phòng của Linh</h3>
                                        <p className="font-body-sm text-body-sm text-on-surface-variant">35 điểm ăn chơi chuẩn bản địa đã được thẩm định chất lượng và vị trí chính xác.</p>
                                    </div>
                                    <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm shadow-sm hover:bg-on-secondary-container transition-colors">
                                        <span className="material-symbols-outlined text-[16px]">bookmark_add</span>
                                        <span>Lưu toàn bộ bản đồ (Google Maps)</span>
                                    </button>
                                </div>
                                <div className="w-full h-96 bg-cover bg-center rounded-xl relative overflow-hidden shadow-inner flex items-end p-4" data-location="Hai Phong, Vietnam" style={{
                                    backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBwCtkec2Q6dFmiw0WCaG6R_3Mir2fY89zGonMUnv5RsCnqFysPGzZ53hIgKi_M_0Xcgy13toTzoqGQaaR1RsPhHOWGC4fHhoSSJufDJWz_s0QU6pWwvSj-kWDQY2picEaNIMM8ehTk0DRRFy3hQrVRZm1kg7z_8WFJrqjzWkj6M1o42usqXD4ENquIhulQVrk8KoPwQcl_wcXKFPGLUa6f10Bnw0_EibRD28G0dgpxoh3OYvDfRpyCXQ')`
                                }}>
                                    <div className="bg-surface-container-lowest/95 backdrop-blur-md p-4 rounded-xl shadow-lg max-w-sm flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center flex-shrink-0">
                                            <span className="material-symbols-outlined text-[20px]">restaurant</span>
                                        </div>
                                        <div>
                                            <div className="font-label-sm text-label-sm text-primary font-bold">Điểm ghim hot hôm nay</div>
                                            <div className="font-title text-title text-on-surface">Bánh đa cua Cụ Bể &amp; Ốc Thủy Dương</div>
                                            <p className="font-body-sm text-body-sm text-on-surface-variant">Khu vực Lạch Tray &amp; Cầu Đất, mở cửa phục vụ 07:00 – 23:00</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="tab-content hidden flex-col gap-5" id="content-itineraries">
                            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col gap-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-headline-sm text-headline-sm text-on-surface">Cẩm nang &amp; Lịch trình du lịch tự túc</h3>
                                        <p className="font-body-sm text-body-sm text-on-surface-variant">Các tuyến đường tối ưu thời gian, trải nghiệm đủ món ngon không lo quá tải bụng.</p>
                                    </div>
                                    <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-fixed-variant font-label-sm text-label-sm font-semibold">
                                        Độc quyền từ @linhhaiphong
                                    </span>
                                </div>
                                <div className="p-4 rounded-xl bg-surface-container-low flex flex-col md:flex-row gap-5 items-start">
                                    <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                                        <img className="w-full h-full object-cover" data-alt="Railway street station in Hai Phong with yellow vintage French architecture and travelers walking with small backpacks on track." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvVrA2vwzhOmSvBEqm6wTsCEG2ZMa2IoPbUzQTM3jm9xpz-Re-YYgby1N2XvIjPviaNkZxk0LCRuInjbgNspW82dJCsxpR5M7TFwVZSn6uTlWC20p7oYsB4qPc_y4UCfXe67ZgPYjQ2WuLl-XzPEUMzNDLCbQxA2QCRBKTLym8veBXJUdOK_osLSl3cx63MQD2CQS2Gb771aHzdJdxS0E5hLAaCzM9xowPPxOIthIK7tnFxYP7sVKU1g" />
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm font-bold">Food Tour 24H</span>
                                            <span className="font-label-sm text-label-sm text-on-surface-variant">Di chuyển bằng xe máy • Dự toán: ~500.000đ/người</span>
                                        </div>
                                        <h4 className="font-title text-title text-on-surface font-semibold">Hành trình 24 giờ oanh tạc trọn vẹn ẩm thực Đất Cảng cho người mới đến lần đầu</h4>
                                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1.5">
                                            Lịch trình chi tiết: Sáng ga Hải Phòng → Bánh đa cua Kỳ Đồng → Cà phê No.1986 → Bánh mì cay Đinh Tiên Hoàng → Chiều ngắm hoàng hôn sông Tam Bạc → Tối ốc ngõ Cấm.
                                        </p>
                                        <div className="mt-3 flex items-center justify-between pt-2 border-t border-surface-variant/40">
                                            <span className="font-label-sm text-label-sm text-secondary font-semibold">Đã có 4.2K người lưu lịch trình</span>
                                            <a className="font-label-md text-label-md text-primary font-semibold hover:underline flex items-center gap-1" href="#">
                                                Xem chi tiết <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-surface-container-low flex flex-col md:flex-row gap-5 items-start">
                                    <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                                        <img className="w-full h-full object-cover" data-alt="Emerald ocean waters with secluded white sand cove and dramatic towering karst mountains in Lan Ha Bay Cat Ba island Vietnam." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnge3wGuxw8h5EABa9MTg2XBI9A0jmDmkeYbt0WmCbrzSxaWOOBwChmYvageI2iXKFgb3GVnzR8KvI68JXoRZSM0j-Z3prfGh4vWO3eZnOBE2olSKGTgS5u9WDeG_Zw1MV3zOeL1ol9MkWoAvmVMbHl6mt-dPsfvrRL1NfeeaO7uUqj5gwVIa2Se_UlVC_DlKFYAah8ka3WvaHW_BEWMFDgDUhtHL7fnV_PedGsgS61YSy3PrZ05CQFg" />
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm font-bold">Tour 2N1Đ</span>
                                            <span className="font-label-sm text-label-sm text-on-surface-variant">Hải Phòng – Vịnh Lan Hạ – Cát Bà</span>
                                        </div>
                                        <h4 className="font-title text-title text-on-surface font-semibold">Escape cuối tuần: Trốn phố về Cát Bà chèo kayak &amp; thưởng thức hải sản tươi</h4>
                                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1.5">
                                            Tận hưởng không khí trong lành vịnh đảo, ghé làng chài Việt Hải cổ tích, ngủ đêm ngắm bầu trời sao và thưởng thức bề bề rang muối tại nhà bè.
                                        </p>
                                        <div className="mt-3 flex items-center justify-between pt-2 border-t border-surface-variant/40">
                                            <span className="font-label-sm text-label-sm text-secondary font-semibold">Đã có 2.8K người lưu lịch trình</span>
                                            <a className="font-label-md text-label-md text-primary font-semibold hover:underline flex items-center gap-1" href="#">
                                                Xem chi tiết <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="tab-content hidden flex-col gap-5" id="content-collab">
                            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col gap-6">
                                <div>
                                    <h3 className="font-headline-sm text-headline-sm text-on-surface">Thông tin hợp tác &amp; Báo giá tham khảo (Rate Card 2024)</h3>
                                    <p className="font-body-sm text-body-sm text-on-surface-variant">Dành cho chủ nhà hàng, chuỗi cafe, khách sạn nghỉ dưỡng và các đơn vị xúc tiến du lịch.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="p-4 rounded-xl bg-surface-container-low flex flex-col justify-between">
                                        <div>
                                            <div className="font-label-sm text-label-sm text-primary font-bold">Gói Trải Nghiệm Thử</div>
                                            <div className="font-headline-sm text-headline-sm text-on-surface mt-1">Gói Cơ Bản</div>
                                            <ul className="mt-3 flex flex-col gap-2 font-body-sm text-body-sm text-on-surface-variant">
                                                <li className="flex items-center gap-1.5"><span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span> 01 Video TikTok Review ngắn (&lt;60s)</li>
                                                <li className="flex items-center gap-1.5"><span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span> 01 Story Instagram check-in gắn tag</li>
                                                <li className="flex items-center gap-1.5"><span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span> Ghim địa điểm lên bản đồ Linh</li>
                                            </ul>
                                        </div>
                                        <div className="mt-4 pt-3 border-t border-surface-variant/40 font-label-md text-label-md text-secondary font-semibold">
                                            Liên hệ nhận báo giá riêng
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-surface-container-low border-0 relative flex flex-col justify-between shadow-sm">
                                        <div>
                                            <div className="font-label-sm text-label-sm text-primary font-bold">Được yêu thích nhất</div>
                                            <div className="font-headline-sm text-headline-sm text-on-surface mt-1">Gói Toàn Diện</div>
                                            <ul className="mt-3 flex flex-col gap-2 font-body-sm text-body-sm text-on-surface-variant">
                                                <li className="flex items-center gap-1.5"><span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span> 01 Video chuyên sâu TikTok (1-2 phút)</li>
                                                <li className="flex items-center gap-1.5"><span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span> 01 Bài đăng Facebook Page chi tiết</li>
                                                <li className="flex items-center gap-1.5"><span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span> Bộ ảnh chụp Lookbook chuyên nghiệp</li>
                                                <li className="flex items-center gap-1.5"><span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span> Cấp quyền chạy quảng cáo 30 ngày</li>
                                            </ul>
                                        </div>
                                        <div className="mt-4 pt-3 border-t border-surface-variant/40 font-label-md text-label-md text-secondary font-semibold">
                                            Tối ưu cho khai trương / Menu mới
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-surface-container-low flex flex-col justify-between">
                                        <div>
                                            <div className="font-label-sm text-label-sm text-primary font-bold">Chiến Dịch Lớn</div>
                                            <div className="font-headline-sm text-headline-sm text-on-surface mt-1">Đại Sứ Thương Hiệu</div>
                                            <ul className="mt-3 flex flex-col gap-2 font-body-sm text-body-sm text-on-surface-variant">
                                                <li className="flex items-center gap-1.5"><span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span> Chuỗi video theo campaign tháng</li>
                                                <li className="flex items-center gap-1.5"><span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span> Tổ chức minigame / Offline fan</li>
                                                <li className="flex items-center gap-1.5"><span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span> Báo cáo nghiệm thu số liệu độc lập</li>
                                            </ul>
                                        </div>
                                        <div className="mt-4 pt-3 border-t border-surface-variant/40 font-label-md text-label-md text-secondary font-semibold">
                                            Dành cho chuỗi F&amp;B / Resort
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <aside className="lg:col-span-4 flex flex-col gap-6">
                        <ContactForm />
                        <div className="bg-surface-container-low p-5 rounded-2xl flex flex-col gap-3">
                            <div className="flex items-center gap-2 text-secondary">
                                <span className="material-symbols-outlined text-[20px]">
                                    <FontAwesomeIcon icon={faShieldHalved} />
                                </span>
                                <span className="font-title text-title font-semibold">Cam kết của {user.name?.split(' ').pop()} với Độc giả</span>
                            </div>
                            <ul className="flex flex-col gap-2.5 font-body-sm text-body-sm text-on-surface-variant">
                                <li className="flex items-start gap-2">
                                    <span className="material-symbols-outlined text-secondary text-[16px] mt-0.5"><FontAwesomeIcon icon={faCheckCircle} /></span>
                                    <span><strong>100% trải nghiệm thực tế:</strong> Chỉ giới thiệu những món ăn bản thân thấy ngon và hợp vệ sinh.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="material-symbols-outlined text-secondary text-[16px] mt-0.5"><FontAwesomeIcon icon={faCheckCircle} /></span>
                                    <span><strong>Minh bạch tài trợ:</strong> Mọi bài viết có tài trợ của nhãn hàng luôn được gắn nhãn công khai rõ ràng.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="material-symbols-outlined text-secondary text-[16px] mt-0.5"><FontAwesomeIcon icon={faCheckCircle} /></span>
                                    <span><strong>Không tâng bốc sai sự thật:</strong> Giữ vững khẩu vị độc lập và tôn trọng trải nghiệm chân thực của người đi sau.</span>
                                </li>
                            </ul>
                        </div>
                        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-title text-title text-on-surface font-semibold flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-primary text-[20px]">
                                        <FontAwesomeIcon icon={faHeart} />
                                    </span>
                                    <span>Quán ruột của {user.name?.split(' ').pop()}</span>
                                </h3>
                                <span className="font-label-sm text-label-sm text-secondary font-medium">Top 4</span>
                            </div>
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-container-low transition-colors">
                                    <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                                        <img className="w-full h-full object-cover" data-alt="Vietnamese dry crab noodle bowl with dark brown noodles, crispy shallots, peanuts, shredded pork sausage, sweet savory sauce." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtpEagUaPM1ma7g6U_dWR9iH2htXDGq4P80yAAbe_DRR4ag4KP3im1Dp1NEskBilssdxc75GQTTcHFwN6xrZnwO5PRL9rcW9nzZRV6BysLNLkgxrbNN31tGL14aXYy1PxUddfS-jv6EKMWlWX5xftqU0e7gIFusMCDBybOqW8bLtSHXuJzaVYfWfgLaxK6JV2yofLK2T0Gck-kFhTFofkHYk67rE5wFJsgTDbuIVDQW2ANOW2xCEAFOQ" />
                                    </div>
                                    <div className="flex flex-col min-w-0 flex-1">
                                        <span className="font-title text-[15px] text-on-surface truncate font-semibold">Bánh đa cua trộn Kỳ Đồng</span>
                                        <span className="font-label-sm text-label-sm text-on-surface-variant">26 Kỳ Đồng, Quang Trung</span>
                                        <div className="flex items-center justify-between mt-1 font-label-sm text-label-sm">
                                            <span className="text-primary font-medium">35K - 45K</span>
                                            <span className="text-tertiary-container font-bold">★ 9.6/10</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-container-low transition-colors">
                                    <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                                        <img className="w-full h-full object-cover" data-alt="Traditional Hai Phong style small pate bread baguette fresh off charcoal grill with steaming savory crust." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnw0pRs9858LQ4wbXK61GxcTy5tQsfd2zKbWDpm4y2i-LoF1aG0cZE3uATzHioGDGNl6we0zpPTUBNyWds_ins0nMe3XJwHrQGWIpC5eJDMGg9KsJ2uuFucWo9sevDDg2l9HMQJkyrYrwH6HYNUQ-DmJuM1ipnR8qtIDQ3I-ZAOkhI5YZzXG_yWY4MxSozZKB-UeCG9gERD0XcFOST5a4454CJ_uzA3wV2PnldXBpaNqmnf4HAN8MHPg" />
                                    </div>
                                    <div className="flex flex-col min-w-0 flex-1">
                                        <span className="font-title text-[15px] text-on-surface truncate font-semibold">Bánh mì cay Bà Già</span>
                                        <span className="font-label-sm text-label-sm text-on-surface-variant">57 Lê Lợi, Máy Tơ</span>
                                        <div className="flex items-center justify-between mt-1 font-label-sm text-label-sm">
                                            <span className="text-primary font-medium">3K/chiếc</span>
                                            <span className="text-tertiary-container font-bold">★ 9.4/10</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-container-low transition-colors">
                                    <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                                        <img className="w-full h-full object-cover" data-alt="Vietnamese coconut dessert sweet soup with coconut cream, shaved ice, coconut jelly, and roasted sesame." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPaY32xc1_2eDkY2HFxI0ICBz9o-tu2bQGwpMop-FXDuGLq3fkN-4GFcFIu4VsKik6VmFoJSJnW8gKxQnQkJaf3uTFspyJd-o-_aEjUeM0_RNwKU2smSy9tJUm-nezZvK3srASqwQSnjDhTzKaAN2phmVIJMmeJbGsMLpecxlvjBhZd9dgPP8qfY1Hu6sYV-uQw_bh8_xMorbQaKdG937HNOQOD-bw7PGwABSav5sjJrVUC7pfhGIA6w" />
                                    </div>
                                    <div className="flex flex-col min-w-0 flex-1">
                                        <span className="font-title text-[15px] text-on-surface truncate font-semibold">Chè dừa dầm cô Thúy</span>
                                        <span className="font-label-sm text-label-sm text-on-surface-variant">124 Lạch Tray, Ngô Quyền</span>
                                        <div className="flex items-center justify-between mt-1 font-label-sm text-label-sm">
                                            <span className="text-primary font-medium">25K - 30K</span>
                                            <span className="text-tertiary-container font-bold">★ 9.3/10</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-container-low transition-colors">
                                    <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                                        <img className="w-full h-full object-cover" data-alt="Stir fried snails with spicy chili lemongrass sauce in large pan served with sweet fish sauce ginger dip." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPJxAPvrdIySmv5uUPNomdpWI0Bj5_B_Pc3KT8U4-VNoYgNTA4RS1sAcoBcAHLxizXqj6QYxcGIQZXDRL-mA6G39pnaqg1tk4hyd4AGKSIbLPS0WNfhtD9KtaCzNhEQshEQwlKt_REGCMjSiQLvg7HGlvugnyCNhtBnHfdfjrdPob9MYi_rD9jf8I7f8GDEVWRHs-6RfktPqwi42bf-Nz8W5Z1y6pdqw6WMOqHJw4gxU0TTg4KnuELyw" />
                                    </div>
                                    <div className="flex flex-col min-w-0 flex-1">
                                        <span className="font-title text-[15px] text-on-surface truncate font-semibold">Ốc Thủy Dương Lạch Tray</span>
                                        <span className="font-label-sm text-label-sm text-on-surface-variant">30/263 Lạch Tray</span>
                                        <div className="flex items-center justify-between mt-1 font-label-sm text-label-sm">
                                            <span className="text-primary font-medium">50K - 120K</span>
                                            <span className="text-tertiary-container font-bold">★ 9.5/10</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button className="w-full py-2.5 rounded-full bg-surface-container text-on-surface-variant hover:bg-secondary hover:text-on-secondary font-label-md text-label-md transition-all text-center">
                                Xem thêm trên Bản đồ →
                            </button>
                        </div>
                    </aside>
                </div>
            </main>
        </PageContainer>
    );
};

export default Page;
