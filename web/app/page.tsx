import Link from "next/link";
import { DistrictSection } from "./home";
import { apiArticleList } from "@/service/article";
import { apiProducts } from "@/service/shop/product";
import { apiTagRandoms } from "@/service/contents/tag";

export default async function Home() {
  const articlesResponse = await apiArticleList({ current: 1, pageSize: 4 });
  const articles = articlesResponse.data || [];

  const productsResponse = await apiProducts({ current: 1, pageSize: 4 });
  const products = productsResponse.data || [];

  const tagsResponse = await apiTagRandoms();
  const tagsData = Array.isArray(tagsResponse.data) ? tagsResponse.data : [tagsResponse.data].filter(Boolean);
  const tags = tagsData.map(tag => tag.name);

  const locations = [
    { name: "Ha Noi", slug: "ha-noi", image: "https://images.unsplash.com/photo-1505761671935-60b3a7427bad" },
    { name: "Da Nang", slug: "da-nang", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee" },
    { name: "Sai Gon", slug: "sai-gon", image: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef" },
  ];

  const videos = [
    { title: "Travel vlog", duration: "8:12", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085" },
    { title: "Build a pc", duration: "12:33", image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d" },
    { title: "City timelapse", duration: "3:41", image: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e" },
  ];

  const albums = [
    { title: "Street life", count: 24, image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085" },
    { title: "Nature escapes", count: 18, image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470" },
    { title: "Night lights", count: 32, image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e" },
  ];

  const brands = [
    "Microsoft", "OpenAI", "Google", "Amazon", "Vercel", "Shopee", "Klook", "Wikipedia"
  ];

  const categories = ["Huong dan", "Phan tich", "Danh gia", "Tin tuc", "Thu thuat"];

  const randomArticles = articles.slice(0, 2);
  const randomLocations = locations.slice(0, 2);

  const cardStyle = (url: string) => ({
    backgroundImage: `url(${url})`,
  });

  return (
    <main className="bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto px-4 py-10">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-6 lg:sticky lg:top-20 self-start">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Tags</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">{tag}</span>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Bai viet ngau nhien</h3>
              <div className="mt-3 space-y-3">
                {randomArticles.map((item) => (
                  <Link key={item.id} href={`/article/${item.normalizedName}`} className="block rounded-lg border border-slate-200/60 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-800 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-blue-500/40 dark:hover:bg-slate-800/70 dark:hover:text-blue-300">
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Dia diem ngau nhien</h3>
              <div className="mt-3 space-y-3">
                {randomLocations.map((item) => (
                  <Link key={item.slug} href={`/location/city/${item.slug}`} className="flex items-center gap-3 rounded-lg border border-slate-200/60 bg-slate-50 px-3 py-2 hover:border-blue-200 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-500/40 dark:hover:bg-slate-800/70">
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
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Bài viết mới</h2>
                <Link href="/article" className="text-sm font-medium text-blue-600 hover:text-blue-500">Xem tất cả</Link>
              </div>
              <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
                {articles.map((item) => (
                  <Link key={item.id} href={`/article/${item.normalizedName}`} className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-900/5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-800/60">
                    <div className="h-48 bg-cover bg-center" style={cardStyle(item.thumbnail || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5')} />
                    <div className="p-4">
                      <p className="text-sm text-slate-500 dark:text-slate-400">Featured</p>
                      <h3 className="mt-1 text-lg line-clamp-2 font-semibold text-slate-900 group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400">{item.name}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
            <DistrictSection />
            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Dia diem noi bat</h2>
                <Link href="/location" className="text-sm font-medium text-blue-600 hover:text-blue-500">Explore</Link>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
                {locations.map((item) => (
                  <Link key={item.slug} href={`/district/${item.slug}`} className="group relative w-72 snap-start overflow-hidden rounded-xl border border-slate-200 bg-slate-900/5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-800/60">
                    <div className="h-44 bg-cover bg-center" style={cardStyle(item.image)} />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400">{item.name}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Guide, food, and spots</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">San pham goi y</h2>
                <Link href="/shop" className="text-sm font-medium text-blue-600 hover:text-blue-500">Shop now</Link>
              </div>
              <div className="grid gap-4 md:grid-cols-4">
                {products.map((item) => (
                  <Link key={item.id} href={`/shop/${item.normalizedName}`} className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
                    <div className="h-40 bg-cover bg-center" style={cardStyle(item.thumbnail)} />
                    <div className="flex items-center justify-between p-4">
                      <div>
                        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{item.name}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">In stock</p>
                      </div>
                      <span className="text-sm font-semibold text-blue-600">
                        {item.salePrice ? `$${item.salePrice}` : `$${item.price}`}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Video</h2>
                <Link href="/video" className="text-sm font-medium text-blue-600 hover:text-blue-500">Watch more</Link>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
                {videos.map((item, idx) => (
                  <div key={`${item.title}-${idx}`} className="group relative w-80 snap-start overflow-hidden rounded-xl border border-slate-200 bg-slate-900/5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-800/60">
                    <div className="h-44 bg-cover bg-center" style={cardStyle(item.image)} />
                    <div className="absolute bottom-3 right-3 rounded-md bg-black/70 px-2 py-1 text-xs font-semibold text-white">{item.duration}</div>
                    <div className="p-4">
                      <h3 className="text-base font-semibold text-slate-900 group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400">{item.title}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">HD, subtitles</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Album anh</h2>
                <Link href="/gallery" className="text-sm font-medium text-blue-600 hover:text-blue-500">View gallery</Link>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {albums.map((item, idx) => (
                  <div key={`${item.title}-${idx}`} className="group overflow-hidden rounded-xl border border-slate-200 bg-slate-900/5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-800/60">
                    <div className="h-44 bg-cover bg-center" style={cardStyle(item.image)} />
                    <div className="flex items-center justify-between p-4">
                      <div>
                        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{item.title}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{item.count} photos</p>
                      </div>
                      <span className="text-xs rounded-full bg-slate-100 px-3 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-200">New</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Thuong hieu lien ket</h2>
                <Link href="/partners" className="text-sm font-medium text-blue-600 hover:text-blue-500">All partners</Link>
              </div>
              <div className="flex items-center gap-4 overflow-x-auto pb-2">
                {brands.map((name, idx) => (
                  <div key={`${name}-${idx}`} className="flex h-16 min-w-[140px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-4 text-sm font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                    {name}
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
