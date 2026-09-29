/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

type DistrictsByProvinceProps = {
  provinceName: string;
  districts: API.DistrictListItem[];
};

export default function DistrictsByProvince({ provinceName, districts }: DistrictsByProvinceProps) {
  return (
    <section aria-labelledby="province-districts-heading" className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-emerald-700">KHU VỰC</p>
          <h2 id="province-districts-heading" className="mt-1 text-xl font-semibold text-slate-900">
            Quận huyện tại {provinceName}
          </h2>
        </div>
        <span className="shrink-0 text-sm text-slate-500">
          {districts.length.toLocaleString("vi-VN")} khu vực
        </span>
      </div>

      {districts.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-300 bg-white px-4 py-6 text-center text-sm text-slate-500">
          Chưa có quận huyện nào được cập nhật.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {districts.map((district) => (
            <Link
              key={district.id}
              href={`/district/${district.id}`}
              className="group flex min-h-24 items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 transition hover:border-emerald-300 hover:shadow-sm"
            >
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-emerald-50">
                {district.thumbnail ? (
                  <img
                    src={district.thumbnail}
                    alt={district.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-2xl text-emerald-700" aria-hidden="true">
                    ◉
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <h3 className="truncate font-semibold text-slate-900 group-hover:text-emerald-800">
                  {district.name}
                </h3>
                <span className="mt-1 inline-flex text-sm text-emerald-700">
                  Xem địa điểm <span className="ml-1 transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}