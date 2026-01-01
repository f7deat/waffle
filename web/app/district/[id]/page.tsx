'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import PageContainer from '@/components/layout/page-container';
import { apiPlaceList } from '@/service/locations/place';
import { EnvironmentOutlined, EyeOutlined } from '@ant-design/icons';

const Page: React.FC = () => {
    const params = useParams();
    const districtId = Array.isArray(params.id) ? params.id[0] : params.id;
    const [places, setPlaces] = useState<API.PlaceListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [current, setCurrent] = useState(1);
    const [keyword, setKeyword] = useState('');
    const [sortBy, setSortBy] = useState<'name' | 'views' | 'recent'>('recent');
    const pageSize = 12;

    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                setLoading(true);
                const data = await apiPlaceList({
                    districtId: parseInt(districtId as string),
                    keyword: keyword || undefined,
                    current,
                    pageSize,
                });
                let sortedPlaces = data.data || [];
                
                // Sort based on selection
                if (sortBy === 'name') {
                    sortedPlaces = [...sortedPlaces].sort((a, b) => a.name.localeCompare(b.name));
                } else if (sortBy === 'views') {
                    sortedPlaces = [...sortedPlaces].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
                } else if (sortBy === 'recent') {
                    sortedPlaces = [...sortedPlaces].sort((a, b) => 
                        new Date(b.modifiedDate).getTime() - new Date(a.modifiedDate).getTime()
                    );
                }
                
                setPlaces(sortedPlaces);
                setTotal(data.total || 0);
            } catch (error) {
                console.error('Failed to fetch places:', error);
                setPlaces([]);
                setTotal(0);
            } finally {
                setLoading(false);
            }
        };

        if (districtId) {
            fetchPlaces();
        }
    }, [districtId, current, keyword, sortBy]);

    const breadcrumbs = [
        { label: 'District', href: '/district' },
        { label: 'Places', href: '#' },
    ];

    return (
        <PageContainer breadcrumbs={breadcrumbs}>
            <div className="space-y-8">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Places</h1>
                    <p className="text-gray-600">
                        {total > 0 ? `Showing ${places.length} of ${total} places` : 'No places found'}
                    </p>
                </div>

                {/* Filter Bar */}
                <div className="bg-white border rounded-lg p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Search */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Search by name</label>
                            <input
                                type="text"
                                placeholder="Search places..."
                                value={keyword}
                                onChange={(e) => {
                                    setKeyword(e.target.value);
                                    setCurrent(1);
                                }}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        
                        {/* Sort */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
                            <select
                                value={sortBy}
                                onChange={(e) => {
                                    setSortBy(e.target.value as 'name' | 'views' | 'recent');
                                    setCurrent(1);
                                }}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="recent">Recently Updated</option>
                                <option value="views">Most Viewed</option>
                                <option value="name">Name (A-Z)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        <p className="mt-4 text-gray-600">Loading places...</p>
                    </div>
                ) : places.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {places.map((place) => (
                                <Link key={place.id} href={`/place/${place.id}`}>
                                    <div className="group cursor-pointer overflow-hidden rounded-lg border border-gray-200 transition-all duration-300 hover:shadow-lg hover:border-blue-400">
                                        <div className="relative overflow-hidden bg-gray-200 h-48">
                                            {place.thumbnail ? (
                                                <img
                                                    src={place.thumbnail}
                                                    alt={place.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-4xl">📍</div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                                                {place.name}
                                            </h3>
                                            <div className="space-y-2 text-sm text-slate-500">
                                                <div className="flex items-center justify-between gap-1 line-clamp-1">
                                                    <div>
                                                        <EnvironmentOutlined className="flex-shrink-0" />
                                                        <span>{place.provinceName}</span>
                                                    </div>
                                                    <div>
                                                        <EyeOutlined className="mr-1" />
                                                        <span>{place.viewCount?.toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {total > pageSize && (
                            <div className="flex items-center justify-center gap-4 pt-8">
                                <button
                                    onClick={() => setCurrent(Math.max(1, current - 1))}
                                    disabled={current === 1}
                                    className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <span className="text-sm text-gray-600">
                                    Page {current} of {Math.ceil(total / pageSize)}
                                </span>
                                <button
                                    onClick={() => setCurrent(Math.min(Math.ceil(total / pageSize), current + 1))}
                                    disabled={current >= Math.ceil(total / pageSize)}
                                    className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-600">No places found in this district.</p>
                    </div>
                )}
            </div>
        </PageContainer>
    );
};

export default Page;