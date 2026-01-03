import PageContainer from "@/components/layout/page-container";
import { apiWikiRandom } from "@/service/apps/wiki";
import Link from "next/link";

export default async function Page() {
  const response = await apiWikiRandom();
  const article = response.query.random[0];

  return (
    <PageContainer>
      <div className="min-h-[70vh] bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-10">
        <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4">
          <div className="space-y-2 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-700">Wiki Explorer</p>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">Bài viết ngẫu nhiên hôm nay</h1>
            <p className="text-sm text-slate-600">Khám phá kiến thức mới mỗi ngày, nhấn để xem chi tiết trên Wiki.</p>
          </div>

          <div className="rounded-2xl border border-indigo-100 bg-white/90 p-6 shadow-lg backdrop-blur">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              <span className="h-2 w-2 rounded-full bg-indigo-500" />
              Random pick
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">
              <Link href={`/wiki/${encodeURIComponent(article.title)}`} className="text-indigo-700 transition hover:text-indigo-800">
                {article.title}
              </Link>
            </h2>
            <p className="mt-2 text-sm text-slate-600">Nhấn để mở bài viết đầy đủ và tiếp tục hành trình khám phá.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href={`/wiki/${encodeURIComponent(article.title)}`}
                className="inline-flex hover:text-white items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              >
                Đọc bài viết
              </Link>
              <Link
                href="/wiki"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-700"
              >
                Lấy bài khác
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}