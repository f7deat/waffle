"use client";

import PageContainer from "@/components/layout/page-container";
import { Checkbox, Form, notification } from "antd";
import { isAxiosError } from "axios";
import { useState } from "react";
import { apiMemberRegister } from "@/services/user/member";
import Link from "next/link";
import { faArrowRight, faBookmark, faChartBar, faCheck, faCheckCircle, faEnvelope, faEye, faEyeLowVision, faFire, faLocationDot, faLock, faMap, faPhone, faQuoteLeft, faUser, faUserCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type RegisterValues = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    phoneNumber?: string;
    acceptTerms: boolean;
    accountType: "member" | "business" | "influencer" | string;
};

const Page: React.FC = () => {
    const [form] = Form.useForm<RegisterValues>();
    const [api, contextHolder] = notification.useNotification();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedPurpose, setSelectedPurpose] = useState("member");

    const handleFinish = async (values: RegisterValues) => {
        setIsSubmitting(true);
        try {
            const response = await apiMemberRegister({
                name: values.name.trim(),
                userName: values.email.trim(),
                password: values.password,
                email: values.email.trim(),
                phoneNumber: values.phoneNumber?.trim(),
                accountType: selectedPurpose
            });

            if (!response.succeeded) {
                const description =
                    response.errors?.map((e) => e.description).join(" ") ||
                    "Vui lòng kiểm tra lại thông tin đăng ký.";
                api.error({
                    title: "Đăng ký thất bại",
                    description,
                });
                return;
            }

            api.success({
                title: "Đăng ký thành công",
                description: "Tài khoản thành viên của bạn đã được tạo. Hãy đăng nhập để tiếp tục.",
            });

            form.resetFields();
        } catch (error: unknown) {
            let description = "Không thể kết nối đến hệ thống. Vui lòng thử lại.";
            if (isAxiosError<{ errors?: { description: string }[] }>(error)) {
                const responseErrors = error.response?.data?.errors;
                description =
                    responseErrors?.map((item) => item.description).join(" ") ||
                    (typeof error.response?.data === "string" ? error.response.data : "") ||
                    description;
            }
            api.error({ title: "Đăng ký thất bại", description });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <PageContainer
            breadcrumbs={[
                { label: "Đăng ký tài khoản", href: "/user/register" },
            ]}
        >
            {contextHolder}
            <>
                <div className="hidden sm:flex items-center mb-4 gap-2 bg-surface-container-low px-4 py-1 rounded-full text-secondary font-label-sm text-label-sm shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                    <span>Hệ thống đăng ký mở • Khám phá Hải Phòng &amp; Việt Nam</span>
                </div>
                {/* Main Split Editorial Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* LEFT COLUMN: Brand Manifesto, Visual Anchor & Perks (5 cols on lg) */}
                    <div className="lg:col-span-5 flex flex-col gap-6">
                        {/* Editorial Visual Showcase Card */}
                        <div className="relative rounded-xl overflow-hidden bg-surface-container-lowest shadow-md group">
                            <div
                                className="w-full h-80 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                                data-alt="Close-up artistic photography of steaming hot Hai Phong spicy crab noodles Banh Da Cua in a rustic ceramic bowl, surrounded by fresh herbs, kumquats, and crispy shallots on an aged dark timber table. Warm natural golden afternoon light with cinematic depth of field, vibrant colors, celebrating authentic Vietnamese culinary culture."
                                style={{
                                    backgroundImage:
                                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCgwPix_veNTNCm2weviWFtJuRot6V0iVG-0nJiDcjVxTdgxHl0LvoPtu_ffUiIJLufOXZlFtyPjDXQf2PcMWYhUvA5l3sG49dSseZ3owWBovDozdDB3xWgnSclFmoUvIH3I7MFRU8gvyRZ8UxrtylAsYUqJJasf6LMxWrckHiCPkb5dif9ZOM9if6PWF3lpKb6kNJmP_XE7UHJ1Z588nUboUzSZTVK-Mw8JXP0uMcNdSRkI0RM0aFlxQ")'
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-on-surface/90 via-on-surface/40 to-transparent" />
                            {/* Badges Layered Over Image */}
                            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                                <span className="px-4 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-primary font-label-sm text-label-sm shadow-sm uppercase tracking-wider flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">
                                        <FontAwesomeIcon icon={faLocationDot} />
                                    </span>
                                    CỘNG ĐỒNG BẢN ĐỊA
                                </span>
                                <span className="px-4 py-1 rounded-full bg-surface-container-lowest/80 backdrop-blur-md text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px] text-secondary">
                                        explore
                                    </span>
                                    20°51' N • 106°41' E
                                </span>
                            </div>
                            <div className="absolute bottom-space-md lef-4 right-4 flex flex-col gap-1 text-on-primary">
                                <span className="font-label-sm text-label-sm text-tertiary-fixed tracking-widest uppercase">
                                    Tọa độ ngẫu hứng
                                </span>
                                <h3 className="font-headline-sm text-headline-sm font-semibold text-surface-bright leading-snug">
                                    Nơi những câu chuyện ăn chơi được kể bởi người bản địa.
                                </h3>
                            </div>
                        </div>
                        {/* Inspiring Community Heading */}
                        <div className="flex flex-col gap-2">
                            <div className="inline-flex items-center gap-2 text-primary font-label-md text-label-md">
                                <span className="material-symbols-outlined text-[18px]">
                                    <FontAwesomeIcon icon={faFire} />
                                </span>
                                <span>ĐẶC QUYỀN THÀNH VIÊN DEFZONE.NET</span>
                            </div>
                            <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                                Gia nhập cộng đồng{" "}
                                <span className="text-primary font-bold">2.5 triệu</span> người sành
                                điệu &amp; mê xê dịch.
                            </h2>
                            <p className="font-body-md text-body-md text-on-surface-variant">
                                Không chỉ là ăn và đi — DefZone.Net là cuốn sổ tay sống động, lưu giữ
                                từng góc quán thân thương, con hẻm thơm mùi bánh mì cay và những hoàng
                                hôn rực rỡ nhất.
                            </p>
                        </div>
                        {/* 3 Highlighted Perks Stack */}
                        <div className="flex flex-col gap-4 bg-surface-container-lowest gap-6 rounded-xl shadow-sm">
                            {/* Perk 1 */}
                            <div className="flex items-start gap-4 px-4 pt-4">
                                <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center flex-shrink-0 text-primary">
                                    <span className="material-symbols-outlined text-[20px]">
                                        <FontAwesomeIcon icon={faBookmark} />
                                    </span>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <h4 className="font-label-lg text-label-lg text-on-surface font-semibold">
                                        Lưu &amp; ghim quán ruột không giới hạn
                                    </h4>
                                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                                        Tự tạo bản đồ ẩm thực cá nhân, đánh dấu các quán vỉa hè lâu năm,
                                        tiệm cafe ẩn mình và chia sẻ nhanh cho nhóm bạn.
                                    </p>
                                </div>
                            </div>
                            {/* Perk 2 */}
                            <div className="flex items-start gap-4 px-4">
                                <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center flex-shrink-0 text-secondary">
                                    <span className="material-symbols-outlined text-[20px]">
                                        <FontAwesomeIcon icon={faUser} />
                                    </span>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <h4 className="font-label-lg text-label-lg text-on-surface font-semibold">
                                        Mở khóa kho voucher &amp; ưu đãi thành viên
                                    </h4>
                                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                                        Nhận đặc quyền giảm từ 10% đến 35% tại hơn 3,000+ điểm đến uy tín
                                        trên toàn quốc, cập nhật mới hàng tuần.
                                    </p>
                                </div>
                            </div>
                            {/* Perk 3 */}
                            <div className="flex items-start gap-4 px-4 pb-4">
                                <div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center flex-shrink-0 text-tertiary">
                                    <span className="material-symbols-outlined text-[20px]">
                                        <FontAwesomeIcon icon={faChartBar} />
                                    </span>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <h4 className="font-label-lg text-label-lg text-on-surface font-semibold">
                                        Tích điểm hành trình &amp; Nâng cấp Reviewer
                                    </h4>
                                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                                        Đóng góp bài review trung thực để nhận huy hiệu "Thổ địa ẩm thực"
                                        cùng quà tặng trải nghiệm độc quyền từ nhãn hàng.
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* Authentic Testimonial Quote */}
                        <div className="bg-surface-container-low p-4 rounded-xl flex flex-col gap-3 relative">
                            <span className="material-symbols-outlined text-[32px] text-primary/30 absolute top-space-sm right-4">
                                <FontAwesomeIcon icon={faQuoteLeft} />
                            </span>
                            <p className="font-body-md text-body-md text-on-surface italic relative z-10">
                                "Từ ngày dùng DefZone.Net, mình đi đến tỉnh nào cũng như có thổ địa dắt
                                túi. Không lo bị chặt chém hay rơi vào bẫy review ảo của thuật toán."
                            </p>
                            <div className="flex items-center gap-3 pt-1">
                                <img
                                    className="w-10 h-10 rounded-full object-cover shadow-sm"
                                    data-alt="Portrait photo of a young Vietnamese man with warm smile, holding a vintage camera, stylish casual linen shirt in an outdoor cafe patio in Hanoi old quarter, natural warm ambient lighting."
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuArZ8tLB1eY0ptSVgRlcpLWw_B6atjV5oC9dkc7OBdnrIAH8AJhSi2l29ccwst_qzIZjvlrLy4Xjfjz4kvwjPY7piEOygHbWmb9uole4UWq5oZ2qo-jcfqlJaSji51gQDbFu8U5AQd_Y_XYbOliumKJd-X5TjtnD-VcANOsbC7vFAbXNF3ZGd4_5nfVvy5SkkSxKU40CyFRXqwsSKeEnWh0S6KLfLBqvDnikOva7zkvE4P9e0Tug0lPIA"
                                />
                                <div className="flex flex-col">
                                    <span className="font-label-md text-label-md text-on-surface font-semibold">
                                        Đinh Công Tân
                                    </span>
                                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                                        Hải Phòng • 42 chuyến đi cùng DefZone.Net
                                    </span>
                                </div>
                            </div>
                        </div>
                        {/* Credibility Numbers Strip */}
                        <div className="grid grid-cols-3 gap-3 bg-surface-container-lowest p-4 rounded-xl text-center shadow-sm">
                            <div className="flex flex-col items-center">
                                <span className="font-headline-md text-headline-md text-primary font-bold">
                                    2.5M+
                                </span>
                                <span className="font-body-sm text-body-sm text-on-surface-variant">
                                    Tín đồ khám phá
                                </span>
                            </div>
                            <div className="flex flex-col items-center border-l border-surface-variant/60">
                                <span className="font-headline-md text-headline-md text-secondary font-bold">
                                    9.5K+
                                </span>
                                <span className="font-body-sm text-body-sm text-on-surface-variant">
                                    Tọa độ xác thực
                                </span>
                            </div>
                            <div className="flex flex-col items-center border-l border-surface-variant/60">
                                <span className="font-headline-md text-headline-md text-tertiary font-bold">
                                    500+
                                </span>
                                <span className="font-body-sm text-body-sm text-on-surface-variant">
                                    Thổ địa bảo chứng
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* RIGHT COLUMN: Sign Up Form Card (7 cols on lg) */}
                    <div className="lg:col-span-7">
                        <div className="bg-surface-container-lowest rounded-xl gap-6 lg:p-8 shadow-md flex flex-col gap-6 relative">
                            {/* Segmented Switch: Login vs Sign Up */}
                            <div className="flex items-center justify-between bg-surface-container p-1 rounded-full max-w-sm mx-auto w-full">
                                <Link
                                    className="flex-1 text-center py-2 rounded-full font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-all duration-200"
                                    href="/user/login"
                                >
                                    Đăng nhập
                                </Link>
                                <button
                                    className="flex-1 text-center py-2 rounded-full bg-primary-container text-on-primary font-label-md text-label-md shadow-[0_2px_8px_rgba(242,107,79,0.3)] transition-all flex items-center justify-center gap-1.5"
                                    type="button"
                                >
                                    <span>✨ Đăng ký mới</span>
                                </button>
                            </div>
                            {/* Form Header Title & Welcome */}
                            <div className="flex flex-col gap-1 text-center md:text-left">
                                <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
                                    Tạo tài khoản DefZone.Net và bắt đầu hành trình khám phá Việt Nam
                                </h2>
                                <p className="font-body-md text-body-md text-on-surface-variant">
                                    Bắt đầu hành trình khám phá và chia sẻ những tọa độ bản địa tuyệt
                                    vời nhất.
                                </p>
                            </div>
                            {/* Social Quick Sign-Up Hub */}
                            <div className="flex flex-col gap-3">
                                <button
                                    className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-full bg-surface-container-low hover:bg-surface-container transition-all font-label-lg text-label-lg text-on-surface shadow-sm hover:shadow"
                                    type="button"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            fill="#34A853"
                                        />
                                        <path
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                                            fill="#EA4335"
                                        />
                                    </svg>
                                    <span>Đăng ký nhanh với Google</span>
                                </button>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        className="flex items-center justify-center gap-2 py-2 px-4 rounded-full bg-surface-container-low hover:bg-surface-container transition-all font-label-md text-label-md text-on-surface shadow-sm"
                                        type="button"
                                    >
                                        <svg
                                            className="w-4 h-4 fill-current text-on-surface"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-2 .6-2.65 1.35-.58.67-1.09 1.74-.95 2.77 1 .08 2.05-.52 2.67-1.27z" />
                                        </svg>
                                        <span>Apple ID</span>
                                    </button>
                                    <button
                                        className="flex items-center justify-center gap-2 py-2 px-4 rounded-full bg-surface-container-low hover:bg-surface-container transition-all font-label-md text-label-md text-on-surface shadow-sm"
                                        type="button"
                                    >
                                        <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                        </svg>
                                        <span>Facebook</span>
                                    </button>
                                </div>
                            </div>
                            {/* Divider */}
                            <div className="relative flex items-center justify-center">
                                <div className="w-full border-t border-surface-variant/80" />
                                <span className="absolute bg-surface-container-lowest px-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                                    Hoặc đăng ký bằng Email &amp; SĐT
                                </span>
                            </div>
                            {/* Sign Up Form Fields */}
                            <Form
                                form={form}
                                onFinish={handleFinish}
                                onFinishFailed={({ errorFields }) => {
                                    api.error({
                                        title: "Thông tin chưa hợp lệ",
                                        description: errorFields[0]?.errors[0] || "Vui lòng kiểm tra lại biểu mẫu.",
                                    });
                                }}
                                className="flex flex-col gap-4"
                            >
                                {/* User Role Selector Pills */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-1">
                                        <span>Mục đích tham gia của bạn</span>
                                        <span className="text-primary">*</span>
                                    </label>
                                    <div
                                        className="grid grid-cols-1 sm:grid-cols-3 gap-2"
                                        id="role-selector"
                                    >
                                        <button
                                            aria-pressed={selectedPurpose === "member"}
                                            className={`role-pill px-3 py-2.5 rounded-lg text-left font-label-sm text-label-sm flex flex-col gap-0.5 transition-all ${
                                                selectedPurpose === "member"
                                                    ? "active bg-secondary text-on-secondary shadow-sm"
                                                    : "bg-surface-container-low hover:bg-surface-container text-on-surface"
                                            }`}
                                            type="button"
                                            onClick={() => setSelectedPurpose("member")}
                                        >
                                            <span className="font-semibold flex items-center justify-between">
                                                Thành viên
                                                <span className={`material-symbols-outlined text-[16px] ${selectedPurpose === "member" ? "" : "opacity-0"}`}>
                                                    <FontAwesomeIcon icon={faCheckCircle} />
                                                </span>
                                            </span>
                                            <span className={`text-[10px] leading-tight ${selectedPurpose === "member" ? "text-secondary-fixed opacity-90" : "text-on-surface-variant"}`}>
                                                Khám phá &amp; Lưu quán
                                            </span>
                                        </button>
                                        <button
                                            aria-pressed={selectedPurpose === "business"}
                                            className={`role-pill px-3 py-2.5 rounded-lg text-left font-label-sm text-label-sm flex flex-col gap-0.5 transition-all ${
                                                selectedPurpose === "business"
                                                    ? "active bg-secondary text-on-secondary shadow-sm"
                                                    : "bg-surface-container-low hover:bg-surface-container text-on-surface"
                                            }`}
                                            type="button"
                                            onClick={() => setSelectedPurpose("business")}
                                        >
                                            <span className="font-semibold flex items-center justify-between">
                                                Chủ cơ sở
                                                <span className={`material-symbols-outlined text-[16px] ${selectedPurpose === "business" ? "" : "opacity-0"}`}>
                                                    <FontAwesomeIcon icon={faCheckCircle} />
                                                </span>
                                            </span>
                                            <span className={`text-[10px] leading-tight ${selectedPurpose === "business" ? "text-secondary-fixed opacity-90" : "text-on-surface-variant"}`}>
                                                Quán ăn, Cafe, Homestay
                                            </span>
                                        </button>
                                        <button
                                            aria-pressed={selectedPurpose === "creator"}
                                            className={`role-pill px-3 py-2.5 rounded-lg text-left font-label-sm text-label-sm flex flex-col gap-0.5 transition-all ${
                                                selectedPurpose === "creator"
                                                    ? "active bg-secondary text-on-secondary shadow-sm"
                                                    : "bg-surface-container-low hover:bg-surface-container text-on-surface"
                                            }`}
                                            type="button"
                                            onClick={() => setSelectedPurpose("creator")}
                                        >
                                            <span className="font-semibold flex items-center justify-between">
                                                Creator
                                                <span className={`material-symbols-outlined text-[16px] ${selectedPurpose === "creator" ? "" : "opacity-0"}`}>
                                                    <FontAwesomeIcon icon={faCheckCircle} />
                                                </span>
                                            </span>
                                            <span className={`text-[10px] leading-tight ${selectedPurpose === "creator" ? "text-secondary-fixed opacity-90" : "text-on-surface-variant"}`}>
                                                Reviewer &amp; Influencer
                                            </span>
                                        </button>
                                    </div>
                                </div>
                                {/* Full Name Field */}
                                <div className="flex flex-col gap-1">
                                    <label
                                        className="font-label-md text-label-md text-on-surface font-semibold flex items-center justify-between"
                                        htmlFor="fullname"
                                    >
                                        <span>Họ và tên</span>
                                        <span className="text-on-surface-variant font-normal text-body-sm">
                                            Hiển thị trên review
                                        </span>
                                    </label>
                                    <div className="relative flex items-center">
                                        <span className="material-symbols-outlined absolute lef-4 text-outline text-[20px]">
                                            <FontAwesomeIcon icon={faUser} />
                                        </span>
                                        <Form.Item
                                            name="name"
                                            rules={[{ required: true, whitespace: true, message: "Vui lòng nhập họ và tên." }]}
                                            noStyle
                                        >
                                            <input
                                                className="w-full bg-surface-container-low focus:bg-surface-container-lowest pl-11 pr-4 py-2.5 rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all shadow-sm"
                                                id="fullname"
                                                placeholder="Ví dụ: Nguyễn Phương Mai"
                                                type="text"
                                            />
                                        </Form.Item>
                                        <span className="material-symbols-outlined absolute right-4 text-secondary text-[20px]">
                                            <FontAwesomeIcon icon={faCheck} />
                                        </span>
                                    </div>
                                </div>
                                {/* Dual Field: Email & Phone */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Email */}
                                    <div className="flex flex-col gap-1">
                                        <label
                                            className="font-label-md text-label-md text-on-surface font-semibold"
                                            htmlFor="email"
                                        >
                                            Email
                                        </label>
                                        <div className="relative flex items-center">
                                            <span className="material-symbols-outlined absolute lef-4 text-outline text-[20px]">
                                                <FontAwesomeIcon icon={faEnvelope} />
                                            </span>
                                            <Form.Item
                                                name="email"
                                                rules={[
                                                    { required: true, message: "Vui lòng nhập email." },
                                                    { type: "email", message: "Email không hợp lệ." },
                                                ]}
                                                noStyle
                                            >
                                                <input
                                                    className="w-full bg-surface-container-low focus:bg-surface-container-lowest pl-11 pr-4 py-2.5 rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all shadow-sm"
                                                    id="email"
                                                    placeholder="mai.nguyen@gmail.com"
                                                    type="email"
                                                />
                                            </Form.Item>
                                            <span className="material-symbols-outlined absolute right-4 text-secondary text-[20px]">
                                                <FontAwesomeIcon icon={faCheck} />
                                            </span>
                                        </div>
                                    </div>
                                    {/* Phone */}
                                    <div className="flex flex-col gap-1">
                                        <label
                                            className="font-label-md text-label-md text-on-surface font-semibold"
                                            htmlFor="phone"
                                        >
                                            Số điện thoại
                                        </label>
                                        <div className="relative flex items-center">
                                            <div className="absolute left-3 flex items-center gap-1 text-on-surface font-label-md text-label-md pr-1 border-r border-surface-variant">
                                                <span className="text-[16px]">🇻🇳</span>
                                                <span>+84</span>
                                            </div>
                                            <Form.Item name="phoneNumber" noStyle>
                                                <input
                                                    className="w-full bg-surface-container-low focus:bg-surface-container-lowest pl-20 pr-4 py-2.5 rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all shadow-sm"
                                                    id="phone"
                                                    placeholder="0912 345 678"
                                                    type="tel"
                                                />
                                            </Form.Item>
                                        </div>
                                    </div>
                                </div>
                                {/* Password Field + Strength Indicator */}
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center justify-between">
                                        <label
                                            className="font-label-md text-label-md text-on-surface font-semibold"
                                            htmlFor="password"
                                        >
                                            Mật khẩu
                                        </label>
                                        <span className="font-label-sm text-label-sm text-secondary font-medium flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[14px]">
                                                <FontAwesomeIcon icon={faLock} />
                                            </span>
                                            Độ an toàn: Mạnh
                                        </span>
                                    </div>
                                    <div className="relative flex items-center">
                                        <span className="material-symbols-outlined absolute lef-4 text-outline text-[20px]">
                                            <FontAwesomeIcon icon={faLock} />
                                        </span>
                                        <Form.Item
                                            name="password"
                                            rules={[{ required: true, message: "Vui lòng nhập mật khẩu." }]}
                                            noStyle
                                        >
                                            <input
                                                className="w-full bg-surface-container-low focus:bg-surface-container-lowest pl-11 pr-11 py-2.5 rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all shadow-sm"
                                                id="password"
                                                type="password"
                                            />
                                        </Form.Item>
                                        <button
                                            className="material-symbols-outlined absolute right-4 text-on-surface-variant hover:text-on-surface text-[20px] cursor-pointer"
                                            id="toggle-pwd-btn"
                                            type="button"
                                        >
                                            <span id="pwd-icon"><FontAwesomeIcon icon={faEyeLowVision} /></span>
                                        </button>
                                    </div>
                                    {/* Password Strength Meter Visual Progress Bar */}
                                    <div className="flex flex-col gap-1 pt-1">
                                        <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
                                            <div className="bg-secondary rounded-full" />
                                            <div className="bg-secondary rounded-full" />
                                            <div className="bg-secondary rounded-full" />
                                            <div className="bg-secondary rounded-full" />
                                        </div>
                                        <span className="font-body-sm text-body-sm text-secondary text-[11px] leading-tight">
                                            Mạnh: Đã bao gồm chữ hoa, chữ thường, chữ số &amp; ký tự đặc
                                            biệt.
                                        </span>
                                    </div>
                                </div>
                                {/* Re-enter Password Field */}
                                <div className="flex flex-col gap-1">
                                    <label
                                        className="font-label-md text-label-md text-on-surface font-semibold"
                                        htmlFor="confirm-password"
                                    >
                                        Xác nhận lại mật khẩu
                                    </label>
                                    <div className="relative flex items-center">
                                        <span className="material-symbols-outlined absolute lef-4 text-outline text-[20px]">
                                            <FontAwesomeIcon icon={faLock} />
                                        </span>
                                        <Form.Item
                                            name="confirmPassword"
                                            dependencies={["password"]}
                                            rules={[
                                                { required: true, message: "Vui lòng xác nhận mật khẩu." },
                                                {
                                                    validator: (_, value: string | undefined) =>
                                                        value === form.getFieldValue("password")
                                                            ? Promise.resolve()
                                                            : Promise.reject(new Error("Mật khẩu xác nhận không khớp.")),
                                                },
                                            ]}
                                            noStyle
                                        >
                                            <input
                                                className="w-full bg-surface-container-low focus:bg-surface-container-lowest pl-11 pr-11 py-2.5 rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-secondary transition-all shadow-sm ring-1 ring-secondary/30"
                                                id="confirm-password"
                                                type="password"
                                            />
                                        </Form.Item>
                                        <div className="absolute right-4 flex items-center gap-1 text-secondary">
                                            <span className="material-symbols-outlined text-[20px]">
                                                <FontAwesomeIcon icon={faCheck} />
                                            </span>
                                        </div>
                                    </div>
                                    <span className="font-body-sm text-body-sm text-secondary text-[11px] flex items-center gap-1">
                                        <span>Mật khẩu trùng khớp hoàn toàn</span>
                                    </span>
                                </div>
                                {/* Consent Checkboxes */}
                                <div className="flex flex-col gap-2.5 pt-1">
                                    {/* Terms checkbox */}
                                    <label className="flex items-start gap-3 cursor-pointer select-none group">
                                        <Form.Item
                                            name="acceptTerms"
                                            valuePropName="checked"
                                            rules={[
                                                {
                                                    validator: (_, accepted: boolean | undefined) =>
                                                        accepted
                                                            ? Promise.resolve()
                                                            : Promise.reject(new Error("Bạn cần đồng ý với điều khoản để đăng ký.")),
                                                },
                                            ]}
                                            noStyle
                                        >
                                            <Checkbox />
                                        </Form.Item>
                                        <span className="font-body-sm text-body-sm text-on-surface-variant leading-snug">
                                            Tôi đồng ý với{" "}
                                            <Link
                                                className="text-primary hover:underline font-medium"
                                                href="/terms"
                                            >
                                                Điều khoản dịch vụ
                                            </Link>{" "}
                                            và{" "}
                                            <Link
                                                className="text-primary hover:underline font-medium"
                                                href="/privacy"
                                            >
                                                Chính sách bảo mật
                                            </Link>{" "}
                                            của DefZone.Net. <span className="text-primary">*</span>
                                        </span>
                                    </label>
                                    {/* Newsletter checkbox */}
                                    <label className="flex items-start gap-3 cursor-pointer select-none group">
                                        <input
                                            className="mt-1 w-4 h-4 rounded text-secondary focus:ring-secondary accent-secondary"
                                            type="checkbox"
                                        />
                                        <span className="font-body-sm text-body-sm text-on-surface-variant leading-snug">
                                            Nhận bản tin gợi ý quán ngon giấu kín, cẩm nang 24h &amp;
                                            voucher độc quyền Hải Phòng mỗi tuần.
                                        </span>
                                    </label>
                                </div>
                                {/* Primary Submit CTA Button */}
                                <button
                                    className="w-full mt-2 py-3.5 px-space-xl rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg shadow-[0_8px_20px_rgba(242,107,79,0.35)] hover:bg-primary hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 group"
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    <span>Tạo tài khoản ngay</span>
                                    <span className="material-symbols-outlined text-[20px] transition-transform duration-200 group-hover:translate-x-1">
                                        <FontAwesomeIcon icon={faArrowRight} />
                                    </span>
                                </button>
                            </Form>
                            {/* Form Footer Links & Security Badge */}
                            <div className="flex flex-col items-center gap-4 pt-2 border-t border-surface-variant/60 text-center">
                                <div className="font-body-md text-body-md text-on-surface-variant">
                                    Đã có tài khoản DefZone.Net?
                                    <Link
                                        className="text-primary hover:underline font-semibold ml-1"
                                        href="/user/login"
                                    >
                                        Đăng nhập ngay
                                    </Link>
                                </div>
                                {/* 256-bit SSL Security Endorsement */}
                                <div className="flex items-center gap-2 text-on-surface-variant/80 font-label-sm text-label-sm bg-surface-container px-4 py-1.5 rounded-full">
                                    <span className="material-symbols-outlined text-[16px] text-secondary">
                                        <FontAwesomeIcon icon={faUserCheck} />
                                    </span>
                                    <span>Thông tin cá nhân được mã hóa SSL 256-bit chuẩn quốc tế</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Bottom Community Highlight Carousel Banner */}
                <div className="mt-space-xl bg-surface-container-low gap-6 lg:p-8 rounded-xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                            <span className="material-symbols-outlined text-[28px]">
                                <FontAwesomeIcon icon={faMap} />
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                                Khám phá ngay bộ sưu tập "Foodtour Hải Phòng 48 Giờ"
                            </h4>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">
                                Tuyển tập 35 quán bánh đa cua, nem cua bể, bánh đúc tàu chuẩn vị gốc
                                được bình chọn bởi cộng đồng thành viên.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 w-full md:w-auto">
                        <Link
                            className="w-full md:w-auto text-center px-6 py-2.5 rounded-full bg-secondary text-on-secondary font-label-md text-label-md hover:bg-on-secondary-container transition-colors shadow-sm flex items-center justify-center gap-1.5"
                            href="/article"
                        >
                            <span>Xem trước cẩm nang</span>
                            <span className="material-symbols-outlined text-[18px]">
                                <FontAwesomeIcon icon={faArrowRight} />
                            </span>
                        </Link>
                    </div>
                </div>
            </>

        </PageContainer>
    );
};

export default Page;
