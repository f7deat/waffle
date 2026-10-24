import { apiDistrictList } from "@/services/locations/district";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

const Province: React.FC = async () => {


    const response = await apiDistrictList({ current: 1, pageSize: 7 });
    const provinces = response.data;

    return (
        <section className="w-full py-16 bg-surface overflow-hidden px-4">
            <div className="container mx-auto px-gutter">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-6 h-1 bg-primary rounded-full" />
                            <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider font-semibold">
                                Bản đồ trải nghiệm
                            </span>
                        </div>
                        <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
                            Khám phá theo điểm đến
                        </h2>
                        <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                            Từ ẩm thực cảng biển Hải Phòng đến những thiên đường du lịch nổi
                            tiếng nhất dải đất hình chữ S
                        </p>
                    </div>
                    <Link
                        className="inline-flex items-center gap-1 font-label-lg text-label-lg text-primary hover:text-primary-container transition-colors font-semibold group"
                        href="/place"
                    >
                        <span>Khám phá tất cả 63 tỉnh thành</span>
                        <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                            <FontAwesomeIcon icon={faArrowRight} />
                        </span>
                    </Link>
                </div>
                {/* City Carousel Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
                    {/* City 1: Hải Phòng */}
                    {
                        provinces.map((province) => (
                            <Link key={province.id}
                                className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-surface-container-high shadow-sm hover:shadow-lg transition-all duration-300"
                                href={`/district/${province.id}`}
                            >
                                <div
                                    className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                                    data-alt="Hai Phong Tam Bac river embankment with illuminated colonial street lamps, historic houses and vibrant street cafes at dusk."
                                    style={{
                                        backgroundImage: `url("${province.thumbnail || "https://placehold.co/80x80?text=No+Image"}")`
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-on-surface via-transparent to-transparent" />
                                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm">
                                    Tiêu điểm
                                </div>
                                <div className="absolute bottom-3 left-3 right-3 text-surface">
                                    <h3 className="font-headline-sm text-title font-bold text-surface">
                                        {province.name}
                                    </h3>
                                    <p className="font-body-sm text-body-sm text-surface-container-highest line-clamp-1">
                                        Food Tour &amp; Biển
                                    </p>
                                </div>
                            </Link>
                        ))
                    }
                </div>
            </div>
        </section>
    )
}

export default Province;