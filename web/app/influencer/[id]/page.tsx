/* eslint-disable @next/next/no-img-element */
import PageContainer from "@/components/layout/page-container";
import { apiGetUserByUserName } from "@/services/user/user";
import Link from "next/link";
import ContactForm from "./client";
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import CompletedJobs from "./completed-jobs";
import { apiInfluencerCompletedJobs } from "@/services/kol/kol";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faBookmark, faCalendar, faCamera, faCheckCircle, faChevronCircleRight, faEnvelope, faEyeLowVision, faFire, faHeart, faLocation, faMap, faMessage, faPieChart, faPlay, faShare, faShieldHalved, faShop, faStar, faThunderstorm, faTrophy, faUserCheck, faUserFriends, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faInstagram, faTiktok, faYoutube } from "@fortawesome/free-brands-svg-icons";

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
            title: `${user.name} - ${process.env.NEXT_PUBLIC_SITE_NAME}`,
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <article className="flex flex-col bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group">
                                    <div className="relative h-56 w-full overflow-hidden">
                                        <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Modern architectural coffee shop No 1986 Coffee in Hai Phong featuring striking raw brick walls, large vertical skylight atrium with sunbeams pouring inside, lush indoor tropical plants, minimalist wooden tables, and young people enjoying iced Vietnamese specialty drinks." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvfaKPQC5ydVjEvWWqwPFVICXSyQOSkDHKCvhTyIkLLjvo2An800DvVv8QiFDT8YoO2rDQNBwSvlwql733j6QL_VtudUibYjWfoEFx_5NvNp4Acit1jBjFmMi4Nfd5ZvIPdsmjlA2_mBzf7UAIzOQoFIMNDZnnTOWCpofBc7ClyKEoB3r50qYuuuTn0V69BxgwOVhkBD4sSQbCzGNnjFS-BwvRNA1fK8e_RbKV428BYZxvCeUeaYZ6jA" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                                            <span className="px-2.5 py-1 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm font-semibold backdrop-blur-md">Cafe Vibe</span>
                                            <span className="px-2 py-0.5 rounded-full bg-surface-container-lowest/90 text-on-surface font-label-sm text-label-sm font-semibold flex items-center gap-1 shadow-xs">
                                                <span className="material-symbols-outlined text-[13px] text-primary">
                                                    <FontAwesomeIcon icon={faCheckCircle} />
                                                </span> Độc lập
                                            </span>
                                        </div>
                                        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-center text-on-surface shadow-sm">
                                            <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                                        </div>
                                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-on-primary">
                                            <span className="font-label-sm text-label-sm flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[14px]">visibility</span> 320K lượt xem
                                            </span>
                                            <span className="font-label-sm text-label-sm flex items-center gap-1 bg-tertiary-container/90 px-2 py-0.5 rounded text-on-tertiary font-bold">
                                                ★ 9.5 / 10
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4 flex flex-col flex-1 justify-between">
                                        <div>
                                            <div className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 mb-1">
                                                <span className="material-symbols-outlined text-[14px] text-secondary">pin_drop</span> 33 Đinh Tiên Hoàng, Hồng Bàng
                                            </div>
                                            <h3 className="font-title text-title text-on-surface group-hover:text-primary transition-colors line-clamp-2">
                                                Review No.1986 Coffee: Giếng trời gạch nung sống động nhất phố Đinh Tiên Hoàng
                                            </h3>
                                            <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 line-clamp-2">
                                                Không gian kiến trúc đạt giải quốc tế, bánh sừng bò hạnh nhân đỉnh chóp. Khuyên mọi người nên ghé tầm 8h-10h sáng để bắt trọn ánh sáng tự nhiên từ giếng trời nhé!
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between pt-3 mt-3 border-t border-surface-variant/40 font-label-sm text-label-sm text-on-surface-variant">
                                            <span>Khoảng giá: 45K - 85K</span>
                                            <span className="text-primary font-semibold hover:underline">Xem video review →</span>
                                        </div>
                                    </div>
                                </article>
                                <article className="flex flex-col bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group">
                                    <div className="relative h-56 w-full overflow-hidden">
                                        <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Steaming hot traditional bowl of Hai Phong red noodle crab soup Banh Da Cua Be Ba Cu with rich brown broth, tender crab claw meat, fresh fried cha la lot, crispy fried pork fat tops, morning glory greens, and sliced bird eye chilies, photographed with rich macro food styling." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxcaMYOrasuKNCk5QJdbedg_Bt4eah04FzLyKPIR_2m16PJ_lm4WCVVNlJlWDjfuY1D9oimiJLusrY9r2RLtDIGwkNORZaBHWvRu6C2pnvCu1Zm-9JD1NMF6oyioz6GtLcRIfUwx9m96HHSJ_T1pPhWviSU-IcNtXqFhvsqMEsYRGaBxYtOznw0w-deHNoP8sw_9EGDtfCm1AKy82st5Gevrzfp_iS9sIG2YmBwr9HkEIfnrZShhHSrg" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                                            <span className="px-2.5 py-1 rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-semibold backdrop-blur-md">Đặc sản cốt lõi</span>
                                            <span className="px-2 py-0.5 rounded-full bg-surface-container-lowest/90 text-on-surface font-label-sm text-label-sm font-semibold flex items-center gap-1 shadow-xs">
                                                <span className="material-symbols-outlined text-[13px] text-primary">
                                                    <FontAwesomeIcon icon={faCheckCircle} />
                                                </span> Độc lập
                                            </span>
                                        </div>
                                        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-center text-on-surface shadow-sm">
                                            <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                                        </div>
                                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-on-primary">
                                            <span className="font-label-sm text-label-sm flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[14px]">visibility</span> 480K lượt xem
                                            </span>
                                            <span className="font-label-sm text-label-sm flex items-center gap-1 bg-tertiary-container/90 px-2 py-0.5 rounded text-on-tertiary font-bold">
                                                ★ 9.0 / 10
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4 flex flex-col flex-1 justify-between">
                                        <div>
                                            <div className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 mb-1">
                                                <span className="material-symbols-outlined text-[14px] text-secondary">pin_drop</span> 179 Cầu Đất, Ngô Quyền
                                            </div>
                                            <h3 className="font-title text-title text-on-surface group-hover:text-primary transition-colors line-clamp-2">
                                                Bánh đa cua bể Bà Cụ: Nước dùng ngọt thanh cua tươi hay chỉ là lời đồn?
                                            </h3>
                                            <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 line-clamp-2">
                                                Quán ruột hơn 4 thập kỷ của người Hải Phòng. Nước dùng nấu từ cua bể sống ngọt thanh không lạm dụng mì chính, chả lá lốt thơm nức mũi. Trải nghiệm chấm quẩy giòn tan.
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between pt-3 mt-3 border-t border-surface-variant/40 font-label-sm text-label-sm text-on-surface-variant">
                                            <span>Khoảng giá: 50K - 70K</span>
                                            <span className="text-primary font-semibold hover:underline">Xem video review →</span>
                                        </div>
                                    </div>
                                </article>
                                <article className="flex flex-col bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group">
                                    <div className="relative h-56 w-full overflow-hidden">
                                        <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Vibrant night street food stall in Hai Phong with an array of fresh snails cooked in sweet spicy lemongrass tamarind sauce, steaming metal pots, salted egg sauce snails, stir fried morning glory with garlic, accompanied by local beer bottles under warm incandescent bulb lighting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuClw2mB-rtm_d07CDL_tgYZOaHQ-lZtyJlBpKZ416e4staZvD3_gCPWsXrsd59ttwl00lR8RBiS8XiMmzqcefFaaZ9_TPGV0kjW0XAaW_2RfXASobSwa9IYi3jea4UlHRgN9MWjfThZd9IRVz8-aTDMQxKPURWdGWGO1TEDU79QOOVBTGwrxp1y-Hi5etwFSNorimwuMaycpPB5hz2gFK28XBfMSp2OjNlhPG4ROZ3TcEeZtjQOfc6ULA" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                                            <span className="px-2.5 py-1 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm font-semibold backdrop-blur-md">Ăn đêm</span>
                                            <span className="px-2 py-0.5 rounded-full bg-surface-container-lowest/90 text-on-surface font-label-sm text-label-sm font-semibold flex items-center gap-1 shadow-xs">
                                                <span className="material-symbols-outlined text-[13px] text-primary">
                                                    <FontAwesomeIcon icon={faCheckCircle} />
                                                </span> Độc lập
                                            </span>
                                        </div>
                                        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-center text-on-surface shadow-sm">
                                            <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                                        </div>
                                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-on-primary">
                                            <span className="font-label-sm text-label-sm flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[14px]">visibility</span> 210K lượt xem
                                            </span>
                                            <span className="font-label-sm text-label-sm flex items-center gap-1 bg-tertiary-container/90 px-2 py-0.5 rounded text-on-tertiary font-bold">
                                                ★ 9.2 / 10
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4 flex flex-col flex-1 justify-between">
                                        <div>
                                            <div className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 mb-1">
                                                <span className="material-symbols-outlined text-[14px] text-secondary">pin_drop</span> Ngõ Cấm &amp; Lạch Tray
                                            </div>
                                            <h3 className="font-title text-title text-on-surface group-hover:text-primary transition-colors line-clamp-2">
                                                Top 5 quán ốc đêm ngon quên lối về ở ngõ Cấm và Lạch Tray
                                            </h3>
                                            <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 line-clamp-2">
                                                Đến Hải Phòng mà chưa ăn ốc xào me dừa cay xè lưỡi thì coi như mất nửa chuyến đi! Cẩm nang 5 quán chuẩn vị của dân thổ địa mở tới 2 giờ sáng.
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between pt-3 mt-3 border-t border-surface-variant/40 font-label-sm text-label-sm text-on-surface-variant">
                                            <span>Khoảng giá: 60K - 120K/người</span>
                                            <span className="text-primary font-semibold hover:underline">Xem video review →</span>
                                        </div>
                                    </div>
                                </article>
                                <article className="flex flex-col bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group">
                                    <div className="relative h-56 w-full overflow-hidden">
                                        <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Crispy golden Hai Phong spicy baguette bread Banh Mi Cay stuffed with pork pate beside a dish of fiery red chi chuong sauce, paired with a glass of cool sweet green pandan Che Thai dessert with coconut milk on a rustic street table." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAY57q9IRqNSeKLxgOg5mPOy1WrJR8jfqdnqoquwjwWuVhcQWhhPpqB-U0UKtNm0NcuVpEXlAb1OoFuRibaMl_ESZfFSiVndrIPrFPglqTQGRUVmU-Cl_QXoQjsa4dv9ikvUZK3dXMzCVs6qbbKCU5T3Deis0MUB5-grW888l5Ers5IQeF1KKmpu4iHU5KM9KRTZx7YSMFc5IrZk6eoBv7n-n3Rj1DwNoxnqkrGyZM4Q_duzgAhI4qKyQ" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                                            <span className="px-2.5 py-1 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm font-semibold backdrop-blur-md">Ăn vặt thần thánh</span>
                                            <span className="px-2 py-0.5 rounded-full bg-surface-container-lowest/90 text-on-surface font-label-sm text-label-sm font-semibold flex items-center gap-1 shadow-xs">
                                                <span className="material-symbols-outlined text-[13px] text-primary">
                                                    <FontAwesomeIcon icon={faCheckCircle} />
                                                    </span> Độc lập
                                            </span>
                                        </div>
                                        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-center text-on-surface shadow-sm">
                                            <span className="material-symbols-outlined text-[18px]">
                                                <FontAwesomeIcon icon={faPlay} />
                                            </span>
                                        </div>
                                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-on-primary">
                                            <span className="font-label-sm text-label-sm flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[14px]">visibility</span> 195K lượt xem
                                            </span>
                                            <span className="font-label-sm text-label-sm flex items-center gap-1 bg-tertiary-container/90 px-2 py-0.5 rounded text-on-tertiary font-bold">
                                                ★ 9.8 / 10
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4 flex flex-col flex-1 justify-between">
                                        <div>
                                            <div className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 mb-1">
                                                <span className="material-symbols-outlined text-[14px] text-secondary">pin_drop</span> 37 Đinh Tiên Hoàng
                                            </div>
                                            <h3 className="font-title text-title text-on-surface group-hover:text-primary transition-colors line-clamp-2">
                                                Bánh mì cay và chè thái Đinh Tiên Hoàng - Combo bất hủ giá học sinh
                                            </h3>
                                            <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 line-clamp-2">
                                                Chí chương cay nồng tự nấu gia truyền, pate thơm bùi tan trong miệng. Ăn kèm ly chè thái giun xanh nước cốt dừa thanh mát giải cay tức thì.
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between pt-3 mt-3 border-t border-surface-variant/40 font-label-sm text-label-sm text-on-surface-variant">
                                            <span>Khoảng giá: 3K - 20K</span>
                                            <span className="text-primary font-semibold hover:underline">Xem video review →</span>
                                        </div>
                                    </div>
                                </article>
                                <article className="flex flex-col bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group">
                                    <div className="relative h-56 w-full overflow-hidden">
                                        <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Dreamy golden sunset view over Tam Bac river in Hai Phong, reflexions of colorful colonial shophouses on water ripples, artisanal cocktail glasses with citrus garnishes resting on wooden balcony table of a vintage riverside lounge." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXbmxFmpoQ04b9OBwtog_HeuITtAGkBHyHGV62-j4fj4qHsKO1MULvNLSnc_7fR11X_3nV_LRcXNuSRQyAC_px82MHfja4aZnXIDOsFt2tuc0KmgeA_PAdzn9TIZ7OnrE9cw2sPylHmsaT1gyMblenQy1_3i-vNcIUoVeRcBIMBOKG42x89l8RCpXBYodbsIUld_XhuMdLvBeFNB5wiNZjPuquD7-G3AhbZu-u4OlllTtu-8lLyIFipw" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                                            <span className="px-2.5 py-1 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm font-semibold backdrop-blur-md">Nightlife &amp; Chill</span>
                                            <span className="px-2 py-0.5 rounded-full bg-surface-container-lowest/90 text-on-surface font-label-sm text-label-sm font-semibold flex items-center gap-1 shadow-xs">
                                                <span className="material-symbols-outlined text-[13px] text-primary">verified</span> Độc lập
                                            </span>
                                        </div>
                                        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-center text-on-surface shadow-sm">
                                            <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                                        </div>
                                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-on-primary">
                                            <span className="font-label-sm text-label-sm flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[14px]">visibility</span> 150K lượt xem
                                            </span>
                                            <span className="font-label-sm text-label-sm flex items-center gap-1 bg-tertiary-container/90 px-2 py-0.5 rounded text-on-tertiary font-bold">
                                                ★ 8.8 / 10
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4 flex flex-col flex-1 justify-between">
                                        <div>
                                            <div className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 mb-1">
                                                <span className="material-symbols-outlined text-[14px] text-secondary">pin_drop</span> Phố đi bộ Tam Bạc
                                            </div>
                                            <h3 className="font-title text-title text-on-surface group-hover:text-primary transition-colors line-clamp-2">
                                                Sunset cocktail chill ngắm hoàng hôn đỏ rực tại bờ sông Tam Bạc
                                            </h3>
                                            <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 line-clamp-2">
                                                Gợi ý địa điểm hẹn hò ngắm đàn thiên nga bơi lội và ánh hoàng hôn buông xuống dòng sông thơ mộng bậc nhất trung tâm thành phố.
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between pt-3 mt-3 border-t border-surface-variant/40 font-label-sm text-label-sm text-on-surface-variant">
                                            <span>Khoảng giá: 90K - 150K</span>
                                            <span className="text-primary font-semibold hover:underline">Xem video review →</span>
                                        </div>
                                    </div>
                                </article>
                                <article className="flex flex-col bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group">
                                    <div className="relative h-56 w-full overflow-hidden">
                                        <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Luxury tropical eco-resort nestled against dramatic limestone karst cliff on pristine Cat Ba beach, lush vertical hanging gardens covering the architecture, infinity pool overlooking emerald green sea waters of Lan Ha Bay, sunny day." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAleXPI27BA95INyuMXnI82wedULgbWrzmvtuLLnAAt-tGsTtK4v0IIedhdDewPAMAFCVo4VhG4zLnb4RMFEkj56Xcf8jfuL0ChgcQZGiNFRZup0UXLAkmAuVxCbF1sumwpCv-sdIRffp0sKVKwdJnWEVaNXAIPppI3e90cwAs5TgoT0htaN2lw-ukkLysnobLKjmZ2k5_J4fevpHJ2Okrt58WeRgnCRu3caHJ6R5G9EJDIBUVyaayPtw" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                                            <span className="px-2.5 py-1 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm font-semibold backdrop-blur-md">Nghỉ dưỡng</span>
                                            <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-container font-label-sm text-label-sm font-bold flex items-center gap-1 shadow-xs">
                                                <span className="material-symbols-outlined text-[13px]">campaign</span> Hợp tác trải nghiệm
                                            </span>
                                        </div>
                                        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-center text-on-surface shadow-sm">
                                            <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                                        </div>
                                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-on-primary">
                                            <span className="font-label-sm text-label-sm flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[14px]">visibility</span> 280K lượt xem
                                            </span>
                                            <span className="font-label-sm text-label-sm flex items-center gap-1 bg-tertiary-container/90 px-2 py-0.5 rounded text-on-tertiary font-bold">
                                                ★ 9.0 / 10
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4 flex flex-col flex-1 justify-between">
                                        <div>
                                            <div className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 mb-1">
                                                <span className="material-symbols-outlined text-[14px] text-secondary">pin_drop</span> Bãi Cò 1 &amp; Cò 2, Cát Bà
                                            </div>
                                            <h3 className="font-title text-title text-on-surface group-hover:text-primary transition-colors line-clamp-2">
                                                Khu nghỉ dưỡng Flamingo Cát Bà: Có thực sự đáng tiền cho chuyến đi gia đình?
                                            </h3>
                                            <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 line-clamp-2">
                                                Review chi tiết 2 ngày 1 đêm: đánh giá trung thực từ ẩm thực buffet, dịch vụ tắm khoáng Onsen Nhật Bản và trải nghiệm chèo kayak vịnh Lan Hạ.
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between pt-3 mt-3 border-t border-surface-variant/40 font-label-sm text-label-sm text-on-surface-variant">
                                            <span>Khoảng giá: 2.100K - 4.500K/đêm</span>
                                            <span className="text-primary font-semibold hover:underline">Xem video review →</span>
                                        </div>
                                    </div>
                                </article>
                            </div>
                            <div className="flex justify-center mt-4">
                                <button className="px-6 py-2.5 rounded-full bg-surface-container-lowest border-0 font-label-lg text-label-lg text-secondary shadow-sm hover:bg-secondary hover:text-on-secondary transition-all flex items-center gap-2">
                                    <span>Xem thêm 36 bài viết &amp; video cũ hơn</span>
                                    <span className="material-symbols-outlined text-[18px]">
                                        <FontAwesomeIcon icon={faChevronCircleRight} />
                                    </span>
                                </button>
                            </div>
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
                        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col gap-4" id="booking-section">
                            <div className="flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center">
                                    <span className="text-sm">
                                        <FontAwesomeIcon icon={faMessage} />
                                    </span>
                                </span>
                                <div>
                                    <h3 className="font-title text-title text-on-surface font-semibold">Gửi yêu cầu hợp tác nhanh</h3>
                                    <p className="font-label-sm text-label-sm text-on-surface-variant">Phản hồi trong vòng 12-24 giờ làm việc</p>
                                </div>
                            </div>
                            <form className="flex flex-col gap-3.5 mt-1" id="bookingForm" >
                                <div>
                                    <label className="block font-label-sm text-label-sm text-on-surface font-semibold mb-1">Tên đơn vị / Thương hiệu *</label>
                                    <input className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary border-0" placeholder="Ví dụ: Cà phê Phố Cổ, Quán ăn Bà Ba..." />
                                </div>
                                <div>
                                    <label className="block font-label-sm text-label-sm text-on-surface font-semibold mb-1">Hình thức muốn hợp tác *</label>
                                    <select className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary border-0">
                                        <option value="1">Trải nghiệm &amp; Review quán ăn / cafe mới</option>
                                        <option value="2">Quay video TikTok Review chuyên sâu</option>
                                        <option value="3">Ghim bài &amp; Vị trí lên Bản đồ độc quyền</option>
                                        <option value="4">Chụp bộ ảnh Lookbook không gian &amp; món</option>
                                        <option value="5">Hợp tác dài hạn / Đại sứ thương hiệu</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block font-label-sm text-label-sm text-on-surface font-semibold mb-1">Số điện thoại *</label>
                                        <input className="w-full px-3 py-2.5 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary border-0" placeholder="09xx..." />
                                    </div>
                                    <div>
                                        <label className="block font-label-sm text-label-sm text-on-surface font-semibold mb-1">Email liên hệ</label>
                                        <input className="w-full px-3 py-2.5 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary border-0" placeholder="contact@..." type="email" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block font-label-sm text-label-sm text-on-surface font-semibold mb-1">Nội dung tóm tắt &amp; Thời gian dự kiến</label>
                                    <textarea className="w-full px-3.5 py-2 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary border-0 resize-none" placeholder="Ghi chú về địa điểm, địa chỉ, món đặc trưng và thời gian bạn muốn triển khai..." rows={3}></textarea>
                                </div>
                                <button className="w-full mt-1 py-3 rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg shadow-sm hover:bg-primary transition-all flex items-center justify-center gap-2" type="submit">
                                    <span className="material-symbols-outlined text-[18px]">
                                        <FontAwesomeIcon icon={faEnvelope} />
                                    </span>
                                    <span>Gửi lời mời hợp tác</span>
                                </button>
                                <p className="font-body-sm text-[11px] text-center text-on-surface-variant">
                                    Hoặc liên hệ Quản lý: <span className="font-semibold text-secondary">defzone.net@gmail.com</span> (0762.559.696)
                                </p>
                            </form>
                            <div className="hidden p-3 rounded-lg bg-secondary-container text-on-secondary-fixed-variant font-label-sm text-label-sm text-center" id="bookingToast">
                                ✓ Yêu cầu hợp tác đã gửi thành công! {user.name?.split(' ').pop()} sẽ liên hệ lại sớm nhất.
                            </div>
                        </div>
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
