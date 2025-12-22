/* eslint-disable @next/next/no-img-element */
import PageContainer from "@/components/layout/page-container";
import { apiPlaceList } from "@/service/locations/place";

type Props = {
    params: { id: string };
};

const Page: React.FC<Props> = async ({ params }) => {
    const streetId = Number(params.id);
    const response = await apiPlaceList({ current: 1, pageSize: 50, streetId });
    const places = response.data.data;

    const streetName = places[0]?.streetName || "Tuyen duong";
    const districtName = places[0]?.districtName;
    const provinceName = places[0]?.provinceName;
    const totalPlaces = response.data.total;

    return (
        <PageContainer
            title={streetName}
            breadcrumbs={[
                { label: "Quan / Huyen", href: "/district" },
                { label: streetName, href: `/district/street/${params.id}` }
            ]}
        >
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(79,70,229,0.08),transparent_25%),radial-gradient(circle_at_80%_0%,rgba(99,102,241,0.08),transparent_25%)]" />
                <div className="relative space-y-6 p-6 md:p-8">
                    <header className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur md:flex-row md:items-center md:justify-between">
                        <div>
                            <div className="text-xs uppercase tracking-[0.08em] text-slate-500">Danh sach dia diem</div>
                            <h1 className="text-2xl font-semibold text-slate-900">{streetName}</h1>
                            <p className="mt-1 text-sm text-slate-600">
                                {districtName && provinceName ? `${districtName}, ${provinceName}` : "Tong hop cac dia diem noi bat tren tuyen duong nay."}
                            </p>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                            <span className="rounded-full bg-indigo-50 px-3 py-1 font-semibold text-indigo-700">{totalPlaces} dia diem</span>
                        </div>
                    </header>

                    {places.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white/80 p-10 text-center text-slate-500 shadow-sm">
                            <div className="text-4xl mb-3">🧭</div>
                            <p className="font-semibold text-slate-700">Chua co dia diem nao duoc ghi nhan.</p>
                            <p className="mt-1 text-sm text-slate-500">Hay quay lai sau khi co them noi den moi.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {places.map((place) => {
                                const updatedAt = place.modifiedDate
                                    ? new Date(place.modifiedDate).toLocaleDateString("vi-VN")
                                    : "Chua cap nhat";

                                return (
                                    <div
                                        key={place.id}
                                        className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white/85 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
                                    >
                                        <div className="flex flex-1 gap-4 p-4">
                                            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-indigo-100 via-white to-slate-100">
                                                {place.thumbnail ? (
                                                    <img
                                                        src={place.thumbnail}
                                                        alt={place.name}
                                                        className="h-full w-full object-cover"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-3xl">📍</div>
                                                )}
                                            </div>
                                            <div className="flex flex-1 flex-col gap-2">
                                                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-indigo-600">
                                                    <span>{place.streetName}</span>
                                                    <span className="text-slate-400">•</span>
                                                    <span className="text-slate-500">{place.districtName}</span>
                                                </div>
                                                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-indigo-700">{place.name}</h3>
                                                <div className="mt-auto flex items-center gap-3 text-xs text-slate-500">
                                                    <span className="flex items-center gap-1">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-amber-500">
                                                            <path d="M10 1.5a.75.75 0 01.67.415l1.882 3.815 4.21.612a.75.75 0 01.415 1.279l-3.046 2.968.719 4.192a.75.75 0 01-1.088.791L10 14.347l-3.762 1.975a.75.75 0 01-1.088-.79l.72-4.193L2.824 7.62a.75.75 0 01.415-1.278l4.21-.612L9.33 1.915A.75.75 0 0110 1.5z" />
                                                        </svg>
                                                        {place.viewCount} luot xem
                                                    </span>
                                                    <span className="flex items-center gap-1 text-slate-400">•</span>
                                                    <span>Cap nhat {updatedAt}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/70 px-4 py-3 text-sm text-indigo-700">
                                            <span className="flex items-center gap-2 font-semibold">
                                                <span className="inline-flex h-2 w-2 rounded-full bg-indigo-500" />
                                                Noi den tren tuyen {streetName}
                                            </span>
                                            <span className="flex items-center gap-1 text-indigo-600">
                                                <span>Chi tiet dang cap nhat</span>
                                                <span aria-hidden>→</span>
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </PageContainer>
    );
};

export default Page;