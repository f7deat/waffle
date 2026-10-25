import { apiInfluencerRandomList } from "@/services/user/user";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

const Influencer: React.FC = async () => {

    const influencersResponse = await apiInfluencerRandomList({ current: 1, pageSize: 4 });
    const influencers = influencersResponse.data || [];

    const colors = ['bg-primary-fixed', 'bg-secondary-fixed', 'bg-tertiary-fixed'];

    const randomNumber = (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    return (
        <section className="w-full py-16 bg-surface px-4">
            <div className="container mx-auto px-gutter">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-6 h-1 bg-tertiary-container rounded-full" />
                            <span className="font-label-sm text-label-sm text-tertiary uppercase tracking-wider font-semibold">
                                Nhà sáng tạo nội dung hàng đầu
                            </span>
                        </div>
                        <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
                            Những người truyền cảm hứng khám phá
                        </h2>
                        <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                            Theo dõi góc nhìn chân thực từ các Food Blogger và Travel Creators
                            được yêu thích nhất
                        </p>
                    </div>
                    <button className="px-4 py-2 rounded-full bg-surface-container text-on-surface font-label-md text-label-md hover:bg-secondary hover:text-on-secondary transition-colors cursor-pointer">
                        Trở thành Creator Đi Đâu Đây →
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Influencer 1 */}
                    {
                        influencers.map((influencer, index) => (
                            <div key={influencer.id} className="bg-surface-container-low rounded-2xl p-6 flex flex-col items-center text-center shadow-sm hover:shadow-lg transition-all duration-300 group">
                                <div className="relative mb-4">
                                    <div
                                        className="w-20 h-20 rounded-full bg-cover bg-center shadow-md"
                                        data-alt="Portrait of young Vietnamese male food reviewer smiling warmly holding camera at street food stall, professional creator photography."
                                        style={{
                                            backgroundImage: `url("${influencer.avatar || 'https://i.pravatar.cc/300'}")`
                                        }}
                                    />
                                    <span
                                        className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-sm"
                                        title="Đã xác thực"
                                    >
                                        <span className="material-symbols-outlined text-[14px]">
                                            <FontAwesomeIcon icon={faCircleCheck} />
                                        </span>
                                    </span>
                                </div>
                                <Link href={`/user/${influencer.userName}`}>
                                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold group-hover:text-primary transition-colors">
                                        {influencer.name}
                                    </h3>
                                </Link>

                                <p className="font-label-sm text-label-sm text-outline">
                                    @{influencer.userName}
                                </p>
                                <div className={`inline-block px-2.5 py-0.5 rounded-full  text-on-secondary-fixed font-label-sm text-label-sm my-2 ${colors[index % colors.length]}`}>
                                    {influencer.provinceName || 'Hải Phòng'}
                                </div>
                                <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mb-4">
                                    {influencer.bio || 'Chào mọi người, mình là một food blogger đam mê khám phá ẩm thực đường phố và chia sẻ những trải nghiệm ẩm thực độc đáo từ khắp nơi trên thế giới.'}
                                </p>
                                <div className="w-full grid grid-cols-2 py-2.5 bg-surface-container-lowest rounded-xl mb-4 font-label-sm text-label-sm">
                                    <div>
                                        <span className="text-on-surface font-bold">{randomNumber(800, 900)}K</span>
                                        <p className="text-outline text-[11px]">Followers</p>
                                    </div>
                                    <div>
                                        <span className="text-secondary font-bold">{randomNumber(5, 15)}%</span>
                                        <p className="text-outline text-[11px]">Tương tác</p>
                                    </div>
                                </div>
                                <button className="w-full py-2 px-4 rounded-full bg-surface-container-highest hover:bg-primary hover:text-on-primary text-on-surface font-label-md text-label-md transition-all cursor-pointer">
                                    Xem {influencer.placeCount} địa điểm gợi ý
                                </button>
                            </div>
                        ))
                    }
                </div>
            </div>
        </section>
    )
}

export default Influencer;