"use client";

import Link from "next/link";
import { useState } from "react";
import PageContainer from "@/components/layout/page-container";
import { apiInfluencerRegister } from "@/service/user/influencer";

type SubmitState = "idle" | "success" | "error";

type Grecaptcha = {
	ready: (cb: () => void) => void;
	execute: (key: string, options: { action: string }) => Promise<string>;
};

declare global {
	interface Window {
		grecaptcha?: Grecaptcha;
	}
}

type FormData = {
	fullName: string;
	email: string;
	phone: string;
	city: string;
	platforms: string;
	followers: string;
	niches: string;
	note: string;
};

const defaultFormData: FormData = {
	fullName: "",
	email: "",
	phone: "",
	city: "",
	platforms: "",
	followers: "",
	niches: "",
	note: "",
};

const Page = () => {
	const [formData, setFormData] = useState<FormData>(defaultFormData);
	const [submitState, setSubmitState] = useState<SubmitState>("idle");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);
		setSubmitState("idle");
		setErrorMessage(null);

		try {

			await apiInfluencerRegister({
                fullName: formData.fullName,
                email: formData.email,
                phoneNumber: formData.phone,
            });
			setSubmitState("success");
			setFormData(defaultFormData);
		} catch (error) {
			setSubmitState("error");
			setErrorMessage(error instanceof Error ? error.message : "Không thể gửi reCAPTCHA");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<PageContainer
			breadcrumbs={[
				{ label: "Influencer", href: "/influencer" },
				{ label: "Đăng ký", href: "/influencer/register" }
			]}
		>
			<div className="space-y-8">
				<section className="overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-500 px-6 py-8 text-white shadow-lg md:px-10">
					<div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
						<div className="space-y-3">
							<p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/70">Influencer Program</p>
							<h1 className="text-3xl font-bold leading-tight md:text-4xl">Đăng ký trở thành influencer của Waffle</h1>
							<p className="max-w-2xl text-sm text-white/80 md:text-base">
								Nhận brief hợp tác, ưu đãi trải nghiệm và được ưu tiên ghim trên danh sách KOL tại các địa điểm bạn yêu thích. Điền hồ sơ và chúng tôi sẽ phản hồi trong 48 giờ.
							</p>
							<div className="flex flex-wrap gap-3">
								<Link
									href="/place"
									className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
								>
									Khám phá địa điểm
								</Link>
								<a
									href="#register"
									className="inline-flex items-center gap-2 rounded-lg border border-white/50 px-4 py-2 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
								>
									Đăng ký ngay
								</a>
							</div>
						</div>
						<div className="hidden md:block">
							<div className="rounded-xl bg-white/15 px-6 py-5 backdrop-blur">
								<p className="text-sm font-semibold">Cam kết phản hồi</p>
								<p className="text-sm text-white/80">Hồ sơ được kiểm duyệt trong 48 giờ làm việc.</p>
							</div>
						</div>
					</div>
				</section>

				<section className="grid gap-4 md:grid-cols-3">
					{[
						{
							title: "Ưu đãi trải nghiệm",
							desc: "Nhận voucher, quyền test dịch vụ mới và hỗ trợ travel kit cho từng địa điểm.",
						},
						{
							title: "Brief rõ ràng",
							desc: "Tài liệu brand, KPI và quyền truy cập media kit được cung cấp ngay sau khi duyệt.",
						},
						{
							title: "Theo dõi hiệu quả",
							desc: "Theo dõi lượt xem, click-out và booking phát sinh từ nội dung của bạn.",
						},
					].map((item) => (
						<div key={item.title} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
							<h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
							<p className="mt-2 text-sm text-slate-600">{item.desc}</p>
						</div>
					))}
				</section>

				<section id="register" className="grid gap-6 lg:grid-cols-[1.6fr,1fr]">
					<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
						<div className="mb-6 space-y-1">
							<p className="text-xs uppercase tracking-[0.08em] text-slate-500">Đơn đăng ký</p>
							<h2 className="text-2xl font-semibold text-slate-900">Thông tin influencer</h2>
							<p className="text-sm text-slate-600">Điền thông tin chi tiết để chúng tôi kết nối cơ hội phù hợp nhất.</p>
						</div>

						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="grid gap-4 md:grid-cols-2">
								<label className="space-y-2 text-sm">
									<span className="font-medium text-slate-800">Họ và tên *</span>
									<input
										type="text"
										name="fullName"
										value={formData.fullName}
										onChange={handleChange}
										required
										className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
										placeholder="Nguyen Van A"
									/>
								</label>
								<label className="space-y-2 text-sm">
									<span className="font-medium text-slate-800">Email *</span>
									<input
										type="email"
										name="email"
										value={formData.email}
										onChange={handleChange}
										required
										className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
										placeholder="influencer@email.com"
									/>
								</label>
							</div>

							<div className="grid gap-4 md:grid-cols-2">
								<label className="space-y-2 text-sm">
									<span className="font-medium text-slate-800">Số điện thoại *</span>
									<input
										type="tel"
										name="phone"
										value={formData.phone}
										onChange={handleChange}
										required
										className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
										placeholder="0987 123 456"
									/>
								</label>
								<label className="space-y-2 text-sm">
									<span className="font-medium text-slate-800">Thành phố/ Tỉnh *</span>
									<input
										type="text"
										name="city"
										value={formData.city}
										onChange={handleChange}
										required
										className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
										placeholder="Ha Noi, Da Nang, ..."
									/>
								</label>
							</div>

							<div className="grid gap-4 md:grid-cols-2">
								<label className="space-y-2 text-sm">
									<span className="font-medium text-slate-800">Nền tảng chính *</span>
									<input
										type="text"
										name="platforms"
										value={formData.platforms}
										onChange={handleChange}
										required
										className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
										placeholder="Instagram, TikTok, YouTube..."
									/>
								</label>
								<label className="space-y-2 text-sm">
									<span className="font-medium text-slate-800">Tổng follower *</span>
									<input
										type="text"
										name="followers"
										value={formData.followers}
										onChange={handleChange}
										required
										className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
										placeholder="Ví dụ: 250k across platforms"
									/>
								</label>
							</div>

							<label className="space-y-2 text-sm">
								<span className="font-medium text-slate-800">Ngách nội dung ưu tiên *</span>
								<input
									type="text"
									name="niches"
									value={formData.niches}
									onChange={handleChange}
									required
									className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
									placeholder="Ẩm thực, du lịch, lifestyle..."
								/>
							</label>

							<label className="space-y-2 text-sm">
								<span className="font-medium text-slate-800">Ghi chú thêm</span>
								<textarea
									name="note"
									value={formData.note}
									onChange={handleChange}
									rows={5}
									className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
									placeholder="Link portfolio, media kit hoặc yêu cầu đặc biệt."
								/>
							</label>

							{submitState === "success" && (
								<div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
									Đã gửi đăng ký thành công. Chúng tôi sẽ phản hồi trong 48 giờ.
								</div>
							)}
							{submitState === "error" && (
								<div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
									{errorMessage || "Không gửi được đăng ký. Vui lòng thử lại hoặc liên hệ trực tiếp."}
								</div>
							)}

							<button
								type="submit"
								disabled={isSubmitting}
								className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
							>
								{isSubmitting ? "Đang gửi..." : "Gửi đăng ký"}
							</button>
						</form>
					</div>

					<aside className="space-y-4">
						<div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
							<h3 className="text-base font-semibold text-slate-900">Yêu cầu tối thiểu</h3>
							<ul className="mt-3 space-y-2 text-sm text-slate-600">
								<li>• 10k follower ở nền tảng chính.</li>
								<li>• Nội dung liên quan du lịch, ẩm thực, lifestyle hoặc hoạt động địa phương.</li>
								<li>• Lịch đăng tối thiểu 2 bài/tháng.</li>
							</ul>
						</div>
						<div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-slate-900">
							<h3 className="text-base font-semibold">Cần hỗ trợ nhanh?</h3>
							<p className="mt-2 text-sm text-slate-700">Gọi hotline hoặc nhắn qua email, đội ngũ sẽ phản hồi trong giờ hành chính.</p>
							<div className="mt-3 space-y-1 text-sm">
								<a href="tel:+84762559696" className="block font-semibold text-indigo-700 hover:underline">+84 762 559 696</a>
								<a href="mailto:defzone.net@gmail.com" className="block font-semibold text-indigo-700 hover:underline">defzone.net@gmail.com</a>
							</div>
							<Link
								href="/contact"
								className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:underline"
							>
								Chat với chúng tôi
							</Link>
						</div>
					</aside>
				</section>
			</div>
		</PageContainer>
	);
};

export default Page;
