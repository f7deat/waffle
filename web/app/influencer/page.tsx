"use client";

import PageContainer from "@/components/layout/page-container";
import { apiKolList } from "@/services/kol/kol";
import { CheckCircleFilled, SearchOutlined, StarFilled, UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useEffect, useState } from "react";

const CATEGORIES = [
    { value: "", label: "Tất cả" },
    { value: "food", label: "Ẩm thực" },
    { value: "travel", label: "Du lịch" },
    { value: "lifestyle", label: "Phong cách sống" },
    { value: "beauty", label: "Làm đẹp" },
    { value: "fashion", label: "Thời trang" },
];

const Page: React.FC = () => {
    const [influencers, setInfluencers] = useState<API.KolListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [filters, setFilters] = useState<API.KolFilterOptions>({
        current: 1,
        pageSize: 12,
        category: "",
        keyword: "",
    });
    const [searchInput, setSearchInput] = useState("");

    useEffect(() => {
        fetchInfluencers();
    }, [filters.current, filters.pageSize, filters.category]);

    const fetchInfluencers = async () => {
        setLoading(true);
        try {
            const response = await apiKolList(filters);
            setInfluencers(response.data);
            setTotal(response.total);
        } catch (error) {
            console.error("Failed to fetch influencers:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setFilters(prev => ({ ...prev, keyword: searchInput, current: 1 }));
        fetchInfluencers();
    };

    const handleCategoryChange = (category: string) => {
        setFilters(prev => ({ ...prev, category, current: 1 }));
    };

    const handlePageChange = (page: number) => {
        setFilters(prev => ({ ...prev, current: page }));
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

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

    const totalPages = Math.ceil(total / filters.pageSize);

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
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    {/* Search Bar */}
                    <div className="flex gap-2 mb-4">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="Tìm kiếm influencer..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                        <button
                            onClick={handleSearch}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Tìm kiếm
                        </button>
                    </div>

                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.value}
                                onClick={() => handleCategoryChange(cat.value)}
                                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                                    filters.category === cat.value
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-4 text-gray-600">
                    Tìm thấy <span className="font-semibold text-gray-900">{total}</span> influencer
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <>
                        {/* Influencer Grid */}
                        {influencers.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                                {influencers.map((influencer) => (
                                    <Link
                                        key={influencer.id}
                                        href={`/influencer/${influencer.normalizedName}`}
                                        className="group"
                                    >
                                        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
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
                                                {/* Verified Badge */}
                                                {influencer.verified && (
                                                    <div className="absolute top-2 right-2 bg-white rounded-full p-1">
                                                        <CheckCircleFilled className="text-blue-600 text-xl" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="p-4">
                                                {/* Name */}
                                                <h3 className="font-bold text-lg text-gray-900 mb-1 truncate group-hover:text-blue-600 transition-colors">
                                                    {influencer.name}
                                                </h3>

                                                {/* Category */}
                                                <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded mb-2">
                                                    {influencer.category}
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

                                                {/* Price */}
                                                <div className="pt-3 border-t border-gray-200">
                                                    <div className="text-xs text-gray-500 mb-1">
                                                        Giá từ
                                                    </div>
                                                    <div className="text-lg font-bold text-blue-600">
                                                        {formatPrice(influencer.pricePerReview)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                                <div className="text-gray-400 mb-4">
                                    <UserOutlined className="text-6xl" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    Không tìm thấy influencer
                                </h3>
                                <p className="text-gray-600">
                                    Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                                </p>
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2">
                                <button
                                    onClick={() => handlePageChange(filters.current - 1)}
                                    disabled={filters.current === 1}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Trước
                                </button>
                                
                                <div className="flex gap-2">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (filters.current <= 3) {
                                            pageNum = i + 1;
                                        } else if (filters.current >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i;
                                        } else {
                                            pageNum = filters.current - 2 + i;
                                        }
                                        
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => handlePageChange(pageNum)}
                                                className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                                                    filters.current === pageNum
                                                        ? "bg-blue-600 text-white"
                                                        : "border border-gray-300 hover:bg-gray-50"
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={() => handlePageChange(filters.current + 1)}
                                    disabled={filters.current === totalPages}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Sau
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </PageContainer>
    );
};

export default Page;
