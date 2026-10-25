import { apiPlaceList } from "@/services/locations/place";
import { faCocktail, faFire, faHeart, faLocationDot, faStar } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons/faArrowRight";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar } from "antd";
import Link from "next/link";

const Place: React.FC = async () => {

    const placesResponse = await apiPlaceList({ current: 1, pageSize: 6 });
    const places = placesResponse.data || [];

    const colors = ['bg-secondary', 'bg-primary-container', 'bg-tertiary', 'bg-primary', 'bg-surface-container-highest'];

    return (
        <section className="w-full py-16 bg-surface-container-low px-4">
            <div className="container mx-auto px-gutter">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm mb-3">
                            <span className="material-symbols-outlined text-[16px] text-primary">
                                <FontAwesomeIcon icon={faFire} />
                            </span>
                            <span>Đang thịnh hành tuần này</span>
                        </div>
                        <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
                            Địa điểm đang được yêu thích
                        </h2>
                        <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                            Được kiểm chứng chất lượng và đánh giá cao nhất từ các thành viên
                            trải nghiệm thực tế
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href="/place">
                            <button className="px-4 py-2 rounded-full bg-surface-container-lowest text-secondary font-label-md text-label-md shadow-sm hover:bg-secondary hover:text-on-secondary transition-colors cursor-pointer">
                                Xem tất cả gợi ý →
                            </button>
                        </Link>
                    </div>
                </div>
                {/* Grid of 6 destination cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {
                        places.map((place, index) => (
                            <div key={place.id} className="group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
                                <div className="relative w-full h-56 overflow-hidden">
                                    <div
                                        className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                                        data-alt="Traditional hot Vietnamese crab noodle soup banh da cua Cau Dat in Hai Phong with golden fried fishcakes and seasoned pork wraps in betel leaf, rich broth."
                                        style={{
                                            backgroundImage: `url("${place.thumbnail}")`
                                        }}
                                    />
                                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                                        <span className={`px-2.5 py-1 rounded-full ${colors[index % colors.length]} text-on-${colors[index % colors.length].split('-')[1]} font-label-sm text-label-sm shadow-sm`}>
                                            {place.categoryName || 'Đang Hot'}
                                        </span>
                                    </div>
                                    <button
                                        aria-label="Lưu địa điểm"
                                        className="bookmark-btn absolute top-3 right-3 w-9 h-9 rounded-full bg-surface-container-lowest/90 backdrop-blur-md flex items-center justify-center text-on-surface hover:text-primary transition-colors shadow-sm cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">
                                            <FontAwesomeIcon icon={faHeart} />
                                        </span>
                                    </button>
                                    <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-surface-container-lowest/95 backdrop-blur-md font-label-sm text-label-sm text-on-surface flex items-center gap-1 shadow-sm">
                                        <span
                                            className="material-symbols-outlined text-[16px] text-tertiary"
                                            style={{ fontVariationSettings: '"FILL" 1' }}
                                        >
                                            <FontAwesomeIcon icon={faStar} />
                                        </span>
                                        <span className="font-bold">4.9</span>
                                        <span className="text-on-surface-variant font-normal">
                                            (1.2k)
                                        </span>
                                    </div>
                                </div>
                                <div className="p-5 flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center justify-between text-body-sm text-outline mb-1.5">
                                            <span className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[15px] text-primary">
                                                    <FontAwesomeIcon icon={faCocktail} />
                                                </span>
                                                Cafe &amp; Check-in
                                            </span>
                                            <span className="font-semibold text-primary">
                                                45.000đ - 65.000đ
                                            </span>
                                        </div>
                                        <Link href={`/place/${place.normalizedName}`}>
                                            <h3 className="xl:text-lg text-headline-sm line-clamp-1 text-on-surface font-bold group-hover:text-primary transition-colors">
                                                {place.name}
                                            </h3>
                                        </Link>
                                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1.5 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[16px] text-outline">
                                                <FontAwesomeIcon icon={faLocationDot} />
                                            </span>
                                            {`${place.address ? `${place.address}, ` : ''} `}
                                            <Link href={`/district/${place.districtId}`} className="hover:underline">
                                                {place.districtName}
                                            </Link>,
                                            <Link href={`/place/province/${place.provinceId}`} className="hover:underline">
                                                {place.provinceName}
                                            </Link>
                                        </p>
                                    </div>
                                    <div className="mt-4 pt-3 bg-surface-container-low -mx-5 -mb-5 px-5 py-3 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Avatar src={place.influencerAvatar} alt={place.influencerName} />
                                            <span className="font-label-sm text-label-sm text-on-surface-variant">
                                                Review bởi{" "}
                                                <Link href={`/user/${place.influencerUserName || 'tandc'}`} className="font-bold hover:underline">
                                                    {place.influencerName || 'Tân bận rồi'}
                                                </Link>
                                            </span>
                                        </div>
                                        <span className="material-symbols-outlined text-[18px] text-outline group-hover:text-primary group-hover:translate-x-1 transition-all">
                                            <FontAwesomeIcon icon={faArrowRight} />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </section>
    )
}

export default Place;