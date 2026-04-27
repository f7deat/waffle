'use client';

import { apiContactSubmit } from "@/services/contact";
import { useState } from "react";

interface ContactFormProps {
    influencerName: string;
    influencerUserName: string;
}

const CONTENT_TYPES = [
    "Review sản phẩm",
    "Video ngắn / Reel / TikTok",
    "Story / Livestream",
    "Booking chụp ảnh",
    "Chiến dịch tổng hợp",
];

const ContactForm: React.FC<ContactFormProps> = ({ influencerName, influencerUserName }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        brandName: '',
        campaignGoal: '',
        contentType: CONTENT_TYPES[0],
        budget: '',
        timeline: '',
        note: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setSuccessMessage('');
        setErrorMessage('');

        const budgetLine = formData.budget
            ? `${Number(formData.budget).toLocaleString("vi-VN")} VND`
            : "Chưa cung cấp";

        // Backend contact note has length limit, so keep message concise.
        const structuredNote = [
            `YEU_CAU_THUE_INFLUENCER`,
            `Influencer: ${influencerName} (@${influencerUserName})`,
            `Thuong hieu: ${formData.brandName || "Khong cung cap"}`,
            `Muc tieu: ${formData.campaignGoal || "Khong cung cap"}`,
            `Loai noi dung: ${formData.contentType}`,
            `Ngan sach: ${budgetLine}`,
            `Timeline: ${formData.timeline || "Khong cung cap"}`,
            `Mo ta: ${formData.note || "Khong co"}`,
        ].join(" | ");

        try {
            const response = await apiContactSubmit({
                name: formData.name,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                note: structuredNote.slice(0, 490),
            });
            
            if (response.data && response.succeeded === true) {
                setSuccessMessage('Gửi yêu cầu thuê thành công! Chúng tôi sẽ kết nối bạn với influencer sớm nhất.');
                setFormData({
                    name: '',
                    email: '',
                    phoneNumber: '',
                    brandName: '',
                    campaignGoal: '',
                    contentType: CONTENT_TYPES[0],
                    budget: '',
                    timeline: '',
                    note: '',
                });
                // Clear success message after 5 seconds
                setTimeout(() => setSuccessMessage(''), 5000);
            } else {
                setErrorMessage('Có lỗi xảy ra khi gửi yêu cầu thuê. Vui lòng thử lại.');
            }
        } catch (error: any) {
            console.error('Failed to submit contact form:', error);
            setErrorMessage(
                error?.response?.data?.message || 
                'Có lỗi xảy ra khi gửi yêu cầu thuê. Vui lòng thử lại.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Success Message */}
            {successMessage && (
                <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
                    <span className="text-lg">✓</span>
                    <div className="flex-1">
                        <p className="font-semibold text-green-800">{successMessage}</p>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {errorMessage && (
                <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
                    <span className="text-lg">✕</span>
                    <div className="flex-1">
                        <p className="font-semibold text-red-800">{errorMessage}</p>
                    </div>
                </div>
            )}

            {/* Name Field */}
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                    Tên của bạn <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Nhập tên của bạn"
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm placeholder-slate-400 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
            </div>

            {/* Email Field */}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Email <span className="text-red-500">*</span>
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Nhập email của bạn"
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm placeholder-slate-400 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
            </div>

            {/* Phone Field */}
            <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-700 mb-2">
                    Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    placeholder="Nhập số điện thoại của bạn"
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm placeholder-slate-400 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
            </div>

            <div>
                <label htmlFor="brandName" className="block text-sm font-medium text-slate-700 mb-2">
                    Thương hiệu / Công ty
                </label>
                <input
                    type="text"
                    id="brandName"
                    name="brandName"
                    value={formData.brandName}
                    onChange={handleChange}
                    placeholder="Tên thương hiệu hoặc công ty"
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm placeholder-slate-400 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label htmlFor="contentType" className="block text-sm font-medium text-slate-700 mb-2">
                        Loại hợp tác
                    </label>
                    <select
                        id="contentType"
                        name="contentType"
                        value={formData.contentType}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    >
                        {CONTENT_TYPES.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-slate-700 mb-2">
                        Ngân sách dự kiến (VND)
                    </label>
                    <input
                        type="number"
                        min={0}
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        placeholder="Ví dụ: 5000000"
                        className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm placeholder-slate-400 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="timeline" className="block text-sm font-medium text-slate-700 mb-2">
                    Thời gian triển khai
                </label>
                <input
                    type="text"
                    id="timeline"
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleChange}
                    placeholder="Ví dụ: 01/05 - 15/05"
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm placeholder-slate-400 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
            </div>

            <div>
                <label htmlFor="campaignGoal" className="block text-sm font-medium text-slate-700 mb-2">
                    Mục tiêu chiến dịch
                </label>
                <input
                    type="text"
                    id="campaignGoal"
                    name="campaignGoal"
                    value={formData.campaignGoal}
                    onChange={handleChange}
                    placeholder="Ví dụ: Tăng nhận diện thương hiệu"
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm placeholder-slate-400 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
            </div>

            {/* Message Field */}
            <div>
                <label htmlFor="note" className="block text-sm font-medium text-slate-700 mb-2">
                    Mô tả yêu cầu thuê <span className="text-red-500">*</span>
                </label>
                <textarea
                    id="note"
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder={`Mô tả sản phẩm, deliverables, KPI hoặc yêu cầu riêng khi thuê ${influencerName}...`}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm placeholder-slate-400 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
            </div>

            <p className="text-xs text-slate-500">
                Sau khi gửi, hệ thống sẽ xác nhận yêu cầu và kết nối bạn với influencer phù hợp.
            </p>

            {/* Submit Button */}
            <div className="flex gap-3 pt-2">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Đang gửi...' : 'Gửi yêu cầu thuê'}
                </button>
                <button
                    type="reset"
                    className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                    Xóa
                </button>
            </div>
        </form>
    );
};

export default ContactForm;
