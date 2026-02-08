"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

interface PlacesByProvinceClientProps {
  provinceId: number;
  provinceName: string;
  places: API.PlaceListItem[];
  total: number;
  current: number;
  pageSize: number;
  keyword?: string;
  defaultPageSize: number;
}

export default function PlacesByProvinceClient({
  provinceId,
  provinceName,
  places,
  total,
  current,
  pageSize,
  keyword,
  defaultPageSize,
}: PlacesByProvinceClientProps) {
  const buildPageHref = (page: number) => {
    const params = new URLSearchParams();
    if (keyword) params.set("keyword", keyword);
    if (pageSize !== defaultPageSize) params.set("pageSize", String(pageSize));
    params.set("page", String(page));
    return `/place/province/${provinceId}?${params.toString()}`;
  };
  const headerRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        // Animate header
        if (headerRef.current) {
          gsap.fromTo(headerRef.current, 
            { y: -30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }
          );
        }

        // Animate statistics cards
        const statCards = document.querySelectorAll(".stat-card");
        if (statCards.length > 0) {
          gsap.fromTo(statCards,
            { scale: 0.9, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.15, ease: "back.out(1.7)" }
          );
        }

        // Animate filter section
        if (filterRef.current) {
          gsap.fromTo(filterRef.current,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, delay: 0.35, ease: "power3.out" }
          );
        }

        // Animate place cards
        const placeCards = document.querySelectorAll(".place-card");
        if (placeCards.length > 0) {
          gsap.fromTo(placeCards,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, delay: 0.45, ease: "power3.out" }
          );
        }

        // Animate pagination
        if (paginationRef.current) {
          gsap.fromTo(paginationRef.current,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, delay: 0.6, ease: "power3.out" }
          );
        }
      });

      return () => ctx.revert();
    }, 100);

    return () => clearTimeout(timer);
  }, [current, keyword, mounted]);

  return (
    <>
      {/* Header Section */}
      <div ref={headerRef} className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-2">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
            </svg>
            {provinceName}
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">Địa điểm tại {provinceName}</h1>
          <p className="text-sm text-slate-600">Khám phá {total.toLocaleString()} địa điểm thú vị tại {provinceName}</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="stat-card flex items-center gap-4 rounded-xl border border-slate-200 bg-gradient-to-br from-blue-50 to-white p-4 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6 text-blue-600">
              <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{total.toLocaleString()}</p>
            <p className="text-sm text-slate-600">Tổng địa điểm</p>
          </div>
        </div>

        <div className="stat-card flex items-center gap-4 rounded-xl border border-slate-200 bg-gradient-to-br from-emerald-50 to-white p-4 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6 text-emerald-600">
              <path d="M10 1.5a.75.75 0 01.67.415l1.882 3.815 4.21.612a.75.75 0 01.415 1.279l-3.046 2.968.719 4.192a.75.75 0 01-1.088.791L10 14.347l-3.762 1.975a.75.75 0 01-1.088-.79l.72-4.193L2.824 7.62a.75.75 0 01.415-1.278l4.21-.612L9.33 1.915A.75.75 0 0110 1.5z" />
            </svg>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">
              {places.reduce((acc, p) => acc + (p.viewCount || 0), 0).toLocaleString()}
            </p>
            <p className="text-sm text-slate-600">Tổng lượt xem</p>
          </div>
        </div>

        <div className="stat-card flex items-center gap-4 rounded-xl border border-slate-200 bg-gradient-to-br from-amber-50 to-white p-4 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6 text-amber-600">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{places.length.toLocaleString()}</p>
            <p className="text-sm text-slate-600">Trang hiện tại</p>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div ref={filterRef} className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="font-semibold text-slate-900">Tìm thấy {total.toLocaleString()} địa điểm</span>
            {keyword && (
              <>
                <span>•</span>
                <span>Từ khóa: <span className="font-semibold text-slate-800">"{keyword}"</span></span>
              </>
            )}
          </div>
          <form className="flex w-full gap-2 md:w-auto" method="get">
            <input
              type="text"
              name="keyword"
              defaultValue={keyword}
              placeholder="Tìm theo tên địa điểm..."
              className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 md:w-72"
            />
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              <SearchOutlined /> Tìm
            </button>
          </form>
        </div>
      </div>

      {/* Places Grid */}
      {places.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 shadow-sm">
          <div className="text-4xl mb-3">🧭</div>
          <p className="font-semibold text-slate-700">Chưa có địa điểm nào phù hợp.</p>
          <p className="mt-1 text-sm text-slate-500">Thử tìm với từ khóa khác hoặc quay lại sau.</p>
        </div>
      ) : (
        <>
          <div ref={gridRef} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {places.map((place) => {
              const updatedAt = place.modifiedDate
                ? dayjs(place.modifiedDate).format("DD-MM-YYYY HH:mm")
                : "Chưa cập nhật";

              return (
                <div
                  key={place.id}
                  className="place-card group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white/85 backdrop-blur transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
                >
                  <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-indigo-100 via-white to-slate-100">
                    {place.thumbnail ? (
                      <img
                        src={place.thumbnail}
                        alt={place.name}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-4xl">📍</div>
                    )}
                    <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-indigo-700 shadow">
                      {place.districtName}
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-4">
                    <Link href={`/place/${place.normalizedName}`} className="hover:underline">
                      <h2 className="text-lg font-semibold text-slate-900 line-clamp-2">{place.name}</h2>
                    </Link>
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {place.address}, {place.districtName}, {place.provinceName}
                    </p>
                    <div className="mt-auto flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-amber-500">
                          <path d="M10 1.5a.75.75 0 01.67.415l1.882 3.815 4.21.612a.75.75 0 01.415 1.279l-3.046 2.968.719 4.192a.75.75 0 01-1.088.791L10 14.347l-3.762 1.975a.75.75 0 01-1.088-.79l.72-4.193L2.824 7.62a.75.75 0 01.415-1.278l4.21-.612L9.33 1.915A.75.75 0 0110 1.5z" />
                        </svg>
                        {(place.viewCount || 0).toLocaleString()} lượt xem
                      </span>
                      <span className="text-slate-400">•</span>
                      <span>Cập nhật {updatedAt}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div ref={paginationRef} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
              <span>Trang {current} / {totalPages}</span>
              <div className="flex items-center gap-2">
                <Link
                  href={buildPageHref(Math.max(1, current - 1))}
                  aria-disabled={current === 1}
                  className={`rounded-lg px-3 py-2 font-semibold transition ${current === 1 ? "cursor-not-allowed bg-slate-100 text-slate-400" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}
                >
                  Trước
                </Link>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (current <= 3) {
                      pageNum = i + 1;
                    } else if (current >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = current - 2 + i;
                    }

                    return (
                      <Link
                        key={pageNum}
                        href={buildPageHref(pageNum)}
                        className={`rounded-lg px-3 py-2 font-semibold transition ${
                          current === pageNum
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {pageNum}
                      </Link>
                    );
                  })}
                </div>
                <Link
                  href={buildPageHref(Math.min(totalPages, current + 1))}
                  aria-disabled={current === totalPages}
                  className={`rounded-lg px-3 py-2 font-semibold transition ${current === totalPages ? "cursor-not-allowed bg-slate-100 text-slate-400" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}
                >
                  Sau
                </Link>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
