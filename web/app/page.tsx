export const dynamic = 'force-dynamic';

import Link from "next/link";
import { DistrictSection } from "./home";
import { apiArticleList, apiArticleRandoms } from "@/services/article";
import { apiProducts } from "@/services/shop/product";
import { apiTagRandoms } from "@/services/contents/tag";
import { apiPlaceList } from "@/services/locations/place";
import { apiKolList } from "@/services/kol/kol";
import { apiGetSiteSetting } from "@/services/setting";
import { Metadata } from "next";
import WebsitePageRenderer from "@/components/website-builder/page-renderer";
import { apiGetPublishedHomePage } from "@/services/website-page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCompass, faEye, faLayerGroup, faLocationDot, faSearch } from "@fortawesome/free-solid-svg-icons";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await apiGetSiteSetting();
    return {
      title: settings?.title || "DefZone.Net",
      description: settings?.description || "DefZone.Net - Kênh thông tin giải trí và địa điểm ăn chơi",
    };
  } catch (error) {
    // Fallback to defaults if API call fails
    return {
      title: "DefZone.Net",
      description: "DefZone.Net - Kênh thông tin giải trí và địa điểm ăn chơi",
    };
  }
}

export default async function Home() {
  const builderPage = await apiGetPublishedHomePage().catch(() => null);

  const articlesResponse = await apiArticleList({ current: 1, pageSize: 5 });
  const articles = articlesResponse.data || [];

  const productsResponse = await apiProducts({ current: 1, pageSize: 6 });
  const products = productsResponse.data || [];

  const tagsResponse = await apiTagRandoms();
  const tags = tagsResponse.data || [];

  const placesResponse = await apiPlaceList({ current: 1, pageSize: 6 });
  const locations = (placesResponse.data || []).slice(0, 5);

  const influencersResponse = await apiKolList({ current: 1, pageSize: 12 });
  const randomInfluencers = [...(influencersResponse.data || [])]
    .sort(() => Math.random() - 0.5)
    .slice(0, 6);

  const categories = ["Huong dan", "Phan tich", "Danh gia", "Tin tuc", "Thu thuat"];

  const randomsRes = await apiArticleRandoms();
  const randomArticles = randomsRes.data || [];
  const randomLocations = locations.slice(0, 2).map(place => ({
    id: place.id,
    name: place.districtName,
    image: place.thumbnail,
    districtId: place.districtId,
  }));

  const cardStyle = (url: string) => ({
    backgroundImage: `url(${url})`,
  });

  return (
    <main className="bg-slate-100">
      <section className="relative w-full pt-36 pb-20 md:pb-28 overflow-hidden bg-surface-container-low">
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center object-cover"
            data-alt="Cinematic wide-angle view of coastal Hai Phong and Lan Ha Bay at golden hour sunset, showing tranquil emerald waters, karst limestone peaks, and stylish terrace cafes glowing warmly with string lights and happy people dining outdoors, editorial travel magazine photography style with warm coral, golden amber, and deep emerald green palette."
            style={{
              backgroundImage:
                'url("https://datviettour.com.vn/uploads/images/tin-tuc-SEO/mien-bac/ha-long/danh-thang/Tren-dao-Reu.jpg")'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-on-surface/40 to-on-surface/65" />
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary-container/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[32rem] h-[32rem] bg-secondary/20 rounded-full blur-3xl pointer-events-none" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-gutter flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md shadow-md mb-6">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">
              Nền tảng Khám phá Du lịch &amp; Ẩm thực Bản địa
            </span>
          </div>
          <h1 className="font-bold 2xl:text-5xl text-display max-w-4xl text-surface tracking-tight mb-4 drop-shadow-sm">
            Đi đâu hôm nay,{" "}
            <span className="text-primary-container underline decoration-primary-container/40 underline-offset-8">
              trải nghiệm chất
            </span>{" "}
            hôm nay!
          </h1>
          <p className="font-body-lg text-body-lg text-surface-container-high max-w-2xl mb-10 leading-relaxed font-normal">
            Khám phá quán ngon, góc check-in đẹp và những hành trình đáng nhớ tại Hải
            Phòng &amp; khắp mọi miền Việt Nam.
          </p>
          {/* Floating Search Glassmorphism Card */}
          <div className="w-full max-w-5xl bg-surface-container-lowest/95 backdrop-blur-xl p-4 sm:p-5 rounded-2xl shadow-xl flex flex-col lg:flex-row items-stretch gap-3">
            {/* City dropdown */}
            <div className="relative flex-1 bg-surface-container-low rounded-xl px-4 py-3 flex flex-col text-left justify-center cursor-pointer group hover:bg-surface-container transition-colors">
              <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-primary">
                  <FontAwesomeIcon icon={faLocationDot} />
                </span>{" "}
                Điểm đến
              </span>
              <div className="flex items-center justify-between mt-0.5">
                <span className="font-title text-body-lg font-semibold text-on-surface">
                  Hải Phòng
                </span>
                <span className="material-symbols-outlined text-[18px] text-outline group-hover:text-primary transition-transform group-hover:translate-y-0.5">
                    
                </span>
              </div>
              <span className="font-body-sm text-body-sm text-outline truncate">
                Hồng Bàng, Ngô Quyền, Đồ Sơn, Cát Bà
              </span>
            </div>
            {/* Category dropdown */}
            <div className="relative flex-1 bg-surface-container-low rounded-xl px-4 py-3 flex flex-col text-left justify-center cursor-pointer group hover:bg-surface-container transition-colors">
              <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-secondary">
                  <FontAwesomeIcon icon={faLayerGroup} />
                </span>{" "}
                Trải nghiệm
              </span>
              <div className="flex items-center justify-between mt-0.5">
                <span className="font-title text-body-lg font-semibold text-on-surface truncate">
                  🍽️ Ăn uống &amp; Ẩm thực
                </span>
                <span className="material-symbols-outlined text-[18px] text-outline group-hover:text-primary transition-transform group-hover:translate-y-0.5">
                  <FontAwesomeIcon icon={faCaretDown} />
                </span>
              </div>
              <span className="font-body-sm text-body-sm text-outline truncate">
                Cà phê, Check-in, Khách sạn
              </span>
            </div>
            {/* Keyword search input */}
            <div className="relative flex-[1.4] bg-surface-container-low rounded-xl px-4 py-3 flex flex-col text-left justify-center">
              <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-tertiary">
                  <FontAwesomeIcon icon={faSearch} />
                </span>{" "}
                Bạn tìm gì?
              </span>
              <input
                className="w-full bg-transparent font-title text-body-lg text-on-surface placeholder:text-outline/70 focus:outline-none mt-0.5"
                placeholder="Nhập món ăn, tên quán hoặc địa danh..."
                type="text"
              />
            </div>
            {/* CTA Button */}
            <button className="bg-primary hover:bg-primary-container text-on-primary px-8 py-4 rounded-xl flex items-center justify-center gap-2 font-label-lg text-label-lg shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 flex-shrink-0 cursor-pointer">
              <span className="material-symbols-outlined text-[20px]">
                <FontAwesomeIcon icon={faCompass} />
              </span>
              <span>Khám phá ngay</span>
            </button>
          </div>
          {/* Quick Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6 max-w-4xl">
            <span className="font-label-sm text-label-sm text-surface-container-highest uppercase tracking-wider mr-1">
              Tìm nhanh:
            </span>
            <button className="px-3.5 py-1.5 rounded-full bg-surface-container-lowest/80 hover:bg-surface-container-lowest text-on-surface font-label-sm text-label-sm shadow-sm backdrop-blur-sm transition-all hover:scale-105 cursor-pointer">
              🍜 Bánh đa cua Hải Phòng
            </button>
            <button className="px-3.5 py-1.5 rounded-full bg-surface-container-lowest/80 hover:bg-surface-container-lowest text-on-surface font-label-sm text-label-sm shadow-sm backdrop-blur-sm transition-all hover:scale-105 cursor-pointer">
              ☕ Cafe view sông Tam Bạc
            </button>
            <button className="px-3.5 py-1.5 rounded-full bg-surface-container-lowest/80 hover:bg-surface-container-lowest text-on-surface font-label-sm text-label-sm shadow-sm backdrop-blur-sm transition-all hover:scale-105 cursor-pointer">
              📸 Ga Hải Phòng check-in
            </button>
            <button className="px-3.5 py-1.5 rounded-full bg-surface-container-lowest/80 hover:bg-surface-container-lowest text-on-surface font-label-sm text-label-sm shadow-sm backdrop-blur-sm transition-all hover:scale-105 cursor-pointer">
              🏖️ Sunset Cát Bà
            </button>
            <button className="px-3.5 py-1.5 rounded-full bg-surface-container-lowest/80 hover:bg-surface-container-lowest text-on-surface font-label-sm text-label-sm shadow-sm backdrop-blur-sm transition-all hover:scale-105 cursor-pointer">
              🍹 Cà phê cốt dừa
            </button>
            <button className="px-3.5 py-1.5 rounded-full bg-surface-container-lowest/80 hover:bg-surface-container-lowest text-on-surface font-label-sm text-label-sm shadow-sm backdrop-blur-sm transition-all hover:scale-105 cursor-pointer">
              🥖 Bánh mì que chính gốc
            </button>
          </div>
        </div>
      </section>

      <div className="mx-auto px-4 py-10">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-6 lg:sticky lg:top-20 self-start">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                <Link href="/tag">Thẻ tag nổi bật</Link>
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {tags.map((tag, idx) => (
                  <Link key={idx} href={`/tag/${tag.normalizedName}`}>
                    <span className="rounded-full hover:bg-slate-900 hover:text-white bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 transition duration-500">{tag.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Bài viết ngẫu nhiên</h3>
              <div className="mt-3 space-y-3">
                {randomArticles.map((item) => (
                  <Link key={item.id} href={`/article/${item.normalizedName}`} className="block rounded-lg border border-slate-200/60 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-800 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-blue-500/40 dark:hover:bg-slate-800/70 dark:hover:text-blue-300">
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Địa điểm ngẫu nhiên</h3>
              <div className="mt-3 space-y-3">
                {randomLocations.map((item) => (
                  <Link key={item.id} href={`/district/${item.districtId}`} className="flex items-center gap-3 rounded-lg border border-slate-200/60 bg-slate-50 px-3 py-2 hover:border-blue-200 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-500/40 dark:hover:bg-slate-800/70">
                    <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-cover bg-center" style={cardStyle(item.image)} />
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">An choi, du lich</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Danh muc</h3>
              <div className="mt-3 space-y-2">
                {categories.map((cat) => (
                  <Link key={cat} href={`/article?category=${encodeURIComponent(cat)}`} className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800">
                    <span>{cat}</span>
                    <span className="text-xs text-slate-500">›</span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          <div className="flex flex-col gap-10">

            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Địa điểm nổi bật</h2>
                <Link href="/place" className="text-sm font-medium text-blue-600 hover:text-blue-500">Khám phá</Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {locations.map((item) => (
                  <Link key={item.id} href={`/place/${item.normalizedName}`} className="group relative snap-start overflow-hidden rounded-lg bg-white transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-800/60">
                    <div className="h-44 bg-cover bg-center" style={cardStyle(item.thumbnail)} />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400">{item.name}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Lượt xem: {item.viewCount?.toLocaleString()} <FontAwesomeIcon icon={faEye} /></p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
            <DistrictSection />
            <section>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Sản phẩm gợi ý</h2>
                <Link href="/shop" className="text-sm font-medium text-blue-600 hover:text-blue-500">Shop now</Link>
              </div>
              <div className="grid gap-2 md:gap-4 grid-cols-2 md:grid-cols-4 2xl:grid-cols-6">
                {products.map((item) => (
                  <Link key={item.id} href={`/shop/${item.normalizedName}`} className="group overflow-hidden rounded-lg bg-white transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
                    <div className="h-40 bg-cover bg-center" style={cardStyle(item.thumbnail)} />
                    <div className="flex flex-col p-2 md:p-4">
                      <h3 className="text-sm flex-1 md:text-base font-semibold text-slate-900 dark:text-slate-100">{item.name}</h3>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-500 dark:text-slate-400">In stock</p>
                        <span className="text-sm font-semibold text-blue-600">
                          {
                            item.salePrice || item.price ? (
                              item.salePrice ? `${item.salePrice?.toLocaleString()}₫` : `${item.price?.toLocaleString()}₫`
                            ) : (
                              "Liên hệ"
                            )
                          }
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Influencer ngẫu nhiên</h2>
                <Link href="/influencer" className="text-sm font-medium text-blue-600 hover:text-blue-500">Xem tất cả</Link>
              </div>
              <div className="grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
                {randomInfluencers.map((item) => (
                  <Link key={item.id} href={`/influencer/${item.userName}`} className="group overflow-hidden rounded-lg bg-white transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
                    <div className="h-36 bg-slate-100 dark:bg-slate-800">
                      {item.avatar ? (
                        <div className="h-full w-full bg-cover bg-center" style={cardStyle(item.avatar)} />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-3xl text-slate-400">👤</div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-semibold line-clamp-1 text-slate-900 group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400">{item.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{item.provinceName}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Bài viết mới</h2>
                <Link href="/article" className="text-sm font-medium text-blue-600 hover:text-blue-500">Xem tất cả</Link>
              </div>
              <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {articles.map((item) => (
                  <div key={item.id} className="group relative overflow-hidden rounded-lg bg-white transition hover:-translate-y-1 hover:shadow-lg">
                    <div className="h-48 bg-cover bg-center" style={cardStyle(item.thumbnail || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5')} />
                    <div className="p-4">
                      <p className="text-sm text-slate-500 dark:text-slate-400">Featured</p>
                      <Link key={item.id} href={`/article/${item.normalizedName}`}>
                        <h3 className="mt-1 text-lg line-clamp-2 font-semibold text-slate-900 group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400">{item.name}</h3>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </div>

      </div>
    </main>
  );
}
