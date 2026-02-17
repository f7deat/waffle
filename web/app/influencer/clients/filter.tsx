"use client";

import { SearchOutlined } from "@ant-design/icons";
import { useState } from "react";

const InfluencerFilter: React.FC = () => {

    const CATEGORIES = [
        { value: "", label: "Tất cả" },
        { value: "food", label: "Ẩm thực" },
        { value: "travel", label: "Du lịch" },
        { value: "lifestyle", label: "Phong cách sống" },
        { value: "beauty", label: "Làm đẹp" },
        { value: "fashion", label: "Thời trang" },
    ];

    const [searchInput, setSearchInput] = useState("");
    const [filters, setFilters] = useState<API.KolFilterOptions>({
        current: 1,
        pageSize: 12,
        category: "",
        keyword: "",
    });

    const handleSearch = () => {
        setFilters(prev => ({ ...prev, keyword: searchInput, current: 1 }));
    };

    const handleCategoryChange = (category: string) => {
        setFilters(prev => ({ ...prev, category, current: 1 }));
    };

    return (
        <div className="bg-white rounded-lg p-6 mb-6">
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
                        className={`px-4 py-2 rounded-full font-medium transition-colors ${filters.category === cat.value
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default InfluencerFilter;