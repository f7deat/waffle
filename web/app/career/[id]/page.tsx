/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import PageContainer from "@/components/layout/page-container";
import Block from "@/components/block";
import { apiCareerDetail } from "@/services/career";
import ApplyForm from "./apply-form";

type Params = Promise<{
    id: string;
}>;

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "DefZone.Net";

const toPlainText = (value?: string) => {
    if (!value) return "";
    return value.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
};

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { id } = await params;

    try {
        const response = await apiCareerDetail(id);
        const job = response?.data;
        if (!job) {
            return {
                title: `Tuyen dung | ${SITE_NAME}`,
                description: `Thong tin tuyen dung tai ${SITE_NAME}.`,
                alternates: {
                    canonical: `/career/${id}`,
                },
                robots: {
                    index: false,
                    follow: true,
                },
            };
        }

        const baseTitle = toPlainText(job.title) || "Chi tiet viec lam";
        const title = `${baseTitle} | Tuyen dung ${SITE_NAME}`;
        const shortDescription = toPlainText(job.description).slice(0, 155);
        const description = shortDescription || `Ung tuyen vi tri ${baseTitle} tai ${SITE_NAME}. Xem mo ta cong viec va nop CV truc tuyen.`;
        const canonical = `/career/${id}`;

        return {
            title,
            description,
            alternates: {
                canonical,
            },
            openGraph: {
                title,
                description,
                url: canonical,
                type: "article",
            },
            robots: {
                index: job.status !== 0,
                follow: true,
            },
        };
    } catch {
        return {
            title: `Tuyen dung | ${SITE_NAME}`,
            description: `Thong tin tuyen dung tai ${SITE_NAME}.`,
            alternates: {
                canonical: `/career/${id}`,
            },
            robots: {
                index: false,
                follow: true,
            },
        };
    }
}

const jobTypeLabel = (type: API.CareerJobType) => {
    switch (type) {
        case 0:
            return "Toàn thời gian";
        case 1:
            return "Bán thời gian";
        case 2:
            return "Hợp đồng";
        case 3:
            return "Thực tập";
        default:
            return "Khác";
    }
};

const statusLabel = (status: API.CareerJobStatus) => {
    switch (status) {
        case 0:
            return "Nhập liệu";
        case 1:
            return "Đang tuyển";
        case 2:
            return "Đã đóng";
        case 3:
            return "Đã đủ ứng viên";
        default:
            return "Khác";
    }
};

const Page = async ({ params }: { params: Params }) => {
    const { id } = await params;
    const cookieStore = await cookies();

    const response = await apiCareerDetail(id, cookieStore.toString());
    const job = response?.data;
    const detailContent = job?.detail || job?.detailJson;
    const blocks = detailContent?.blocks || [];

    if (!job) {
        return (
            <PageContainer breadcrumbs={[{ label: "Tuyển dụng", href: "/career" }]}>
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                    <p className="text-lg font-semibold text-slate-800">Khong tim thay tin tuyen dung.</p>
                    <p className="mt-2 text-sm text-slate-500">Vui long quay lai danh sach de chon vi tri khac.</p>
                    <Link href="/career" className="mt-4 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black">
                        Quay lai danh sach
                    </Link>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer
            breadcrumbs={[
                { label: "Tuyển dụng", href: "/career" },
                { label: job.title || "Chi tiết", href: "#" },
            ]}
        >
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
                <section className="space-y-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700">{jobTypeLabel(job.jobType)}</span>
                            <span className="rounded-full bg-orange-50 px-2.5 py-1 text-orange-700">{statusLabel(job.status)}</span>
                        </div>
                        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900">{job.title}</h1>
                        <p className="mt-3 text-sm leading-7 text-slate-600">{job.description || "Noi dung mo ta dang cap nhat."}</p>
                    </div>

                    <div className="prose max-w-none rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        {blocks.length === 0 ? (
                            <p className="text-slate-500">Noi dung chi tiet dang duoc cap nhat.</p>
                        ) : (
                            blocks.map((block, index) => (
                                <Block
                                    key={block.id || `${block.type}-${index}`}
                                    type={block.type as API.BlockType}
                                    data={{
                                        text: block.data?.text,
                                        level: block.data?.level,
                                        code: block.data?.code,
                                        caption: block.data?.caption,
                                        url: block.data?.file?.url,
                                        items: block.data?.items,
                                    }}
                                />
                            ))
                        )}
                    </div>
                </section>

                <aside id="apply" className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900">Ứng tuyển vị trí này</h2>
                    <p className="mt-2 text-sm text-slate-600">Gui CV de ung tuyen nhanh. He thong se luu va chuyen den bo phan tuyen dung.</p>
                    <div className="mt-4">
                        <ApplyForm jobId={job.id} />
                    </div>
                </aside>
            </div>
        </PageContainer>
    );
};

export default Page;
