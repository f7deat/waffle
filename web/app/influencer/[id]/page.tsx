/* eslint-disable @next/next/no-img-element */
import PageContainer from "@/components/layout/page-container";
import { apiGetUserByUserName } from "@/services/user/user";
import Link from "next/link";
import ContactForm from "./client";

type Params = Promise<{
    id: string;
}>;

const Page = async ({ params }: { params: Params }) => {
    const { id: userName } = await params;

    let user: API.UserBasicInfo | null = null;
    try {
        const userRes = await apiGetUserByUserName(userName);
        user = userRes.data || null;
    } catch (error) {
        console.error('Failed to fetch influencer:', error);
    }

    const breadcrumbs = [
        { label: "Influencer", href: "/influencer" },
        { label: user?.name || userName, href: "#" },
    ];

    if (!user) {
        return (
            <PageContainer breadcrumbs={breadcrumbs}>
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 shadow-sm">
                    <div className="text-4xl mb-3">👤</div>
                    <p className="font-semibold text-slate-700">Influencer không tồn tại.</p>
                    <p className="mt-1 text-sm text-slate-500">Influencer này có thể đã bị xóa hoặc không tồn tại.</p>
                    <Link 
                        href="/influencer" 
                        className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                    >
                        Quay lại danh sách Influencer
                    </Link>
                </div>
            </PageContainer>
        );
    }

    const joinedDate = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString("vi-VN")
        : "Chưa có thông tin";

    const genderLabel = user.gender === null || user.gender === undefined 
        ? "Chưa cập nhật"
        : user.gender 
            ? "Nữ"
            : "Nam";

    return (
        <PageContainer breadcrumbs={breadcrumbs}>
            <div className="space-y-8">
                {/* Influencer Info */}
                <div className="rounded-xl bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
                        {/* Avatar */}
                        <div className="flex flex-col items-center gap-4 md:items-start">
                            {user.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.name || user.userName}
                                    className="h-32 w-32 rounded-full border-4 border-indigo-100 object-cover"
                                />
                            ) : (
                                <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-indigo-100 bg-gradient-to-br from-indigo-100 to-indigo-50">
                                    <span className="text-4xl">👤</span>
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 space-y-4 text-center md:text-left">
                            <div>
                                <p className="text-xs uppercase tracking-[0.08em] text-slate-500">Thông tin Influencer</p>
                                <h1 className="text-3xl font-bold text-slate-900">{user.name || user.userName}</h1>
                                <p className="text-sm text-slate-600">@{user.userName}</p>
                            </div>

                            {/* Basic Info Grid */}
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                                <div className="rounded-lg bg-slate-50 p-3">
                                    <p className="text-xs text-slate-500">Giới tính</p>
                                    <p className="text-sm font-semibold text-slate-900">{genderLabel}</p>
                                </div>
                                <div className="rounded-lg bg-slate-50 p-3">
                                    <p className="text-xs text-slate-500">Gia nhập</p>
                                    <p className="text-sm font-semibold text-slate-900">{joinedDate}</p>
                                </div>
                                {user.districtName && user.provinceName && (
                                    <div className="rounded-lg bg-slate-50 p-3">
                                        <p className="text-xs text-slate-500">Địa chỉ</p>
                                        <p className="text-sm font-semibold text-slate-900">{user.districtName}, {user.provinceName}</p>
                                    </div>
                                )}
                            </div>

                            {/* Verification Badges */}
                            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                {user.emailConfirmed && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 border border-green-200">
                                        ✓ Email xác thực
                                    </span>
                                )}
                                {user.phoneNumberConfirmed && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 border border-green-200">
                                        ✓ Số điện thoại xác thực
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form Section */}
                <div className="max-w-2xl mx-auto w-full">
                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <div className="mb-6">
                            <p className="text-xs uppercase tracking-[0.08em] text-slate-500">Liên hệ</p>
                            <h2 className="text-2xl font-bold text-slate-900">Gửi tin nhắn cho Influencer</h2>
                            <p className="text-sm text-slate-600 mt-1">Điền form dưới đây để gửi lời chào hoặc thắc mắc của bạn.</p>
                        </div>
                        <ContactForm influencerName={user.name || user.userName} />
                    </div>
                </div>
            </div>
        </PageContainer>
    );
};

export default Page;
