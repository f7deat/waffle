"use client";

import PageContainer from "@/components/layout/page-container"
import { apiCurrentUser, apiUpdateProfile } from "@/services/user/user";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ProfileEditPage: React.FC = () => {

    const router = useRouter();
    const [user, setUser] = useState<API.User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phoneNumber: ""
    });

    const [formErrors, setFormErrors] = useState({
        name: "",
        email: "",
        phoneNumber: ""
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await apiCurrentUser();
                setUser(response);
                setFormData({
                    name: response.name || "",
                    email: response.email || "",
                    phoneNumber: response.phoneNumber || ""
                });
            } catch (error) {
                console.error("Failed to fetch user:", error);
                setErrorMessage("Không thể tải thông tin người dùng");
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const validateForm = (): boolean => {
        const errors: typeof formErrors = {
            name: "",
            email: "",
            phoneNumber: ""
        };

        if (!formData.name.trim()) {
            errors.name = "Vui lòng nhập họ và tên";
        }

        if (!formData.email.trim()) {
            errors.email = "Vui lòng nhập email";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = "Email không hợp lệ";
        }

        if (formData.phoneNumber && !/^\d{10,11}$/.test(formData.phoneNumber.replace(/\D/g, ""))) {
            errors.phoneNumber = "Số điện thoại phải có 10-11 chữ số";
        }

        setFormErrors(errors);
        return !Object.values(errors).some(error => error);
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (formErrors[field as keyof typeof formErrors]) {
            setFormErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await apiUpdateProfile({
                name: formData.name,
                email: formData.email,
                phoneNumber: formData.phoneNumber
            });

            if (response.succeeded) {
                setSuccessMessage("Cập nhật hồ sơ thành công!");
                setTimeout(() => {
                    router.push("/user/profile");
                }, 1500);
            } else {
                setErrorMessage(response.message || "Cập nhật hồ sơ thất bại");
            }
        } catch (error: any) {
            setErrorMessage(error.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        router.push("/user/profile");
    };

    if (loading) {
        return (
            <PageContainer>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <div className="max-w-2xl mx-auto py-8 px-4">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors mb-4"
                    >
                        <ArrowLeftOutlined /> Quay lại
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Chỉnh sửa hồ sơ cá nhân</h1>
                </div>

                {/* Form Container */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            {/* Name Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Họ và tên
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                                        formErrors.name
                                            ? "border-red-300 focus:ring-red-500"
                                            : "border-gray-300 focus:ring-blue-500"
                                    }`}
                                    placeholder="Nhập họ và tên"
                                />
                                {formErrors.name && (
                                    <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                                )}
                            </div>

                            {/* Email Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                                        formErrors.email
                                            ? "border-red-300 focus:ring-red-500"
                                            : "border-gray-300 focus:ring-blue-500"
                                    }`}
                                    placeholder="Nhập email"
                                />
                                {formErrors.email && (
                                    <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                                )}
                            </div>

                            {/* Phone Number Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Số điện thoại
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phoneNumber}
                                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                                        formErrors.phoneNumber
                                            ? "border-red-300 focus:ring-red-500"
                                            : "border-gray-300 focus:ring-blue-500"
                                    }`}
                                    placeholder="Nhập số điện thoại (10-11 chữ số)"
                                />
                                {formErrors.phoneNumber && (
                                    <p className="mt-1 text-sm text-red-600">{formErrors.phoneNumber}</p>
                                )}
                            </div>

                            {/* Error Message */}
                            {errorMessage && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                                    {errorMessage}
                                </div>
                            )}

                            {/* Success Message */}
                            {successMessage && (
                                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                                    {successMessage}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                    disabled={isSubmitting}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </PageContainer>
    )
}

export default ProfileEditPage
