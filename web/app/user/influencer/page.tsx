import { apiKolList } from "@/services/kol/kol";
import { Metadata } from "next";
import Link from "next/link";
import { faArrowAltCircleRight, faCheck, faCheckCircle, faChevronLeft, faChevronRight, faEnvelope, faEye, faLocationDot, faMapLocation, faMoneyBill, faPhone, faSearch, faStar, faStore, faTasks, faTrophy, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons/faInstagram";
import { faYoutube } from "@fortawesome/free-brands-svg-icons/faYoutube";
import { faTiktok } from "@fortawesome/free-brands-svg-icons/faTiktok";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'Influencers - DefZone.Net',
        description: 'Khám phá các influencer hàng đầu cùng KOLs và người ảnh hưởng.',
        openGraph: {
            title: 'Influencers - DefZone.Net',
            description: 'Khám phá các influencer hàng đầu cùng KOLs và người ảnh hưởng.',
        },
    };
}

const Page: React.FC = async () => {
    const response = await apiKolList({ current: 1, pageSize: 12 });
    const influencers = response.data;

    return (
        <main className="w-full bg-surface min-h-[calc(100vh-28rem)]">
            <div className="flex flex-col w-full">
                {/* Top Ambient Glow Accent */}
                <div className="relative w-full overflow-hidden bg-surface-container-low pt-10 pb-16 px-4 md:px-0">
                    <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-gradient-to-br from-primary-fixed-dim/20 via-tertiary-fixed/30 to-secondary-fixed/20 blur-3xl pointer-events-none rounded-full" />
                    <div className="container mx-auto px-gutter relative z-10 flex flex-col items-center text-center">
                        {/* Badge Category Tag */}
                        <div className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-surface-container-lowest shadow-sm mb-4">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider">
                                Creator Economy Platform
                            </span>
                            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                                • 500+ Local Taste-makers
                            </span>
                        </div>
                        {/* Headline */}
                        <h1 className="font-display text-display text-on-surface max-w-4xl tracking-tight leading-tight">
                            Khám phá Việt Nam cùng những{" "}
                            <span className="text-primary italic">Nhà sáng tạo</span> nội dung
                            hàng đầu
                        </h1>
                        <p className="mt-4 font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
                            Kết nối trực tiếp hơn 500+ Food Reviewer, Travel Blogger và Lifestyle
                            Creator có sức ảnh hưởng chân thực tại Hải Phòng, Hà Nội, TP.HCM &amp;
                            Đà Nẵng.
                        </p>
                        {/* Advanced Curated Filter Command Deck */}
                        <div className="w-full mt-8 bg-surface-container-lowest rounded-xl shadow-md p-4 sm:p-6 max-w-7xl text-left">
                            {/* Top Row: Search by Keyword / Handle */}
                            <div className="flex flex-col md:flex-row items-center gap-4 pb-4">
                                <div className="relative flex-1 w-full bg-surface-container-low rounded-full px-6 py-3 flex items-center">
                                    <span className="material-symbols-outlined text-outline text-[22px] mr-2">
                                        <FontAwesomeIcon icon={faSearch} />
                                    </span>
                                    <input
                                        className="w-full bg-transparent font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none"
                                        id="creator-search-input"
                                        placeholder="Tìm theo tên hoặc @username (ví dụ: @linhhaiphong, @haiphong_eats, @minhan)..."
                                        type="text"
                                    />
                                    <button className="bg-primary min-w-40 text-on-primary font-label-md text-label-md px-6 py-1.5 rounded-full hover:bg-primary-container transition-all flex items-center gap-1 shadow-sm">
                                        <span>Lọc hồ sơ</span>
                                        <span className="material-symbols-outlined text-[16px]">
                                            <FontAwesomeIcon icon={faArrowAltCircleRight} />
                                        </span>
                                    </button>
                                </div>
                                {/* Quick Stat Mini Counter Pill */}
                                <div className="hidden lg:flex items-center gap-2 bg-surface-container-low px-4 py-2.5 rounded-full">
                                    <span
                                        className="material-symbols-outlined text-secondary text-[20px]"
                                        style={{ fontVariationSettings: '"FILL" 1' }}
                                    >
                                        <FontAwesomeIcon icon={faCheck} />
                                    </span>
                                    <span className="font-label-md text-label-md text-on-surface">
                                        320+ Hồ sơ đã xác minh
                                    </span>
                                </div>
                            </div>
                            {/* Filter Selectors Matrix */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-2">
                                {/* City Dropdown */}
                                <div className="flex flex-col gap-1">
                                    <label className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[16px] text-primary">
                                            <FontAwesomeIcon icon={faLocationDot} />
                                        </span>{" "}
                                        Thành phố hoạt động
                                    </label>
                                    <select className="w-full bg-surface-container-low font-body-md text-body-md text-on-surface rounded-lg px-4 py-2.5 focus:outline-none cursor-pointer">
                                        <option value="all">Tất cả địa điểm</option>
                                        <option selected value="hp">
                                            Hải Phòng (Đất Cảng)
                                        </option>
                                        <option value="hn">Hà Nội (Thủ đô)</option>
                                        <option value="hcm">TP. Hồ Chí Minh</option>
                                        <option value="dn">Đà Nẵng &amp; Hội An</option>
                                        <option value="dl">Đà Lạt &amp; Cao Nguyên</option>
                                    </select>
                                </div>
                                {/* Niche Subject */}
                                <div className="flex flex-col gap-1">
                                    <label className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[16px] text-tertiary">
                                            category
                                        </span>{" "}
                                        Lĩnh vực chuyên sâu
                                    </label>
                                    <select className="w-full bg-surface-container-low font-body-md text-body-md text-on-surface rounded-lg px-4 py-2.5 focus:outline-none cursor-pointer">
                                        <option value="all">Tất cả chủ đề</option>
                                        <option selected value="food">
                                            🍜 Ẩm thực (Food &amp; Dining)
                                        </option>
                                        <option value="cafe">☕ Cà phê (Cafe Hopping)</option>
                                        <option value="travel">
                                            ✈️ Du lịch (Travel &amp; Adventure)
                                        </option>
                                        <option value="stay">
                                            🏨 Khách sạn &amp; Resort Staycation
                                        </option>
                                        <option value="local">
                                            🛵 Trải nghiệm bản địa (Local Gems)
                                        </option>
                                    </select>
                                </div>
                                {/* Audience Scale Tier */}
                                <div className="flex flex-col gap-1">
                                    <label className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[16px] text-secondary">
                                            groups
                                        </span>{" "}
                                        Quy mô người theo dõi
                                    </label>
                                    <select className="w-full bg-surface-container-low font-body-md text-body-md text-on-surface rounded-lg px-4 py-2.5 focus:outline-none cursor-pointer">
                                        <option value="all">Mọi quy mô</option>
                                        <option value="top">Top KOLs (&gt; 250K)</option>
                                        <option selected value="macro">
                                            Macro Creator (50K - 250K)
                                        </option>
                                        <option value="micro">Micro Creator (10K - 50K)</option>
                                        <option value="nano">Nano Reviewer (&lt; 10K)</option>
                                    </select>
                                </div>
                                {/* Main Social Channel */}
                                <div className="flex flex-col gap-1">
                                    <label className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[16px] text-primary-container">
                                            share
                                        </span>{" "}
                                        Kênh chính
                                    </label>
                                    <select className="w-full bg-surface-container-low font-body-md text-body-md text-on-surface rounded-lg px-4 py-2.5 focus:outline-none cursor-pointer">
                                        <option value="all">Tất cả kênh phát hành</option>
                                        <option selected value="tiktok">
                                            TikTok Trending
                                        </option>
                                        <option value="instagram">Instagram Visual Reel</option>
                                        <option value="youtube">YouTube Vlogs / Shorts</option>
                                        <option value="facebook">Facebook Community</option>
                                    </select>
                                </div>
                            </div>
                            {/* Filter Chips Row */}
                            <div className="flex flex-wrap items-center gap-2 pt-4 mt-2">
                                <span className="font-label-sm text-label-sm text-on-surface-variant mr-1">
                                    Tìm nhanh:
                                </span>
                                <button className="px-4 py-1 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm shadow-sm">
                                    🍜 Food Tour Hải Phòng
                                </button>
                                <button className="px-4 py-1 rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all font-label-sm text-label-sm">
                                    ☕ Cafe Sống Ảo Hot
                                </button>
                                <button className="px-4 py-1 rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all font-label-sm text-label-sm">
                                    📸 Check-in Cát Bà
                                </button>
                                <button className="px-4 py-1 rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all font-label-sm text-label-sm">
                                    ✨ Michelin Selected Spot
                                </button>
                                <button className="px-4 py-1 rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all font-label-sm text-label-sm">
                                    🛵 Ẩm thực đường phố
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Main Directory Section */}
                <div className="container mx-auto px-gutter py-6 w-full px-4 md:px-0">
                    {/* Section Tabs & Sorting Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-space-xs">
                                <span className="material-symbols-outlined text-primary text-[20px]">
                                    <FontAwesomeIcon icon={faStar} />
                                </span>
                                <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-wider">
                                    Khám phá Reviewer chất lượng
                                </span>
                            </div>
                            <h2 className="font-headline-lg text-headline-lg md:text-2xl font-bold text-on-surface">
                                Bảng xếp hạng Nhà sáng tạo tiêu biểu
                            </h2>
                        </div>
                        {/* Category Filter Pills (Navigation View) */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
                            <button className="px-6 py-2 rounded-full bg-secondary text-on-secondary font-label-md text-label-md whitespace-nowrap shadow-sm flex items-center gap-1.5">
                                <span>🌟 Nổi bật nhất tuần</span>
                            </button>
                            <button className="px-6 py-2 rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all font-label-md text-label-md whitespace-nowrap flex items-center gap-1.5">
                                <span>🔥 Tăng trưởng nhanh</span>
                            </button>
                            <button className="px-6 py-2 rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all font-label-md text-label-md whitespace-nowrap flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[16px] text-primary">
                                    📌
                                </span>
                                <span>Creator Hải Phòng tiêu biểu</span>
                            </button>
                            <button className="px-6 py-2 rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all font-label-md text-label-md whitespace-nowrap flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[16px] text-tertiary">
                                    <FontAwesomeIcon icon={faCheckCircle} />
                                </span>
                                <span>Đã xác thực uy tín</span>
                            </button>
                        </div>
                    </div>
                    {/* Influencers Card Grid (12-column responsive layout) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {
                            influencers.map((influencer) => (
                                <div className="flex flex-col bg-surface-container-lowest rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 group relative">
                                    {/* Badge Ranking Ribbon */}
                                    <div className="absolute top-4 right-4 bg-tertiary-fixed text-on-tertiary-fixed px-2.5 py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1 shadow-sm">
                                        <span className="material-symbols-outlined text-[14px]">
                                            <FontAwesomeIcon icon={faTrophy} />
                                        </span>
                                        <span>#1 Foodie Hải Phòng</span>
                                    </div>
                                    {/* Top Profile Info */}
                                    <div className="flex items-start gap-4">
                                        <div className="relative">
                                            <img
                                                className="w-16 h-16 rounded-full object-cover shadow-sm group-hover:scale-105 transition-transform duration-300"
                                                data-alt="Editorial portrait of a cheerful young Vietnamese female food blogger holding iced traditional coffee at a sunlit colonial cafe in Hai Phong, soft warm daylight, high detail, stylish casual linen outfit."
                                                src={influencer.avatar}
                                            />
                                            <span
                                                className="absolute -bottom-1 -right-1 w-5 h-5 bg-secondary text-on-secondary rounded-full flex items-center justify-center text-[11px] shadow-sm"
                                                title="Xác minh chính chủ"
                                            >
                                                <span
                                                    className="material-symbols-outlined text-[13px]"
                                                    style={{ fontVariationSettings: '"FILL" 1' }}
                                                >
                                                    <FontAwesomeIcon icon={faCheckCircle} />
                                                </span>
                                            </span>
                                        </div>
                                        <div className="flex flex-col pr-12 min-w-0">
                                            <div className="flex items-center gap-1">
                                                <h3 className="font-title text-title text-on-surface font-bold truncate">
                                                    {influencer.name}
                                                </h3>
                                            </div>
                                            <span className="font-label-md text-label-md text-primary font-medium">
                                                @{influencer.userName}
                                            </span>
                                            <div className="flex items-center gap-1.5 mt-1 text-on-surface-variant font-body-sm text-body-sm">
                                                <span className="material-symbols-outlined text-[14px]">
                                                    <FontAwesomeIcon icon={faLocationDot} />
                                                </span>
                                                <span>{influencer.provinceName}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Bio Quote */}
                                    <p className="mt-4 font-body-sm text-body-sm text-on-surface-variant italic line-clamp-2">
                                        "Cùng mình đi càn quét 1001 quán bánh đa cua, cafe phố cổ và những
                                        góc bí mật của Đất Cảng nhé! 🦀✨"
                                    </p>
                                    {/* Niche Tags */}
                                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                        <span className="px-2 py-0.5 rounded-md bg-surface-container font-label-sm text-label-sm text-on-surface-variant font-medium">
                                            #FoodReview
                                        </span>
                                        <span className="px-2 py-0.5 rounded-md bg-surface-container font-label-sm text-label-sm text-on-surface-variant font-medium">
                                            #HaiPhongFoodTour
                                        </span>
                                        <span className="px-2 py-0.5 rounded-md bg-surface-container font-label-sm text-label-sm text-on-surface-variant font-medium">
                                            #CafeHopping
                                        </span>
                                    </div>
                                    {/* Transparent Analytics Bar */}
                                    <div className="grid grid-cols-3 gap-2 py-3 px-4 bg-surface-container-low rounded-xl mt-4 text-center">
                                        <div className="flex flex-col">
                                            <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                                                450K
                                            </span>
                                            <span className="font-label-sm text-label-sm text-on-surface-variant">
                                                Followers
                                            </span>
                                        </div>
                                        <div className="flex flex-col border-x border-surface-variant/60">
                                            <span className="font-headline-sm text-headline-sm text-secondary font-bold">
                                                8.4%
                                            </span>
                                            <span className="font-label-sm text-label-sm text-on-surface-variant">
                                                Avg. ER
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-headline-sm text-headline-sm text-primary font-bold">
                                                142
                                            </span>
                                            <span className="font-label-sm text-label-sm text-on-surface-variant">
                                                Ghim địa điểm
                                            </span>
                                        </div>
                                    </div>
                                    {/* Social Channels & Mini Reviews */}
                                    <div className="mt-4 flex flex-col gap-2">
                                        <div className="flex items-center justify-between text-on-surface-variant">
                                            <span className="font-label-sm text-label-sm font-semibold">
                                                Bài review nổi bật gần đây:
                                            </span>
                                            <div className="flex items-center gap-1.5">
                                                <span
                                                    className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:text-primary transition-colors cursor-pointer"
                                                    title="TikTok"
                                                >
                                                    <span className="material-symbols-outlined text-[14px]">
                                                        <FontAwesomeIcon icon={faTiktok} />
                                                    </span>
                                                </span>
                                                <span
                                                    className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:text-primary transition-colors cursor-pointer"
                                                    title="Instagram"
                                                >
                                                    <span className="material-symbols-outlined text-[14px]">
                                                        <FontAwesomeIcon icon={faInstagram} />
                                                    </span>
                                                </span>
                                                <span
                                                    className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:text-primary transition-colors cursor-pointer"
                                                    title="YouTube"
                                                >
                                                    <span className="material-symbols-outlined text-[14px]">
                                                        <FontAwesomeIcon icon={faYoutube} />
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                        {/* 3 Micro-Thumbnail Placeholders */}
                                        <div className="grid grid-cols-3 gap-2">
                                            <div className="relative group/thumb rounded-lg overflow-hidden h-20 bg-surface-container">
                                                <img
                                                    className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-300"
                                                    data-alt="Steaming hot bowl of authentic Hai Phong crab noodle soup banh da cua with beef and betel leaf rolls, close up food photography, vibrant warm colors."
                                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7MOoI3NIUOWmCVqAr9WVF1DejgileaCORZCK6sVP9ntMJmcqpbvZrWANn3as0iggWTQCvlHleAHN1HbPmFhWiB5sdqLfC8Lh9nht9rxw0BSKPcZ5AzvPvMHcGC9lUMNbINkUx4cLbyQ_0t2HEs47xzCzK-6xjwiX5P6_0gmTgPjwW8F1glMZCgv9ve82BfCHC4scM1K_8BNOHQQ7cOYX4sNi3Hf90vS4HGWyG0LzbGXiudpXxcdWH4g"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-transparent to-transparent opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-end p-1">
                                                    <span className="font-label-sm text-[10px] text-inverse-on-surface font-medium truncate">
                                                        Bánh đa cua Cụ Cương
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="relative group/thumb rounded-lg overflow-hidden h-20 bg-surface-container">
                                                <img
                                                    className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-300"
                                                    data-alt="Cozy vintage coffee shop with brick walls and warm amber lighting in old downtown Hai Phong, aesthetic tables and potted fern plants."
                                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjE5g0FRZrGJ8pNmJ3JcC_tWhaik3CpLWHJhvj1MonUyZYVlEPMGrj97t6GVSEMjAE7wwfZo8C6XIaUY47jF2yxvhRHxFvWjEpxvo1qqXWZm9BHvCpJGnNgDMydAUDGtfbWnnl19TNMgaiCBZiNNY7SIbK_uFvMLCXaeXkmdauponq4E6lKXppdaPmXm6GHsi9hZnE1JjA8k8Ur-2-kUxej_CCOao6vw0vOeFJJwllf9q8NedZEg4H6A"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-transparent to-transparent opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-end p-1">
                                                    <span className="font-label-sm text-[10px] text-inverse-on-surface font-medium truncate">
                                                        No.1986 Cafe
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="relative group/thumb rounded-lg overflow-hidden h-20 bg-surface-container">
                                                <img
                                                    className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-300"
                                                    data-alt="Crispy Hai Phong pate banh mi sandwiches with spicy chi chuong chili sauce on traditional wooden platter, appetizing food presentation."
                                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD68jInYkWPPFU9jLWvhSueS6png8xlUfLytwXNVrEf0_gVbTOfeHJ31eyL_3KYzWpJaeh6UB5UweesBBqZ7uI_tLBdn_eaeLicg-CgQAia_PXvT1kGVwtdIbewp7UrJVhtv1Zg-6L79HFwz7DHAMVCl4b0jdW38gTMTaQ4XHU85GG6E99raSJwqqzdgzOB_RbMD85GJ143XRkQuCuuTtS1KHTCS18kPIdkkQIQA3FpJmTm0qkdAgLfVg"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-transparent to-transparent opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-end p-1">
                                                    <span className="font-label-sm text-[10px] text-inverse-on-surface font-medium truncate">
                                                        Bánh mì cay Cột Đèn
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Action CTAs */}
                                    <div className="grid grid-cols-2 gap-2 mt-6 pt-2">
                                        <button className="w-full py-2.5 px-2 rounded-full bg-surface-container-high hover:bg-surface-variant text-on-surface font-label-md text-label-md transition-colors text-center flex items-center justify-center gap-1">
                                            <span className="material-symbols-outlined text-[16px]">
                                                <FontAwesomeIcon icon={faEye} />
                                            </span>
                                            <span>Xem hồ sơ</span>
                                        </button>
                                        <button className="w-full py-2.5 px-2 rounded-full bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md shadow-sm transition-all text-center flex items-center justify-center gap-1">
                                            <span className="material-symbols-outlined text-[16px]">
                                                <FontAwesomeIcon icon={faEnvelope} />
                                            </span>
                                            <span>Hợp tác</span>
                                        </button>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    {/* Pagination & Directory Stat Strip */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 bg-surface-container-lowest rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <span className="font-body-md text-body-md text-on-surface-variant">
                                Hiển thị{" "}
                                <strong className="text-on-surface font-semibold">6</strong> trong
                                số <strong className="text-on-surface font-semibold">512</strong>{" "}
                                Reviewer uy tín
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors">
                                <span className="material-symbols-outlined text-[18px]">
                                    <FontAwesomeIcon icon={faChevronLeft} />
                                </span>
                            </button>
                            <button className="w-9 h-9 rounded-full bg-primary text-on-primary font-label-md text-label-md shadow-sm">
                                1
                            </button>
                            <button className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors">
                                2
                            </button>
                            <button className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors">
                                3
                            </button>
                            <span className="text-on-surface-variant px-1 font-body-sm text-body-sm">
                                ...
                            </span>
                            <button className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors">
                                42
                            </button>
                            <button className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors">
                                <FontAwesomeIcon icon={faChevronRight} />
                            </button>
                        </div>
                    </div>
                </div>
                {/* B2B Brand Collaboration Banner: Dành Cho Chủ Quán & Doanh Nghiệp */}
                <div className="container mx-auto px-gutter pb-8 w-full">
                    <div className="relative p-4 overflow-hidden rounded-xl bg-gradient-to-r from-secondary via-secondary to-on-secondary-container text-on-secondary md:p-8 md:p-12 shadow-xl">
                        {/* Decorative Backdrop Circles */}
                        <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-white/5 blur-2xl pointer-events-none" />
                        <div className="absolute right-1/3 -top-20 w-60 h-60 rounded-full bg-tertiary-fixed-dim/10 blur-xl pointer-events-none" />
                        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-4">
                            <div className="flex flex-col gap-2 max-w-2xl text-center lg:text-left">
                                <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-white/10 text-on-secondary w-fit mx-auto lg:mx-0 backdrop-blur-sm">
                                    <span className="material-symbols-outlined text-[16px] text-tertiary-fixed">
                                        <FontAwesomeIcon icon={faStore} />
                                    </span>
                                    <span className="font-label-sm text-label-sm tracking-wide">
                                        Giải pháp tiếp thị bản địa cho chủ doanh nghiệp
                                    </span>
                                </div>
                                <h2 className="font-headline-lg text-headline-lg text-on-secondary leading-tight">
                                    Bạn muốn mời Reviewer trải nghiệm và đưa địa điểm của mình lên xu
                                    hướng?
                                </h2>
                                <p className="font-body-lg text-body-lg text-secondary-fixed opacity-90">
                                    Dễ dàng kết nối với các Food Blogger &amp; Creator phù hợp với
                                    phong cách quán cafe, nhà hàng hoặc khách sạn của bạn. Đo lường
                                    hiệu quả chuyển đổi với số liệu minh bạch theo thời gian thực.
                                </p>
                                {/* 3 Value Props */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-tertiary-fixed text-[20px]">
                                            <FontAwesomeIcon icon={faMoneyBill} />
                                        </span>
                                        <span className="font-label-md text-label-md">
                                            Đúng tệp khách địa phương
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-tertiary-fixed text-[20px]">
                                            <FontAwesomeIcon icon={faTasks} />
                                        </span>
                                        <span className="font-label-md text-label-md">
                                            Chi phí minh bạch, linh hoạt
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-tertiary-fixed text-[20px]">
                                            <FontAwesomeIcon icon={faMapLocation} />
                                        </span>
                                        <span className="font-label-md text-label-md">
                                            Hỗ trợ gắn ghim Map độc quyền
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {/* Action CTAs Box */}
                            <div className="flex flex-col sm:flex-row lg:flex-col gap-2 w-full lg:w-auto flex-shrink-0">
                                <a
                                    className="px-6 py-3.5 rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg text-center hover:bg-primary shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                                    href="#"
                                >
                                    <span className="material-symbols-outlined text-[20px]">
                                        <FontAwesomeIcon icon={faTasks} />
                                    </span>
                                    <span>Đăng chiến dịch Review &amp; Tiếp thị</span>
                                </a>
                                <a
                                    className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-on-secondary font-label-md text-label-md text-center backdrop-blur-sm transition-all flex items-center justify-center gap-2"
                                    href="#"
                                >
                                    <span className="material-symbols-outlined text-[18px]">
                                        <FontAwesomeIcon icon={faPhone} />
                                    </span>
                                    <span>Tư vấn chiến lược miễn phí (1:1)</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto py-8 px-4 md:px-0">
                {/* Job CTA */}
                <div className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-lg px-5 py-4 mb-6">
                    <div>
                        <p className="font-semibold text-blue-800">Tìm kiếm việc làm Influencer?</p>
                        <p className="text-sm text-blue-600 mt-0.5">Thương hiệu đang tuyển influencer — ứng tuyển ngay hôm nay!</p>
                    </div>
                    <Link
                        href="/influencer/job"
                        className="shrink-0 inline-block bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                        Xem việc làm →
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default Page;
