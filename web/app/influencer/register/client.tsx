"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PageContainer from "@/components/layout/page-container";
import { apiInfluencerRegister } from "@/services/user/influencer";
import { Form, Input, Select } from "antd";
import { apiProvinceOptions } from "@/services/locations/province";
import { apiDistrictOptions } from "@/services/locations/district";

type SubmitState = "idle" | "success" | "error";

type FormData = {
	fullName: string;
	email: string;
	phoneNumber: string;
	gender: string;
	platforms: string;
	followers: string;
	password: string;
	confirmPassword: string;
	note: string;
};

const defaultFormData: FormData = {
	fullName: "",
	email: "",
	phoneNumber: "",
	gender: "",
	platforms: "",
	followers: "",
	password: "",
	confirmPassword: "",
	note: "",
};

const InfluencerRegisterForm = () => {
	const [formData, setFormData] = useState<FormData>(defaultFormData);
	const [submitState, setSubmitState] = useState<SubmitState>("idle");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [provinceOptions, setProvinceOptions] = useState<API.IOption[]>([]);
	const [districtOptions, setDistrictOptions] = useState<API.IOption[]>([]);
	const [selectedProvince, setSelectedProvince] = useState<number | null>(null);

	useEffect(() => {
		apiProvinceOptions().then((data: API.IOption[]) => {
			setProvinceOptions(data);
		});
	}, []);

	useEffect(() => {
		if (selectedProvince !== null) {
			apiDistrictOptions(selectedProvince).then((data: API.IOption[]) => {
				setDistrictOptions(data);
			});
		} else {
			setDistrictOptions([]);
		}
	}, [selectedProvince]);

	const handleSubmit = async (values: FormData) => {
		setIsSubmitting(true);
		setSubmitState("idle");
		setErrorMessage(null);
		if (formData.password !== formData.confirmPassword) {
			setSubmitState("error");
			setErrorMessage("Mật khẩu và xác nhận mật khẩu không khớp.");
			setIsSubmitting(false);
			return;
		}

		try {
			await apiInfluencerRegister(values);
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
							<h1 className="text-3xl font-bold leading-tight md:text-4xl">Đăng ký trở thành influencer của DefZone.Net</h1>
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

						<Form onFinish={handleSubmit} layout="vertical">
							<div className="grid gap-4 md:grid-cols-2">
								<Form.Item label="Họ và tên" name={"fullName"} required>
									<Input size="large" />
								</Form.Item>
								<Form.Item label="Email" name={"email"} required>
									<Input size="large" />
								</Form.Item>
							</div>

							<div className="grid gap-4 md:grid-cols-2">
								<Form.Item label="Số điện thoại" name={"phone"}>
									<Input size="large" />
								</Form.Item>
								<Form.Item label="Giới tính" name={"gender"}>
									<Select size="large" options={[
										{
											label: 'Nam',
											value: false
										},
										{
											label: 'Nữ',
											value: true
										}
									]} />
								</Form.Item>
							</div>

							<div className="grid gap-4 md:grid-cols-2">
								<Form.Item label="Tỉnh/Thành phố" name={"provinceId"}>
									<Select size="large" options={provinceOptions} onChange={setSelectedProvince} />
								</Form.Item>
								<Form.Item label="Xã/Phường" name={"districtId"}>
									<Select size="large" options={districtOptions} />
								</Form.Item>
							</div>

							<div className="grid md:grid-cols-2 gap-4">
								<Form.Item label="Mật khẩu" name={"password"} required>
									<Input.Password size="large" />
								</Form.Item>
								<Form.Item label="Xác nhận mật khẩu" name={"confirmPassword"} required>
									<Input.Password size="large" />
								</Form.Item>
							</div>

							<Form.Item label="Ghi chú thêm" name={"note"}>
								<Input.TextArea
									rows={5}
									placeholder="Link portfolio, media kit hoặc yêu cầu đặc biệt."
								/>
							</Form.Item>

							{submitState === "success" && (
								<div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
									Đã gửi đăng ký thành công. Chúng tôi sẽ phản hồi trong 48 giờ.
								</div>
							)}
							{submitState === "error" && (
								<div className="rounded-lg mb-2 border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
									{errorMessage || "Không gửi được đăng ký. Vui lòng thử lại hoặc liên hệ trực tiếp."}
								</div>
							)}
							<div className="text-xs text-slate-500 mb-2">
								Bằng việc gửi đơn đăng ký, bạn đồng ý với <Link href="/terms" className="underline">Điều khoản dịch vụ</Link> và <Link href="/privacy" className="underline">Chính sách bảo mật</Link> của chúng tôi.
							</div>

							<button
								type="submit"
								disabled={isSubmitting}
								className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 md:py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
							>
								{isSubmitting ? "Đang gửi..." : "Gửi đăng ký"}
							</button>
						</Form>
						<div className="mt-4 text-xs text-slate-400">
							Chú ý: Chúng tôi sẽ không chia sẻ thông tin của bạn với bên thứ ba mà không có sự đồng ý trước.
						</div>
						<div className="mt-2 text-xs text-slate-400 text-right">
							Bạn đã có tài khoản? <Link href="/user/login" className="underline">Đăng nhập tại đây</Link>
						</div>
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

export default InfluencerRegisterForm;
