'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import PageContainer from '@/components/layout/page-container';
import { apiStreetList } from '@/service/locations/street';
import Link from 'next/link';

const Page: React.FC = () => {
    const params = useParams();
    const districtId = Array.isArray(params.id) ? params.id[0] : params.id;
    const [streets, setStreets] = useState<API.StreetListItem[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [current, setCurrent] = useState(1);
    const [pageSize] = useState(10);
    const [districtName, setDistrictName] = useState('');

    useEffect(() => {
        const fetchStreets = async () => {
            try {
                setLoading(true);
                const response = await apiStreetList({
                    districtId: parseInt(districtId as string, 10),
                    current,
                    pageSize,
                });
                setStreets(response.data);
                setTotal(response.total);
                if (response.data.length > 0) {
                    setDistrictName(response.data[0].districtName);
                }
            } catch (error) {
                console.error('Failed to fetch streets:', error);
                setStreets([]);
                setTotal(0);
            } finally {
                setLoading(false);
            }
        };

        if (districtId) {
            fetchStreets();
        }
    }, [districtId, current, pageSize]);

    const totalPages = Math.ceil(total / pageSize);
    const breadcrumbs = [
        { label: 'District', href: '/district' },
        { label: districtName, href: `/district/${districtId}` },
    ];

    return (
        <PageContainer
            breadcrumbs={breadcrumbs}
        >
            <div className="p-4">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="text-gray-500">Loading...</div>
                    </div>
                ) : streets.length === 0 ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="text-gray-500">No streets found</div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {streets.map((street) => (
                                <div
                                    key={street.id}
                                    className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow bg-white"
                                >
                                    <div className="mb-2">
                                        <span className="text-xs text-gray-500">ID: {street.id}</span>
                                    </div>
                                    <Link href={`/district/street/${street.id}`}>
                                        <h3 className="text-lg font-semibold mb-3 text-gray-800">
                                            {street.name}
                                        </h3>
                                    </Link>
                                    <div className="space-y-2">
                                        <div className="flex items-center">
                                            <span className="text-xs text-gray-600 mr-2">District:</span>
                                            <span className="text-sm text-gray-800">{street.districtName}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="text-xs text-gray-600 mr-2">Province:</span>
                                            <span className="text-sm text-gray-800">{street.provinceId}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-center gap-2 mt-4">
                            <button
                                onClick={() => setCurrent(Math.max(1, current - 1))}
                                disabled={current === 1}
                                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                Previous
                            </button>

                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrent(page)}
                                        className={`px-3 py-1 border rounded text-sm ${current === page
                                                ? 'bg-blue-500 text-white border-blue-500'
                                                : 'border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setCurrent(Math.min(totalPages, current + 1))}
                                disabled={current === totalPages}
                                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                Next
                            </button>
                        </div>

                        <div className="text-center text-sm text-gray-600 mt-2">
                            Page {current} of {totalPages} (Total: {total} streets)
                        </div>
                    </>
                )}
            </div>
        </PageContainer>
    );
};

export default Page;