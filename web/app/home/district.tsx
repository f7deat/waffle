import { apiDistrictList } from "@/services/locations/district";
import Link from "next/link";

const DistrictSection: React.FC = async () => {

    const response = await apiDistrictList({ current: 1, pageSize: 9 });
    const districts = response.data;

    return (
        <section className="rounded-lg bg-white">
            <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Danh sách địa điểm</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Khám phá những địa điểm đẹp nhất</p>
            </div>

            <div className="grid gap-4 p-6 md:grid-cols-2 lg:grid-cols-3">
                {districts.map((district) => (
                    <Link
                        key={district.id}
                        href={`/district/${district.id || district.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className="group overflow-hidden rounded border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md dark:border-slate-700 dark:from-slate-800 dark:to-slate-900 dark:hover:border-blue-500"
                    >
                        <div className="flex items-start justify-between gap-2">
                            <div className="w-20 h-20">
                                <img
                                    src={district.thumbnail || "https://placehold.co/80x80?text=No+Image"}
                                    alt={district.name}
                                    className="h-full w-full rounded object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400">
                                    {district.name}
                                </h3>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    {"Khám phá những đặc sắc quận"}
                                </p>

                                <div className="mt-2 flex items-center gap-2 text-xs font-medium text-blue-600 dark:text-blue-400">
                                    <span>Tìm hiểu thêm</span>
                                    <span className="transition group-hover:translate-x-1">→</span>
                                </div>
                            </div>
                            <div className="text-2xl opacity-50 group-hover:opacity-100">📍</div>
                        </div>
                    </Link>
                ))}
            </div>

            {districts.length === 0 && (
                <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                    <div className="text-4xl mb-2">🗺️</div>
                    <p className="text-slate-500 dark:text-slate-400">Không tìm thấy địa điểm</p>
                </div>
            )}

            <div className="border-t border-slate-200 px-6 py-4 dark:border-slate-800">
                <Link
                    href="/place"
                    className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                    <span>Xem tất cả địa điểm</span>
                    <span>→</span>
                </Link>
            </div>
        </section>
    )
}

export default DistrictSection;