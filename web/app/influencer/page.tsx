import PageContainer from "@/components/layout/page-container";
import { apiKolList } from "@/services/kol/kol";
import { CheckCircleFilled, StarFilled, UserOutlined } from "@ant-design/icons";
import { Metadata } from "next";
import Link from "next/link";
import InfluencerFilter from "./clients/filter";

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

    const formatFollowers = (count: number) => {
        if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
        if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
        return count.toString();
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    return (
        <PageContainer>
            <div className="max-w-7xl mx-auto py-8 px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Influencers
                    </h1>
                    <p className="text-gray-600">
                        Khám phá và kết nối với các influencer hàng đầu
                    </p>
                </div>

                {/* Search and Filters */}
                <InfluencerFilter />

                {/* Register CTA Section */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 mb-8 text-white">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold mb-2">
                                Bạn là Influencer?
                            </h2>
                            <p className="text-blue-100 mb-4">
                                Đăng ký ngay để kết nối với các thương hiệu và nhận được nhiều cơ hội hợp tác hấp dẫn
                            </p>
                            <ul className="space-y-2 text-sm text-blue-50">
                                <li className="flex items-center gap-2">
                                    <CheckCircleFilled className="text-white" />
                                    <span>Tiếp cận hàng ngàn thương hiệu tiềm năng</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircleFilled className="text-white" />
                                    <span>Quản lý profile và chiến dịch dễ dàng</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircleFilled className="text-white" />
                                    <span>Nhận thanh toán nhanh chóng và bảo mật</span>
                                </li>
                            </ul>
                        </div>
                        <div className="flex-shrink-0">
                            <Link
                                href="/influencer/register"
                                className="inline-block bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors shadow-lg"
                            >
                                Đăng ký ngay
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                    {influencers.map((influencer) => (
                        <Link
                            key={influencer.id}
                            href={`/influencer/${influencer.userName}`}
                            className="group"
                        >
                            <div className="bg-white rounded-lg overflow-hidden">
                                {/* Avatar */}
                                <div className="relative aspect-square bg-gradient-to-br from-blue-500 to-purple-600">
                                    {influencer.avatar ? (
                                        <img
                                            src={influencer.avatar}
                                            alt={influencer.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <UserOutlined className="text-6xl text-white" />
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 bg-white rounded-full w-6 h-6 flex items-center justify-center">
                                        <CheckCircleFilled className="text-blue-600 text-xl" />
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-4">
                                    {/* Name */}
                                    <h3 className="font-bold text-lg text-gray-900 mb-1 truncate group-hover:text-blue-600 transition-colors">
                                        {influencer.name}
                                    </h3>

                                    {/* Category */}
                                    <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded mb-2">
                                        {influencer.provinceName}
                                    </span>

                                    {/* Bio */}
                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                        {influencer.bio}
                                    </p>

                                    {/* Stats */}
                                    <div className="flex items-center justify-between mb-3 text-sm">
                                        <div className="flex items-center gap-1 text-gray-600">
                                            <UserOutlined />
                                            <span className="font-semibold">
                                                {formatFollowers(influencer.followers)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 text-yellow-500">
                                            <StarFilled />
                                            <span className="font-semibold text-gray-900">
                                                {influencer.rating.toFixed(1)}
                                            </span>
                                            <span className="text-gray-500">
                                                ({influencer.reviewCount})
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </PageContainer>
    );
};

export default Page;
