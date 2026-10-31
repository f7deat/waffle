"use client";

import PageContainer from "@/components/layout/page-container"
import {
    apiCurrentUser,
    apiProfileDetail,
    apiChangePassword,
    apiChangeAvatar,
    apiTopupProfile,
    apiWalletTopupStatus,
    apiMyWalletWithdrawals,
    apiWithdrawProfile,
} from "@/services/user/user";
import { apiInfluencerMyApplications } from "@/services/kol/kol";
import { apiMyOrders } from "@/services/shop/order";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MyOrderItem, MyOrderStatus } from "@/services/shop/typings";
import { faCamera, faEdit, faLock, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ROLE_NAMES = {
    Admin: "admin",
    Member: "member",
    Influencer: "influencer",
    Business: "business",
} as const;

const ROLE_LABELS: Record<string, string> = {
    [ROLE_NAMES.Admin]: "Quản trị viên",
    [ROLE_NAMES.Member]: "Thành viên",
    [ROLE_NAMES.Influencer]: "Nhà sáng tạo",
    [ROLE_NAMES.Business]: "Doanh nghiệp",
};

const Page: React.FC = () => {

    const router = useRouter();
    const [user, setUser] = useState<API.User | null>(null);
    const [profileDetail, setProfileDetail] = useState<API.ProfileDetail | null>(null);
    const [profileDetailLoading, setProfileDetailLoading] = useState(true);
    const [profileDetailError, setProfileDetailError] = useState(false);
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
    const [isTopupModalOpen, setIsTopupModalOpen] = useState(false);
    const [topupForm, setTopupForm] = useState({ amount: "", note: "" });
    const [topupError, setTopupError] = useState("");
    const [isTopupSubmitting, setIsTopupSubmitting] = useState(false);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [withdrawForm, setWithdrawForm] = useState({
        amount: "",
        bankName: "",
        accountHolder: "",
        accountNumber: "",
        note: "",
    });
    const [withdrawError, setWithdrawError] = useState("");
    const [withdrawSuccess, setWithdrawSuccess] = useState("");
    const [isWithdrawSubmitting, setIsWithdrawSubmitting] = useState(false);
    const [walletNotice, setWalletNotice] = useState<{ type: "success" | "info" | "error"; text: string } | null>(null);
    const [myWithdrawals, setMyWithdrawals] = useState<API.WalletWithdrawalRequest[]>([]);
    const [myWithdrawalsError, setMyWithdrawalsError] = useState(false);
    const [myOrders, setMyOrders] = useState<MyOrderItem[]>([]);
    const [myOrdersLoading, setMyOrdersLoading] = useState(true);
    const [myOrdersError, setMyOrdersError] = useState(false);
    const [appliedJobs, setAppliedJobs] = useState<API.MyAppliedInfluencerJobItem[]>([]);
    const [appliedJobsLoading, setAppliedJobsLoading] = useState(true);
    const [appliedJobsError, setAppliedJobsError] = useState(false);
    const isInfluencer = !!user?.roles?.some((role) => role.toLowerCase() === ROLE_NAMES.Influencer);

    const formatMoney = (value: number) => new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(value);

    const getApplicationStatus = (status: API.InfluencerJobApplicationStatus | number) => {
        if (status === "Approved" || status === 1) return { text: "Đã duyệt", className: "bg-green-100 text-green-700" };
        if (status === "Rejected" || status === 2) return { text: "Từ chối", className: "bg-red-100 text-red-700" };
        return { text: "Chờ duyệt", className: "bg-yellow-100 text-yellow-700" };
    };

    const getOrderStatus = (status: MyOrderStatus) => {
        if (status === "Confirmed" || status === 1) return { text: "Đã xác nhận", className: "bg-blue-100 text-blue-700" };
        if (status === "Paid" || status === 2) return { text: "Đã thanh toán", className: "bg-green-100 text-green-700" };
        if (status === "Refunded" || status === 3) return { text: "Đã hoàn tiền", className: "bg-slate-100 text-slate-700" };
        if (status === "Cancelled" || status === 4) return { text: "Đã hủy", className: "bg-red-100 text-red-700" };
        return { text: "Mới tạo", className: "bg-yellow-100 text-yellow-700" };
    };

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

    useEffect(() => {
        let isActive = true;
        apiProfileDetail()
            .then((response) => {
                if (isActive) setProfileDetail(response);
            })
            .catch((error) => {
                console.error("Failed to fetch profile details:", error);
                if (isActive) setProfileDetailError(true);
            })
            .finally(() => {
                if (isActive) setProfileDetailLoading(false);
            });
        return () => {
            isActive = false;
        };
    }, []);

    useEffect(() => {
        const fetchMyOrders = async () => {
            try {
                const response = await apiMyOrders({ current: 1, pageSize: 6 });
                setMyOrders(response.data || []);
            } catch (error) {
                console.error("Failed to fetch my orders:", error);
                setMyOrdersError(true);
            } finally {
                setMyOrdersLoading(false);
            }
        };
        fetchMyOrders();
    }, []);

    useEffect(() => {
        if (!user?.id) return;
        let isActive = true;
        apiMyWalletWithdrawals({ current: 1, pageSize: 5 })
            .then((response) => {
                if (isActive) setMyWithdrawals(response.data || []);
            })
            .catch((error) => {
                console.error("Failed to fetch wallet withdrawals:", error);
                if (isActive) setMyWithdrawalsError(true);
            });
        return () => {
            isActive = false;
        };
    }, [user?.id]);

    useEffect(() => {
        if (!user?.id || typeof window === "undefined") return;
        const params = new URLSearchParams(window.location.search);
        const callbackType = params.get("walletTopup");
        if (!callbackType) return;

        if (callbackType === "cancel") {
            setWalletNotice({ type: "info", text: "Bạn đã hủy thanh toán. Số dư ví chưa thay đổi." });
            router.replace("/user/profile");
            return;
        }

        const orderCode = Number(params.get("orderCode"));
        if (callbackType !== "return" || !Number.isSafeInteger(orderCode) || orderCode <= 0) {
            setWalletNotice({ type: "error", text: "Không thể xác định giao dịch nạp tiền vừa thực hiện." });
            router.replace("/user/profile");
            return;
        }

        let isActive = true;
        let timeout: ReturnType<typeof setTimeout> | undefined;
        let attempts = 0;
        const pollPaymentStatus = async () => {
            try {
                const response = await apiWalletTopupStatus(orderCode);
                if (!isActive) return;
                const status = response.data?.status;
                if (response.succeeded && status === "Paid") {
                    setUser(await apiCurrentUser());
                    setWalletNotice({ type: "success", text: "Thanh toán đã xác nhận và số dư ví đã được cập nhật." });
                    router.replace("/user/profile");
                    return;
                }
                if (status === "Failed" || status === "Cancelled" || status === "Expired") {
                    setWalletNotice({ type: "info", text: "Giao dịch chưa hoàn tất. Số dư ví chưa thay đổi." });
                    router.replace("/user/profile");
                    return;
                }
                attempts += 1;
                if (attempts < 8) {
                    timeout = setTimeout(pollPaymentStatus, 2000);
                } else {
                    setWalletNotice({ type: "info", text: "PayOS đang xác nhận giao dịch. Số dư sẽ được cập nhật sau khi hệ thống nhận thông báo thanh toán." });
                    router.replace("/user/profile");
                }
            } catch (error) {
                console.error("Failed to check wallet top-up status:", error);
                if (isActive) {
                    setWalletNotice({ type: "error", text: "Chưa thể kiểm tra trạng thái thanh toán. Vui lòng tải lại trang sau ít phút." });
                    router.replace("/user/profile");
                }
            }
        };
        pollPaymentStatus();
        return () => {
            isActive = false;
            clearTimeout(timeout);
        };
    }, [user?.id, router]);

    useEffect(() => {
        if (!user?.id || !isInfluencer) {
            setAppliedJobs([]);
            setAppliedJobsError(false);
            setAppliedJobsLoading(false);
            return;
        }

        let isActive = true;
        setAppliedJobsError(false);
        setAppliedJobsLoading(true);
        const fetchAppliedJobs = async () => {
            try {
                const response = await apiInfluencerMyApplications({ current: 1, pageSize: 6 });
                if (isActive) setAppliedJobs(response.data || []);
            } catch (error) {
                console.error("Failed to fetch applied jobs:", error);
                if (isActive) setAppliedJobsError(true);
            } finally {
                if (isActive) setAppliedJobsLoading(false);
            }
        };
        fetchAppliedJobs();
        return () => {
            isActive = false;
        };
    }, [user?.id, isInfluencer]);

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
        router.push("/user/login");
    };

    const handleOpenWithdrawModal = () => {
        setIsWithdrawModalOpen(true);
        setWithdrawError("");
        setWithdrawSuccess("");
        setWithdrawForm({ amount: "", bankName: "", accountHolder: "", accountNumber: "", note: "" });
    };

    const handleCloseWithdrawModal = () => {
        if (isWithdrawSubmitting) return;
        setIsWithdrawModalOpen(false);
        setWithdrawError("");
        setWithdrawSuccess("");
        setWithdrawForm({ amount: "", bankName: "", accountHolder: "", accountNumber: "", note: "" });
    };

    const handleSubmitWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
        setWithdrawError("");
        setWithdrawSuccess("");

        const amount = Number(withdrawForm.amount);
        if (!Number.isSafeInteger(amount) || amount < 1000) {
            setWithdrawError("Số tiền rút phải là số nguyên từ 1.000 VND trở lên.");
            return;
        }

        if (user && amount > Number(user.amount || 0)) {
            setWithdrawError("Số dư không đủ để thực hiện rút tiền");
            return;
        }

        setIsWithdrawSubmitting(true);
        try {
            const response = await apiWithdrawProfile({
                amount,
                bankName: withdrawForm.bankName.trim(),
                accountHolder: withdrawForm.accountHolder.trim(),
                accountNumber: withdrawForm.accountNumber.trim(),
                note: withdrawForm.note.trim() || undefined,
            });

            if (response?.succeeded) {
                const updatedUser = await apiCurrentUser();
                setUser(updatedUser);
                const updatedWithdrawals = await apiMyWalletWithdrawals({ current: 1, pageSize: 5 });
                setMyWithdrawals(updatedWithdrawals.data || []);
                setWalletNotice({
                    type: "success",
                    text: "Đã gửi yêu cầu rút tiền. Số tiền được giữ chỗ trong ví và sẽ được hoàn lại nếu yêu cầu bị từ chối.",
                });
                setWithdrawSuccess("Yêu cầu đang chờ quản trị viên xử lý.");
                setTimeout(() => {
                    handleCloseWithdrawModal();
                }, 1200);
            } else {
                setWithdrawError(response?.message || "Rút tiền thất bại");
            }
        } catch (error: any) {
            setWithdrawError(error.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại");
        } finally {
            setIsWithdrawSubmitting(false);
        }
    };

    const handleOpenTopupModal = () => {
        setIsTopupModalOpen(true);
        setTopupError("");
        setTopupForm({ amount: "", note: "" });
    };

    const handleCloseTopupModal = () => {
        if (isTopupSubmitting) return;
        setIsTopupModalOpen(false);
        setTopupError("");
        setTopupForm({ amount: "", note: "" });
    };

    const handleSubmitTopup = async (e: React.FormEvent) => {
        e.preventDefault();
        setTopupError("");

        const amount = Number(topupForm.amount);
        if (!Number.isSafeInteger(amount) || amount < 1000 || amount > 2147483647) {
            setTopupError("Số tiền nạp phải là số nguyên từ 1.000 VND trở lên.");
            return;
        }

        setIsTopupSubmitting(true);
        try {
            const response = await apiTopupProfile({
                amount,
                note: topupForm.note.trim() || undefined,
            });

            if (response?.succeeded && response.data?.checkoutUrl) {
                window.location.assign(response.data.checkoutUrl);
            } else {
                setTopupError(response?.message || "Không thể tạo liên kết thanh toán.");
            }
        } catch (error: any) {
            setTopupError(error.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại");
        } finally {
            setIsTopupSubmitting(false);
        }
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

    const userRoles = user.roles || [];
    const hasRole = (roleName: string) => userRoles.some((role) => role.toLowerCase() === roleName);
    const isBusiness = hasRole(ROLE_NAMES.Business);
    const isAdmin = hasRole(ROLE_NAMES.Admin);
    const isMember = hasRole(ROLE_NAMES.Member) || userRoles.length === 0;
    const primaryRole = isAdmin
        ? ROLE_NAMES.Admin
        : isBusiness
            ? ROLE_NAMES.Business
            : isInfluencer
                ? ROLE_NAMES.Influencer
                : ROLE_NAMES.Member;
    const profileRoleDescription = {
        [ROLE_NAMES.Admin]: "Quản lý tài khoản và hoạt động trên nền tảng.",
        [ROLE_NAMES.Business]: "Không gian quản lý thông tin doanh nghiệp và kết nối khách hàng.",
        [ROLE_NAMES.Influencer]: "Không gian dành cho nhà sáng tạo nội dung và đối tác thương hiệu.",
        [ROLE_NAMES.Member]: "Theo dõi thông tin cá nhân, đơn hàng và các hoạt động của bạn.",
    }[primaryRole];

    return (
        <PageContainer>
            <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                <nav aria-label="Điều hướng" className="flex items-center gap-2 text-sm text-gray-500">
                    <Link href="/" className="transition-colors hover:text-emerald-700">Trang chủ</Link>
                    <span aria-hidden="true">/</span>
                    <span className="font-medium text-gray-800">Hồ sơ cá nhân</span>
                </nav>
                {/* Header */}
                <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                    <div className="relative h-36 overflow-hidden bg-gradient-to-r from-emerald-800 via-teal-700 to-amber-600 sm:h-44">
                        {profileDetail?.coverImage && (
                            <img
                                src={profileDetail.coverImage}
                                alt=""
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/75 via-teal-900/35 to-transparent" />
                        <div className="absolute bottom-5 left-6 text-white sm:left-8">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">Tài khoản của tôi</p>
                            <p className="mt-1 text-sm text-white/90">{ROLE_LABELS[primaryRole]} · Hồ sơ &amp; hoạt động</p>
                        </div>
                    </div>
                    <div className="px-5 pb-6 sm:px-8">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                            {/* Avatar */}
                            <div className="relative -mt-12 flex items-end gap-4 sm:-mt-14">
                                <div className="group relative shrink-0">
                                    {user.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt={user.name || user.userName}
                                            className="h-24 w-24 rounded-full border-4 border-white bg-white object-cover shadow-lg sm:h-28 sm:w-28"
                                        />
                                    ) : (
                                        <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-emerald-600 to-amber-500 shadow-lg sm:h-28 sm:w-28">
                                            <span className="text-3xl font-bold text-white sm:text-4xl">
                                                {(user.name || user.userName).charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                    <button
                                        onClick={handleAvatarButtonClick}
                                        className="absolute inset-0 flex h-full w-full items-center justify-center rounded-full bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/40 group-hover:opacity-100 group-focus-within:opacity-100"
                                        title="Đổi avatar"
                                        aria-label="Đổi ảnh đại diện"
                                    >
                                        <FontAwesomeIcon icon={faCamera} className="text-2xl text-white" />
                                    </button>
                                </div>
                            
                            {/* Name and Username */}
                                <div className="min-w-0 pb-1 text-center sm:pb-2 sm:text-left">
                                    <h1 className="break-words text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                                        {user.name || user.userName}
                                    </h1>
                                    <p className="mt-1 text-sm text-gray-500">@{user.userName}</p>
                                    {(profileDetail?.tagline || profileDetail?.provinceName) && (
                                        <p className="mt-2 text-sm text-gray-600">
                                            {[profileDetail.tagline, profileDetail.provinceName].filter(Boolean).join(" · ")}
                                        </p>
                                    )}
                                    <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                                        {(userRoles.length > 0 ? userRoles : [ROLE_NAMES.Member]).map((role) => (
                                            <span
                                                key={role}
                                                className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-inset ring-emerald-200"
                                            >
                                                {ROLE_LABELS[role.toLowerCase()] || role}
                                            </span>
                                        ))}
                                    </div>
                                    {profileDetail && (
                                        <div className="mt-3 max-w-md">
                                            <div className="mb-1 flex justify-between text-xs text-gray-500">
                                                <span>Hoàn thiện hồ sơ</span>
                                                <span className="font-semibold text-gray-700">{profileDetail.completeness}%</span>
                                            </div>
                                            <div
                                                className="h-1.5 overflow-hidden rounded-full bg-gray-100"
                                                role="progressbar"
                                                aria-label="Mức độ hoàn thiện hồ sơ"
                                                aria-valuemin={0}
                                                aria-valuemax={100}
                                                aria-valuenow={profileDetail.completeness}
                                            >
                                                <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-amber-400" style={{ width: `${profileDetail.completeness}%` }} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap justify-center gap-2 sm:justify-end">
                                <Link href="/user/profile/center" className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-5 py-2.5 font-medium text-white transition-colors hover:bg-emerald-800">
                                    <FontAwesomeIcon icon={faEdit} /> Chỉnh sửa hồ sơ
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2-column grid */}
                <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
                {/* Left column */}
                <div className="flex flex-col gap-6 lg:col-span-5">
                <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Không gian của bạn</p>
                            <h2 className="mt-1 text-xl font-bold text-gray-900">{ROLE_LABELS[primaryRole]}</h2>
                            <p className="mt-1 text-sm leading-6 text-gray-600">{profileRoleDescription}</p>
                        </div>
                        <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-lg font-bold text-emerald-800 sm:flex">
                            {ROLE_LABELS[primaryRole].charAt(0)}
                        </span>
                    </div>

                    <div className="mt-5 grid gap-3">
                        {isInfluencer && (
                            <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-4">
                                <div className="flex items-center justify-between gap-3">
                                    <h3 className="font-semibold text-emerald-950">Hồ sơ nhà sáng tạo</h3>
                                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${profileDetailLoading || profileDetailError ? "bg-gray-100 text-gray-600" : profileDetail?.influencer?.isOpenForBooking ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600"}`}>
                                        {profileDetailLoading
                                            ? "Đang tải..."
                                            : profileDetailError
                                                ? "Chưa tải được trạng thái"
                                            : profileDetail?.influencer?.isOpenForBooking
                                                ? "Đang nhận hợp tác"
                                                : "Chưa mở nhận hợp tác"}
                                    </span>
                                </div>
                                <div className="mt-3 space-y-2 text-sm text-gray-700">
                                    <p>{profileDetail?.influencer?.bookingEmail || profileDetail?.influencer?.bookingPhone
                                        ? `Liên hệ hợp tác: ${[profileDetail.influencer.bookingEmail, profileDetail.influencer.bookingPhone].filter(Boolean).join(" · ")}`
                                        : "Thêm thông tin liên hệ để nhãn hàng có thể kết nối với bạn."}</p>
                                    <p>{profileDetail?.socialAccounts?.length
                                        ? `${profileDetail.socialAccounts.length} kênh mạng xã hội đã liên kết`
                                        : "Chưa liên kết kênh mạng xã hội."}</p>
                                    {profileDetail?.socialAccounts?.length ? (
                                        <div className="flex flex-wrap gap-2 pt-1">
                                            {profileDetail.socialAccounts.map((account) => (
                                                <span key={account.socialPlatformId} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 ring-1 ring-emerald-100">
                                                    {account.socialPlatformName}
                                                    {account.followersCount != null ? ` · ${new Intl.NumberFormat("vi-VN").format(account.followersCount)} followers` : ""}
                                                </span>
                                            ))}
                                        </div>
                                    ) : null}
                                </div>
                                <Link href="/influencer/job" className="mt-4 inline-flex text-sm font-semibold text-emerald-800 hover:text-emerald-950">
                                    Khám phá cơ hội hợp tác <span aria-hidden="true" className="ml-1">→</span>
                                </Link>
                            </div>
                        )}

                        {isBusiness && (
                            <div className="rounded-xl border border-amber-100 bg-amber-50/70 p-4">
                                <div className="flex items-center justify-between gap-3">
                                    <h3 className="font-semibold text-amber-950">Hồ sơ doanh nghiệp</h3>
                                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${profileDetailLoading || profileDetailError ? "bg-gray-100 text-gray-600" : profileDetail?.business?.isVerified ? "bg-emerald-100 text-emerald-800" : "bg-white text-amber-800 ring-1 ring-amber-200"}`}>
                                        {profileDetailLoading
                                            ? "Đang tải..."
                                            : profileDetailError
                                                ? "Chưa tải được trạng thái"
                                            : profileDetail?.business?.isVerified
                                                ? "Đã xác minh"
                                                : "Chưa xác minh"}
                                    </span>
                                </div>
                                <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                                    <div>
                                        <dt className="text-gray-500">Tên doanh nghiệp</dt>
                                        <dd className="font-medium text-gray-900">{profileDetail?.business?.companyName || "Chưa cập nhật"}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-gray-500">Lĩnh vực</dt>
                                        <dd className="font-medium text-gray-900">{profileDetail?.business?.businessType || "Chưa cập nhật"}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-gray-500">Người đại diện</dt>
                                        <dd className="font-medium text-gray-900">{profileDetail?.business?.representativeName || "Chưa cập nhật"}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-gray-500">Liên hệ</dt>
                                        <dd className="break-all font-medium text-gray-900">
                                            {[profileDetail?.business?.contactEmail, profileDetail?.business?.contactPhone].filter(Boolean).join(" · ") || "Chưa cập nhật"}
                                        </dd>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <dt className="text-gray-500">Địa chỉ</dt>
                                        <dd className="font-medium text-gray-900">{profileDetail?.business?.businessAddress || "Chưa cập nhật"}</dd>
                                    </div>
                                </dl>
                                <Link href="/user/profile/center" className="mt-4 inline-flex text-sm font-semibold text-amber-900 hover:text-amber-950">
                                    Cập nhật thông tin doanh nghiệp <span aria-hidden="true" className="ml-1">→</span>
                                </Link>
                            </div>
                        )}

                        {isAdmin && (
                            <div className="rounded-xl border border-violet-100 bg-violet-50/70 p-4">
                                <h3 className="font-semibold text-violet-950">Tài khoản quản trị</h3>
                                <p className="mt-2 text-sm leading-6 text-violet-900/80">
                                    Hồ sơ này có quyền quản trị. Các thông tin cá nhân và bảo mật vẫn được quản lý tại đây.
                                </p>
                            </div>
                        )}

                        {isMember && (
                            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                                <h3 className="font-semibold text-gray-900">Hoạt động thành viên</h3>
                                <p className="mt-2 text-sm leading-6 text-gray-600">
                                    {profileDetail?.provinceName
                                        ? `Khu vực quan tâm: ${profileDetail.provinceName}. `
                                        : ""}
                                    {profileDetail?.tags?.length
                                        ? `Chủ đề bạn quan tâm: ${profileDetail.tags.map((tag) => tag.name).join(", ")}.`
                                        : "Cập nhật sở thích và khu vực hoạt động để cá nhân hóa trải nghiệm của bạn."}
                                </p>
                                <Link href="/shop" className="mt-4 inline-flex text-sm font-semibold text-emerald-800 hover:text-emerald-950">
                                    Khám phá cửa hàng <span aria-hidden="true" className="ml-1">→</span>
                                </Link>
                            </div>
                        )}
                    </div>
                    {profileDetailError && (
                        <p role="status" className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                            Một số thông tin hồ sơ chi tiết chưa tải được. Bạn có thể thử tải lại trang.
                        </p>
                    )}
                </section>

                {/* Profile Information */}
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                    <h2 className="mb-4 border-b border-gray-100 pb-3 text-xl font-bold text-gray-900">
                        Thông tin cá nhân
                    </h2>
                    
                    <div className="space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                            <div>
                                <p className="text-sm text-emerald-800">Số dư ví</p>
                                <p className="text-2xl font-bold text-emerald-950">{formatMoney(Number(user.amount || 0))}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleOpenTopupModal}
                                    className="rounded-full bg-emerald-700 px-4 py-2 font-medium text-white transition-colors hover:bg-emerald-800"
                                >
                                    Nạp tiền
                                </button>
                                <button
                                    onClick={handleOpenWithdrawModal}
                                    disabled={Number(user.amount || 0) < 1000}
                                    className="rounded-full bg-amber-600 px-4 py-2 font-medium text-white transition-colors hover:bg-amber-700"
                                >
                                    Rút tiền
                                </button>
                            </div>
                        </div>

                        {walletNotice && (
                            <div
                                role="status"
                                className={`rounded-xl border px-4 py-3 text-sm ${
                                    walletNotice.type === "success"
                                        ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                                        : walletNotice.type === "error"
                                            ? "border-red-200 bg-red-50 text-red-800"
                                            : "border-blue-200 bg-blue-50 text-blue-900"
                                }`}
                            >
                                {walletNotice.text}
                            </div>
                        )}

                        <div className="rounded-xl border border-gray-100 p-4">
                            <div className="mb-3 flex items-center justify-between gap-3">
                                <div>
                                    <h3 className="font-semibold text-gray-900">Yêu cầu rút tiền gần đây</h3>
                                    <p className="mt-1 text-xs text-gray-500">Số dư được giữ chỗ trong khi chờ xử lý.</p>
                                </div>
                                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                                    {myWithdrawals.length} gần nhất
                                </span>
                            </div>
                            {myWithdrawalsError ? (
                                <p role="alert" className="text-sm text-red-700">Không thể tải lịch sử rút tiền.</p>
                            ) : myWithdrawals.length === 0 ? (
                                <p className="text-sm text-gray-500">Chưa có yêu cầu rút tiền nào.</p>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {myWithdrawals.map((request) => (
                                        <div key={request.id} className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0">
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">{formatMoney(request.amount)}</p>
                                                <p className="mt-1 text-xs text-gray-500">
                                                    {request.invoiceNumber} · {new Date(request.createdAt).toLocaleDateString("vi-VN")}
                                                </p>
                                            </div>
                                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                request.status === "Paid"
                                                    ? "bg-emerald-100 text-emerald-800"
                                                    : request.status === "Rejected"
                                                        ? "bg-red-100 text-red-700"
                                                        : request.status === "Approved"
                                                            ? "bg-blue-100 text-blue-800"
                                                            : "bg-amber-100 text-amber-800"
                                            }`}>
                                                {request.status === "Paid"
                                                    ? "Đã chuyển khoản"
                                                    : request.status === "Rejected"
                                                        ? "Đã từ chối · Đã hoàn tiền"
                                                        : request.status === "Approved"
                                                            ? "Đã duyệt · Chờ chuyển"
                                                            : "Đang chờ duyệt"}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {profileDetail?.bio && (
                            <div className="rounded-xl bg-gray-50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Giới thiệu</p>
                                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-700">{profileDetail.bio}</p>
                            </div>
                        )}

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
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                    <h2 className="mb-4 border-b border-gray-100 pb-3 text-xl font-bold text-gray-900">
                        Bảo mật
                    </h2>
                    
                    <div className="space-y-3">
                        <button 
                            onClick={handleOpenModal}
                            className="w-full rounded-full border border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 sm:w-auto"
                        >
                           <FontAwesomeIcon icon={faLock} /> Đổi mật khẩu
                        </button>
                        <button 
                            onClick={handleLogout}
                            className="w-full rounded-full border border-red-200 px-4 py-2 font-medium text-red-700 transition-colors hover:bg-red-50 sm:ml-2 sm:w-auto"
                        >
                           <FontAwesomeIcon icon={faSignOutAlt} /> Đăng xuất
                        </button>
                    </div>
                </div>
                </div>{/* end left column */}

                {/* Right column */}
                <div className="flex flex-col gap-6 lg:col-span-7">
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between gap-3 border-b border-gray-100 pb-3">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Mua sắm</p>
                            <h2 className="mt-1 text-xl font-bold text-gray-900">
                        Đơn hàng của tôi
                            </h2>
                        </div>
                        <Link href="/shop" className="text-sm font-semibold text-emerald-800 hover:text-emerald-950">
                            Khám phá cửa hàng
                        </Link>
                    </div>

                    {myOrdersLoading ? (
                        <div className="space-y-3">
                            {Array.from({ length: 3 }).map((_, idx) => (
                                <div key={idx} className="h-16 rounded-lg bg-gray-100 animate-pulse" />
                            ))}
                        </div>
                    ) : myOrdersError ? (
                        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                            Không thể tải đơn hàng. Vui lòng tải lại trang để thử lại.
                        </p>
                    ) : myOrders.length === 0 ? (
                        <div className="text-center py-8 rounded-lg border border-dashed border-gray-300 bg-gray-50">
                            <p className="text-gray-600">Bạn chưa có đơn hàng nào.</p>
                            <Link
                                href="/shop"
                                className="inline-block mt-3 rounded-full bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-800"
                            >
                                Mua sắm ngay
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {myOrders.map((order) => {
                                const status = getOrderStatus(order.status);
                                return (
                                    <div key={order.id} className="rounded-lg border border-gray-200 p-4">
                                        <div className="flex flex-wrap items-start justify-between gap-3">
                                            <div>
                                                <h3 className="font-semibold text-gray-900">Đơn hàng #{order.number}</h3>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    Ngày tạo: {new Date(order.createdDate).toLocaleDateString("vi-VN")}
                                                </p>
                                                {order.note && (
                                                    <p className="mt-2 text-sm text-gray-700 bg-gray-50 rounded-md px-3 py-2">
                                                        Ghi chú: {order.note}
                                                    </p>
                                                )}
                                            </div>
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${status.className}`}>
                                                {status.text}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {isInfluencer && (
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4 border-b pb-2 gap-3">
                        <h2 className="text-xl font-bold text-gray-900">
                            Cơ hội đã ứng tuyển
                        </h2>
                        <Link
                            href="/influencer/job"
                            className="text-sm font-semibold text-emerald-800 hover:text-emerald-950"
                        >
                            Tìm thêm job
                        </Link>
                    </div>

                    {appliedJobsLoading ? (
                        <div className="space-y-3">
                            {Array.from({ length: 3 }).map((_, idx) => (
                                <div key={idx} className="h-20 rounded-lg bg-gray-100 animate-pulse" />
                            ))}
                        </div>
                    ) : appliedJobsError ? (
                        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                            Không thể tải danh sách ứng tuyển. Vui lòng tải lại trang để thử lại.
                        </p>
                    ) : appliedJobs.length === 0 ? (
                        <div className="text-center py-8 rounded-lg border border-dashed border-gray-300 bg-gray-50">
                            <p className="text-gray-600">Bạn chưa ứng tuyển job nào.</p>
                            <Link
                                href="/influencer/job"
                                className="inline-block mt-3 rounded-full bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-800"
                            >
                                Xem danh sách job
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {appliedJobs.map((job) => {
                                const status = getApplicationStatus(job.applicationStatus);
                                return (
                                    <div key={job.id} className="rounded-lg border border-gray-200 p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{job.title}</h3>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    Đăng bởi {job.postedByName}
                                                    {job.brand ? ` • ${job.brand}` : ""}
                                                </p>
                                            </div>
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${status.className}`}>
                                                {status.text}
                                            </span>
                                        </div>
                                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
                                            <span>Ngân sách: {formatMoney(job.budget)}{job.budgetMax ? ` - ${formatMoney(job.budgetMax)}` : ""}</span>
                                            <span>Ngày ứng tuyển: {new Date(job.appliedDate).toLocaleDateString("vi-VN")}</span>
                                            {job.deadline && <span>Hạn: {new Date(job.deadline).toLocaleDateString("vi-VN")}</span>}
                                        </div>
                                        {job.message && (
                                            <p className="mt-2 text-sm text-gray-700 bg-gray-50 rounded-md px-3 py-2">
                                                Lời nhắn: {job.message}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
                )}

                </div>{/* end right column */}
                </div>{/* end 2-column grid */}
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

            {/* Topup Modal */}
            {isTopupModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
                    <div role="dialog" aria-modal="true" aria-labelledby="topup-modal-title" className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
                        <div className="mb-5 flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Thanh toán bảo mật</p>
                                <h3 id="topup-modal-title" className="mt-1 text-xl font-bold text-gray-900">Nạp tiền vào ví</h3>
                            </div>
                            <button
                                onClick={handleCloseTopupModal}
                                aria-label="Đóng"
                                className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                                disabled={isTopupSubmitting}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="mb-5 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                            <p className="text-sm font-semibold text-emerald-950">Nạp qua PayOS</p>
                            <p className="mt-1 text-sm leading-5 text-emerald-900/80">
                                Bạn sẽ được chuyển sang trang PayOS để hoàn tất thanh toán. Ví chỉ được cộng tiền sau khi hệ thống xác nhận giao dịch.
                            </p>
                        </div>
                        <form onSubmit={handleSubmitTopup} className="space-y-4">
                            <div>
                                <label htmlFor="topup-amount" className="mb-1 block text-sm font-medium text-gray-700">
                                    Số tiền nạp (VND)
                                </label>
                                <input
                                    id="topup-amount"
                                    type="number"
                                    min={1000}
                                    max={2147483647}
                                    step={1000}
                                    value={topupForm.amount}
                                    onChange={(e) => setTopupForm(prev => ({ ...prev, amount: e.target.value }))}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-lg font-semibold text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                                    placeholder="Nhập số tiền"
                                    required
                                />
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {[50000, 100000, 200000, 500000, 1000000].map((amount) => (
                                        <button
                                            key={amount}
                                            type="button"
                                            onClick={() => setTopupForm((prev) => ({ ...prev, amount: String(amount) }))}
                                            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                                                Number(topupForm.amount) === amount
                                                    ? "border-emerald-700 bg-emerald-700 text-white"
                                                    : "border-gray-200 text-gray-600 hover:border-emerald-300 hover:bg-emerald-50"
                                            }`}
                                        >
                                            {formatMoney(amount)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="topup-note" className="mb-1 block text-sm font-medium text-gray-700">
                                    Nội dung (không bắt buộc)
                                </label>
                                <textarea
                                    id="topup-note"
                                    value={topupForm.note}
                                    onChange={(e) => setTopupForm(prev => ({ ...prev, note: e.target.value }))}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                                    placeholder="Ví dụ: Nạp tiền mua sắm"
                                    rows={2}
                                    maxLength={512}
                                />
                            </div>

                            {topupError && (
                                <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                                    {topupError}
                                </div>
                            )}

                            <p className="text-xs leading-5 text-gray-500">
                                Hạn mức kỹ thuật tối đa mỗi giao dịch là 2.147.483.647₫. Phí giao dịch (nếu có) sẽ được PayOS hiển thị trước khi thanh toán.
                            </p>
                            <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={handleCloseTopupModal}
                                    className="flex-1 rounded-full border border-gray-300 px-4 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50"
                                    disabled={isTopupSubmitting}
                                >
                                    Để sau
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 rounded-full bg-emerald-700 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
                                    disabled={isTopupSubmitting}
                                >
                                    {isTopupSubmitting ? "Đang tạo thanh toán..." : "Tiếp tục đến PayOS"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Withdraw Modal */}
            {isWithdrawModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
                    <div role="dialog" aria-modal="true" aria-labelledby="withdraw-modal-title" className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
                        <div className="mb-5 flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">Chuyển khoản thủ công</p>
                                <h3 id="withdraw-modal-title" className="mt-1 text-xl font-bold text-gray-900">Tạo yêu cầu rút tiền</h3>
                            </div>
                            <button
                                onClick={handleCloseWithdrawModal}
                                aria-label="Đóng"
                                className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                                disabled={isWithdrawSubmitting}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="mb-5 rounded-xl border border-amber-100 bg-amber-50 p-4">
                            <p className="text-sm font-semibold text-amber-950">Số dư khả dụng: {formatMoney(Number(user.amount || 0))}</p>
                            <p className="mt-1 text-sm leading-5 text-amber-900/80">
                                Số tiền được giữ chỗ khi gửi yêu cầu. Quản trị viên sẽ kiểm tra và chuyển khoản thủ công; nếu từ chối, tiền sẽ được hoàn lại vào ví.
                            </p>
                        </div>

                        <form onSubmit={handleSubmitWithdraw} className="space-y-4">
                            <div>
                                <label htmlFor="withdraw-amount" className="mb-1 block text-sm font-medium text-gray-700">
                                    Số tiền muốn rút (VND)
                                </label>
                                <input
                                    id="withdraw-amount"
                                    type="number"
                                    min={1000}
                                    max={Number(user.amount || 0)}
                                    step={1000}
                                    value={withdrawForm.amount}
                                    onChange={(e) => setWithdrawForm(prev => ({ ...prev, amount: e.target.value }))}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-lg font-semibold text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-100"
                                    placeholder="Nhập số tiền"
                                    required
                                />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="withdraw-bank" className="mb-1 block text-sm font-medium text-gray-700">Ngân hàng</label>
                                    <input
                                        id="withdraw-bank"
                                        value={withdrawForm.bankName}
                                        onChange={(e) => setWithdrawForm(prev => ({ ...prev, bankName: e.target.value }))}
                                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-100"
                                        placeholder="Ví dụ: Vietcombank"
                                        maxLength={100}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="withdraw-holder" className="mb-1 block text-sm font-medium text-gray-700">Tên chủ tài khoản</label>
                                    <input
                                        id="withdraw-holder"
                                        value={withdrawForm.accountHolder}
                                        onChange={(e) => setWithdrawForm(prev => ({ ...prev, accountHolder: e.target.value }))}
                                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm uppercase focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-100"
                                        placeholder="Tên trên tài khoản ngân hàng"
                                        maxLength={128}
                                        autoComplete="name"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="withdraw-account" className="mb-1 block text-sm font-medium text-gray-700">Số tài khoản</label>
                                <input
                                    id="withdraw-account"
                                    type="text"
                                    inputMode="numeric"
                                    value={withdrawForm.accountNumber}
                                    onChange={(e) => setWithdrawForm(prev => ({ ...prev, accountNumber: e.target.value }))}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-100"
                                    placeholder="Nhập số tài khoản ngân hàng"
                                    autoComplete="off"
                                    maxLength={32}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="withdraw-note" className="mb-1 block text-sm font-medium text-gray-700">
                                    Ghi chú cho quản trị viên (không bắt buộc)
                                </label>
                                <textarea
                                    id="withdraw-note"
                                    value={withdrawForm.note}
                                    onChange={(e) => setWithdrawForm(prev => ({ ...prev, note: e.target.value }))}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-100"
                                    placeholder="Thêm thông tin cần thiết cho yêu cầu"
                                    rows={2}
                                    maxLength={512}
                                />
                            </div>

                            {withdrawError && (
                                <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                                    {withdrawError}
                                </div>
                            )}

                            {withdrawSuccess && (
                                <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
                                    {withdrawSuccess}
                                </div>
                            )}

                            <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={handleCloseWithdrawModal}
                                    className="flex-1 rounded-full border border-gray-300 px-4 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50"
                                    disabled={isWithdrawSubmitting}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 rounded-full bg-amber-600 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    disabled={isWithdrawSubmitting || Number(withdrawForm.amount) > Number(user.amount || 0)}
                                >
                                    {isWithdrawSubmitting ? "Đang gửi yêu cầu..." : "Gửi yêu cầu rút tiền"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </PageContainer>
    )
}

export default Page