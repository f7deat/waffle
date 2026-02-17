'use client';

import { apiContactSubmit } from "@/services/contact";
import { useState } from "react";

interface ContactFormProps {
    influencerName: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ influencerName }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        note: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

        try {
            const response = await apiContactSubmit(formData);
            
            if (response.data && response.succeeded === true) {
                setSuccessMessage('Gửi tin nhắn thành công! Chúng tôi sẽ phản hồi sớm.');
                setFormData({
                    name: '',
                    email: '',
                    phoneNumber: '',
                    note: '',
                });
                // Clear success message after 5 seconds
                setTimeout(() => setSuccessMessage(''), 5000);
            } else {
                setErrorMessage('Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại.');
            }
        } catch (error: any) {
            console.error('Failed to submit contact form:', error);
            setErrorMessage(
                error?.response?.data?.message || 
                'Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại.'
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

            {/* Message Field */}
            <div>
                <label htmlFor="note" className="block text-sm font-medium text-slate-700 mb-2">
                    Tin nhắn <span className="text-red-500">*</span>
                </label>
                <textarea
                    id="note"
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder={`Gửi lời chào hoặc thắc mắc cho ${influencerName}...`}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm placeholder-slate-400 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-2">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Đang gửi...' : 'Gửi tin nhắn'}
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
