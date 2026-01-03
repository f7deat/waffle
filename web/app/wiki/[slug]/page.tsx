import Link from "next/link";
import PageContainer from "@/components/layout/page-container";
import { apiWikiParse } from "@/service/apps/wiki";
import { Metadata } from "next";
import "../style.css";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { slug } = await params;
    const response = await apiWikiParse(slug);

    return {
        title: `${response.parse.title} - DefZone.Net`,
        description: `Read the Wikipedia article about ${response.parse.title}`,
    };
}

const Page: React.FC<{ params: Params }> = async ({ params }) => {
    const { slug } = await params;
    const response = await apiWikiParse(slug);
    const articleTitle = response.parse.title;
    const articleHtml = response.parse.text["*"];
    const wikiUrl = `https://vi.wikipedia.org/wiki/${encodeURIComponent(slug)}`;

    return (
        <PageContainer breadcrumbs={[{ label: "Wiki", href: "/wiki" }]}> 
            <div className="min-h-[70vh] bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-10">
                <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4">
                    <div className="rounded-2xl border border-indigo-100 bg-white/90 p-6 text-center shadow-lg backdrop-blur">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-indigo-700">Wiki Article</p>
                        <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">{articleTitle}</h1>
                        <p className="mt-2 text-sm text-slate-600">Nguồn dữ liệu từ Wikipedia, hiển thị bởi DefZone.Net</p>
                        <div className="mt-4 flex flex-wrap justify-center gap-3 text-sm">
                            <Link
                                href={wikiUrl}
                                className="inline-flex hover:text-white items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Xem trên Wikipedia
                            </Link>
                            <Link
                                href="/wiki"
                                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-700"
                            >
                                Bài ngẫu nhiên khác
                            </Link>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
                        <div className="wiki-content">
                            <div dangerouslySetInnerHTML={{ __html: articleHtml }} />
                        </div>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
};

export default Page;