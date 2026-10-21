import PageContainer from "@/components/layout/page-container";
import { Metadata } from "next";
import InfluencerJobList from "./clients/job-list";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "Việc làm Influencer - DefZone.Net",
        description: "Tìm kiếm và ứng tuyển các công việc dành cho influencer, KOL. Thương hiệu đăng tuyển, influencer ứng tuyển nhanh chóng.",
        openGraph: {
            title: "Việc làm Influencer - DefZone.Net",
            description: "Tìm kiếm và ứng tuyển các công việc dành cho influencer, KOL.",
        },
    };
}

const breadcrumbs = [
    { label: "Influencer", href: "/influencer" },
    { label: "Công việc", href: "/influencer/job" },
];

const Page: React.FC = () => {
    return (
        <PageContainer breadcrumbs={breadcrumbs}>
            <div className="max-w-7xl mx-auto py-8 px-4">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">Việc làm Influencer</h1>
                            <p className="text-gray-500">
                                Các thương hiệu đang tìm kiếm influencer để hợp tác. Ứng tuyển ngay hoặc đăng công việc của bạn.
                            </p>
                        </div>
                    </div>
                </div>

                {/* How it works */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    {[
                        { icon: "📢", title: "Thương hiệu đăng việc", desc: "Doanh nghiệp, thương hiệu đăng yêu cầu tìm influencer phù hợp." },
                        { icon: "🙋", title: "Influencer ứng tuyển", desc: "Influencer xem danh sách và ứng tuyển vào các công việc phù hợp." },
                        { icon: "🤝", title: "Kết nối & hợp tác", desc: "Hai bên kết nối và triển khai chiến dịch hiệu quả." },
                    ].map(s => (
                        <div key={s.title} className="rounded-xl bg-white border border-gray-100 p-5 flex gap-4 items-start shadow-sm">
                            <span className="text-3xl">{s.icon}</span>
                            <div>
                                <p className="font-semibold text-gray-800 text-sm">{s.title}</p>
                                <p className="text-xs text-gray-500 mt-1">{s.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Job List (client component) */}
                <InfluencerJobList />
            </div>
        </PageContainer>
    );
};

export default Page;
