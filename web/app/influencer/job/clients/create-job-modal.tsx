"use client";

import { apiInfluencerJobCreate } from "@/services/kol/kol";
import { useState } from "react";

const CONTENT_TYPES = [
    { label: "Ảnh (Photo)", value: 0 },
    { label: "Video", value: 1 },
    { label: "Story", value: 2 },
    { label: "Reel", value: 3 },
    { label: "Hỗn hợp (Mixed)", value: 4 },
];

const CATEGORIES = [
    "Ẩm thực", "Du lịch", "Làm đẹp", "Thời trang", "Phong cách sống",
    "Công nghệ", "Thể thao", "Sức khỏe", "Gia đình", "Giải trí",
];

interface Props {
    onSuccess: () => void;
    onClose: () => void;
}

const CreateJobModal: React.FC<Props> = ({ onSuccess, onClose }) => {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState<API.CreateInfluencerJobRequest>({
        title: "",
        description: "",
        budget: 0,
        contentType: 0,
        category: "",
        brand: "",
    });

    const handleChange = (field: keyof API.CreateInfluencerJobRequest, value: string | number) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title.trim()) { setError("Vui lòng nhập tiêu đề công việc."); return; }
        if (form.budget <= 0) { setError("Vui lòng nhập ngân sách hợp lệ."); return; }
        setSubmitting(true);
        setError("");
        try {
            const res = await apiInfluencerJobCreate(form);
            if (res.succeeded) {
                onSuccess();
            } else {
                setError(res.message || "Đã xảy ra lỗi.");
            }
        } catch {
            setError("Không thể kết nối đến máy chủ.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-y-auto max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between border-b px-6 py-4">
                    <h2 className="text-xl font-bold text-gray-900">Tạo công việc mới</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề công việc <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={e => handleChange("title", e.target.value)}
                            placeholder="VD: Cần influencer review sản phẩm mỹ phẩm mới"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Brand */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Thương hiệu / Công ty</label>
                        <input
                            type="text"
                            value={form.brand || ""}
                            onChange={e => handleChange("brand", e.target.value)}
                            placeholder="Tên thương hiệu hoặc công ty của bạn"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả chi tiết</label>
                        <textarea
                            value={form.description}
                            onChange={e => handleChange("description", e.target.value)}
                            rows={4}
                            placeholder="Mô tả yêu cầu, sản phẩm/dịch vụ, mục tiêu chiến dịch..."
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                    </div>

                    {/* Budget */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ngân sách (₫) <span className="text-red-500">*</span></label>
                            <input
                                type="number"
                                min={0}
                                value={form.budget || ""}
                                onChange={e => handleChange("budget", Number(e.target.value))}
                                placeholder="500000"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ngân sách tối đa (₫)</label>
                            <input
                                type="number"
                                min={0}
                                value={form.budgetMax || ""}
                                onChange={e => handleChange("budgetMax", Number(e.target.value))}
                                placeholder="2000000"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Content Type & Category */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Loại nội dung</label>
                            <select
                                value={form.contentType}
                                onChange={e => handleChange("contentType", Number(e.target.value))}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                {CONTENT_TYPES.map(ct => (
                                    <option key={ct.value} value={ct.value}>{ct.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Lĩnh vực</label>
                            <select
                                value={form.category || ""}
                                onChange={e => handleChange("category", e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value="">-- Chọn lĩnh vực --</option>
                                {CATEGORIES.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Deadline & Required followers */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Hạn chót</label>
                            <input
                                type="date"
                                value={form.deadline || ""}
                                onChange={e => handleChange("deadline", e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Số followers tối thiểu</label>
                            <input
                                type="number"
                                min={0}
                                value={form.requiredFollowers || ""}
                                onChange={e => handleChange("requiredFollowers", Number(e.target.value))}
                                placeholder="10000"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {error && (
                        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
                        >
                            {submitting ? "Đang tạo..." : "Tạo công việc"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateJobModal;
