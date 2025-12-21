'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import PageContainer from '@/components/layout/page-container';
import { apiStreetList } from '@/service/locations/street';

interface StreetData {
    data: API.StreetListItem[];
    total: number;
}

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
                const res = response.data;
                setStreets(res.data);
                setTotal(res.total);
                if (res.data.length > 0) {
                    setDistrictName(res.data[0].districtName);
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
            title="Streets" 
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
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-100 border-b">
                                    <th className="border px-4 py-2 text-left text-sm font-semibold">ID</th>
                                    <th className="border px-4 py-2 text-left text-sm font-semibold">Name</th>
                                    <th className="border px-4 py-2 text-left text-sm font-semibold">District</th>
                                    <th className="border px-4 py-2 text-left text-sm font-semibold">Province</th>
                                </tr>
                            </thead>
                            <tbody>
                                {streets.map((street) => (
                                    <tr key={street.id} className="border-b hover:bg-gray-50">
                                        <td className="border px-4 py-2 text-sm">{street.id}</td>
                                        <td className="border px-4 py-2 text-sm">{street.name}</td>
                                        <td className="border px-4 py-2 text-sm">{street.districtName}</td>
                                        <td className="border px-4 py-2 text-sm">{street.provinceId}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

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
                                        className={`px-3 py-1 border rounded text-sm ${
                                            current === page
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