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
