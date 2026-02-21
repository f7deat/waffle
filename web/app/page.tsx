import Link from "next/link";
import { DistrictSection } from "./home";
import { apiArticleList, apiArticleRandoms } from "@/services/article";
import { apiProducts } from "@/services/shop/product";
import { apiTagRandoms } from "@/services/contents/tag";
import { apiPlaceList } from "@/services/locations/place";
import { EyeFilled } from "@ant-design/icons";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "DefZone.Net - Kênh thông tin giải trí và địa điểm ăn chơi",
    description: "DefZone.Net - Kênh thông tin giải trí, đánh giá địa điểm ăn chơi, du lịch và mua sắm. Khám phá những trải nghiệm mới và xu hướng hot nhất hiện nay.",
  };
}

export default async function Home() {
  const articlesResponse = await apiArticleList({ current: 1, pageSize: 5 });
  const articles = articlesResponse.data || [];

  const productsResponse = await apiProducts({ current: 1, pageSize: 6 });
  const products = productsResponse.data || [];

  const tagsResponse = await apiTagRandoms();
  const tags = tagsResponse.data || [];

  const placesResponse = await apiPlaceList({ current: 1, pageSize: 6 });
  const locations = (placesResponse.data || []).slice(0, 5);

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
    <main className="dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
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
                      <p className="text-sm text-slate-500 dark:text-slate-400">Lượt xem: {item.viewCount?.toLocaleString()} <EyeFilled /></p>
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
