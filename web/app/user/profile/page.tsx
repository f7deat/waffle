"use client";

import PageContainer from "@/components/layout/page-container"
import { apiCurrentUser, apiChangePassword, apiChangeAvatar } from "@/services/user/user";
import { LockOutlined, CameraOutlined, LogoutOutlined, EditOutlined } from "@ant-design/icons";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Page: React.FC = () => {

    const router = useRouter();
    const [user, setUser] = useState<API.User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [isAvatarUploading, setIsAvatarUploading] = useState(false);
    const [avatarError, setAvatarError] = useState("");
    const [avatarSuccess, setAvatarSuccess] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [passwordError, setPasswordError] = useState("");
    const [passwordSuccess, setPasswordSuccess] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await apiCurrentUser();
                setUser(response);
            } catch (error) {
                console.error("Failed to fetch user:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleOpenModal = () => {
        setIsModalOpen(true);
        setPasswordError("");
        setPasswordSuccess("");
        setPasswordForm({
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        });
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setPasswordForm({
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        });
        setPasswordError("");
        setPasswordSuccess("");
    };

    const handlePasswordChange = (field: string, value: string) => {
        setPasswordForm(prev => ({ ...prev, [field]: value }));
        setPasswordError("");
    };

    const handleSubmitPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError("");
        setPasswordSuccess("");

        // Validation
        if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
            setPasswordError("Vui lòng điền đầy đủ thông tin");
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            setPasswordError("Mật khẩu mới phải có ít nhất 6 ký tự");
            return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordError("Mật khẩu mới không khớp");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await apiChangePassword({
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            });

            if (response.succeeded) {
                setPasswordSuccess("Đổi mật khẩu thành công!");
                setTimeout(() => {
                    handleCloseModal();
                }, 2000);
            } else {
                setPasswordError(response.message || "Đổi mật khẩu thất bại");
            }
        } catch (error: any) {
            setPasswordError(error.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAvatarButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith("image/")) {
                setAvatarError("Vui lòng chọn một tệp hình ảnh");
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setAvatarError("Kích thước hình ảnh không được vượt quá 5MB");
                return;
            }

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                const preview = e.target?.result as string;
                setAvatarPreview(preview);
                setIsAvatarModalOpen(true);
                setAvatarError("");
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAvatarModalClose = () => {
        setIsAvatarModalOpen(false);
        setAvatarPreview(null);
        setAvatarError("");
        setAvatarSuccess("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleAvatarSubmit = async () => {
        if (!avatarPreview || !fileInputRef.current?.files?.[0]) {
            setAvatarError("Vui lòng chọn một hình ảnh");
            return;
        }

        setIsAvatarUploading(true);
        setAvatarError("");
        setAvatarSuccess("");

        try {
            const formData = new FormData();
            formData.append("file", fileInputRef.current.files[0]);

            const response = await apiChangeAvatar(formData);

            if (response.succeeded) {
                setAvatarSuccess("Cập nhật avatar thành công!");
                // Refresh user data to show new avatar
                const updatedUser = await apiCurrentUser();
                setUser(updatedUser);
                setTimeout(() => {
                    handleAvatarModalClose();
                }, 1500);
            } else {
                setAvatarError(response.message || "Cập nhật avatar thất bại");
            }
        } catch (error: any) {
            setAvatarError(error.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại");
        } finally {
            setIsAvatarUploading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        router.push("/user/login");
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

    if (!user) {
        return (
            <PageContainer>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy thông tin người dùng</h2>
                        <p className="text-gray-600">Vui lòng <Link href="/user/login" className="text-blue-600 hover:underline">đăng nhập</Link> để xem hồ sơ của bạn.</p>
                    </div>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <div className="max-w-4xl mx-auto py-8 px-4">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-32"></div>
                    <div className="px-6 pb-6">
                        <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 mb-4">
                            {/* Avatar */}
                            <div className="relative group">
                                {user.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={user.name || user.userName}
                                        className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                        <span className="text-4xl font-bold text-white">
                                            {(user.name || user.userName).charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                                {/* Avatar Upload Overlay */}
                                <button
                                    onClick={handleAvatarButtonClick}
                                    className="absolute inset-0 w-32 h-32 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100"
                                    title="Đổi avatar"
                                >
                                    <CameraOutlined className="text-white text-2xl" />
                                </button>
                            </div>
                            
                            {/* Name and Username */}
                            <div className="sm:ml-6 mt-4 sm:mt-0 text-center sm:text-left flex-1">
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {user.name || user.userName}
                                </h1>
                                {user.name && (
                                    <p className="text-gray-600 mt-1">@{user.userName}</p>
                                )}
                                {/* Roles */}
                                {user.roles && user.roles.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
                                        {user.roles.map((role) => (
                                            <span
                                                key={role}
                                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                            >
                                                {role}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-4 sm:mt-0 flex gap-2">
                                <Link href="/user/profile/center" className="px-4 hover:text-white py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium inline-block">
                                    <EditOutlined /> Chỉnh sửa hồ sơ
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Information */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">
                        Thông tin cá nhân
                    </h2>
                    
                    <div className="space-y-4">
                        {/* Email */}
                        <div className="flex flex-col sm:flex-row sm:items-center">
                            <div className="w-full sm:w-1/3 text-gray-600 font-medium mb-1 sm:mb-0">
                                Email
                            </div>
                            <div className="w-full sm:w-2/3 flex items-center gap-2">
                                <span className="text-gray-900">{user.email || "Chưa cập nhật"}</span>
                                {user.email && user.emailConfirmed && (
                                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                                        ✓ Đã xác thực
                                    </span>
                                )}
                                {user.email && !user.emailConfirmed && (
                                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                        Chưa xác thực
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Phone Number */}
                        <div className="flex flex-col sm:flex-row sm:items-center">
                            <div className="w-full sm:w-1/3 text-gray-600 font-medium mb-1 sm:mb-0">
                                Số điện thoại
                            </div>
                            <div className="w-full sm:w-2/3">
                                <span className="text-gray-900">{user.phoneNumber || "Chưa cập nhật"}</span>
                            </div>
                        </div>

                        {/* User ID */}
                        <div className="flex flex-col sm:flex-row sm:items-center">
                            <div className="w-full sm:w-1/3 text-gray-600 font-medium mb-1 sm:mb-0">
                                ID người dùng
                            </div>
                            <div className="w-full sm:w-2/3">
                                <code className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-800">
                                    {user.id}
                                </code>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">
                        Bảo mật
                    </h2>
                    
                    <div className="space-y-3">
                        <button 
                            onClick={handleOpenModal}
                            className="w-full sm:w-auto px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                           <LockOutlined /> Đổi mật khẩu
                        </button>
                        <button 
                            onClick={handleLogout}
                            className="w-full sm:w-auto px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors font-medium ml-0 sm:ml-2"
                        >
                           <LogoutOutlined /> Đăng xuất
                        </button>
                    </div>
                </div>
            </div>

            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarFileChange}
                className="hidden"
            />

            {/* Change Password Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900">Đổi mật khẩu</h3>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmitPassword}>
                            <div className="space-y-4">
                                {/* Current Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Mật khẩu hiện tại
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordForm.currentPassword}
                                        onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                {/* New Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Mật khẩu mới
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordForm.newPassword}
                                        onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                        minLength={6}
                                    />
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Xác nhận mật khẩu mới
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordForm.confirmPassword}
                                        onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                {/* Error Message */}
                                {passwordError && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                        {passwordError}
                                    </div>
                                )}

                                {/* Success Message */}
                                {passwordSuccess && (
                                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                                        {passwordSuccess}
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
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
                                        {isSubmitting ? "Đang xử lý..." : "Đổi mật khẩu"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Change Avatar Modal */}
            {isAvatarModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900">Đổi avatar</h3>
                            <button
                                onClick={handleAvatarModalClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                disabled={isAvatarUploading}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Avatar Preview */}
                            {avatarPreview && (
                                <div className="flex justify-center">
                                    <img
                                        src={avatarPreview}
                                        alt="Avatar preview"
                                        className="w-40 h-40 rounded-full object-cover border-2 border-gray-300"
                                    />
                                </div>
                            )}

                            {/* Error Message */}
                            {avatarError && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                    {avatarError}
                                </div>
                            )}

                            {/* Success Message */}
                            {avatarSuccess && (
                                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                                    {avatarSuccess}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={handleAvatarModalClose}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                    disabled={isAvatarUploading}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="button"
                                    onClick={handleAvatarSubmit}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isAvatarUploading}
                                >
                                    {isAvatarUploading ? "Đang tải..." : "Cập nhật"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </PageContainer>
    )
}

export default Page