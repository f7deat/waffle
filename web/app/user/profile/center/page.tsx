/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
    apiProfileDetail,
    apiRemoveProfileCover,
    apiSocialPlatformList,
    apiUpdateProfileCover,
    apiUpdateProfileDetail,
    apiUploadMediaKit,
    apiChangeAvatar,
} from "@/services/user/user";
import { apiProvinceOptions } from "@/services/locations/province";

type SocialDraft = { profileUrl: string; followersCount: string; isVerified: boolean };

const formatSize = (bytes?: number) => (bytes ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : "");
const formatDate = (value?: string) => (value ? new Date(value).toLocaleDateString("vi-VN") : "");

const ProfileEditPage: React.FC = () => {
    const [profile, setProfile] = useState<API.ProfileDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [provinces, setProvinces] = useState<API.IOption[]>([]);
    const [platforms, setPlatforms] = useState<API.SocialPlatformItem[]>([]);

    const [name, setName] = useState("");
    const [userName, setUserName] = useState("");
    const [tagline, setTagline] = useState("");
    const [bio, setBio] = useState("");
    const [areaIds, setAreaIds] = useState<number[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");
    const [isOpenForBooking, setIsOpenForBooking] = useState(false);
    const [bookingEmail, setBookingEmail] = useState("");
    const [bookingPhone, setBookingPhone] = useState("");
    const [showFavoritePlacesOnMap, setShowFavoritePlacesOnMap] = useState(true);
    const [showEngagementStats, setShowEngagementStats] = useState(true);
    const [notifyOnComments, setNotifyOnComments] = useState(true);
    const [biz, setBiz] = useState<API.BusinessProfileDetail>({});
    const [socials, setSocials] = useState<Record<string, SocialDraft>>({});
    const [editingPlatform, setEditingPlatform] = useState<string | null>(null);

    const avatarInput = useRef<HTMLInputElement>(null);
    const coverInput = useRef<HTMLInputElement>(null);
    const mediaKitInput = useRef<HTMLInputElement>(null);

    const applyProfile = useCallback((data: API.ProfileDetail) => {
        setProfile(data);
        setName(data.name || "");
        setUserName(data.userName || "");
        setTagline(data.tagline || "");
        setBio(data.bio || "");
        setAreaIds(data.activityAreas.map((x) => x.id));
        setTags(data.tags.map((x) => x.name));
        setIsOpenForBooking(data.influencer?.isOpenForBooking ?? false);
        setBookingEmail(data.influencer?.bookingEmail || "");
        setBookingPhone(data.influencer?.bookingPhone || "");
        setShowFavoritePlacesOnMap(data.showFavoritePlacesOnMap);
        setShowEngagementStats(data.influencer?.showEngagementStats ?? true);
        setNotifyOnComments(data.notifyOnComments);
        setBiz(data.business ?? {});
        setSocials(
            Object.fromEntries(
                data.socialAccounts.map((x) => [
                    x.socialPlatformId,
                    {
                        profileUrl: x.profileUrl || "",
                        followersCount: x.followersCount != null ? String(x.followersCount) : "",
                        isVerified: x.isVerified,
                    },
                ])
            )
        );
    }, []);

    const load = useCallback(async () => {
        try {
            const [detail, provinceOptions, platformRes] = await Promise.all([
                apiProfileDetail(),
                apiProvinceOptions(),
                apiSocialPlatformList(),
            ]);
            applyProfile(detail);
            setProvinces(provinceOptions);
            setPlatforms((platformRes.data || []).filter((x) => x.isActive));
        } catch {
            setMessage({ type: "error", text: "Không thể tải thông tin hồ sơ" });
        } finally {
            setLoading(false);
        }
    }, [applyProfile]);

    useEffect(() => {
        load();
    }, [load]);

    const reloadProfile = async () => applyProfile(await apiProfileDetail());

    const addTag = () => {
        const value = tagInput.trim().replace(/^#+/, "");
        if (value && !tags.some((x) => x.toLowerCase() === value.toLowerCase()) && tags.length < 20) {
            setTags([...tags, value]);
        }
        setTagInput("");
    };

    const upload = async (file: File | undefined, action: (f: FormData) => Promise<API.TResult<object>>) => {
        if (!file) return;
        const formData = new FormData();
        formData.append("file", file);
        try {
            const res = await action(formData);
            if (res.succeeded) {
                await reloadProfile();
                setMessage({ type: "success", text: "Tải tệp thành công" });
            } else {
                setMessage({ type: "error", text: res.message || "Tải tệp thất bại" });
            }
        } catch {
            setMessage({ type: "error", text: "Tải tệp thất bại" });
        }
    };

    const removeCover = async () => {
        try {
            await apiRemoveProfileCover();
            await reloadProfile();
        } catch {
            setMessage({ type: "error", text: "Không thể gỡ ảnh bìa" });
        }
    };

    const handleSave = async () => {
        setMessage(null);
        if (!name.trim() || !userName.trim()) {
            setMessage({ type: "error", text: "Vui lòng nhập họ tên và tên hiển thị" });
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (isInfluencer && bookingEmail && !emailRegex.test(bookingEmail)) {
            setMessage({ type: "error", text: "Email nhận liên hệ không hợp lệ" });
            return;
        }
        if (isBusiness && biz.contactEmail && !emailRegex.test(biz.contactEmail)) {
            setMessage({ type: "error", text: "Email liên hệ doanh nghiệp không hợp lệ" });
            return;
        }
        setSaving(true);
        try {
            const res = await apiUpdateProfileDetail({
                name: name.trim(),
                userName: userName.trim().replace(/^@/, ""),
                tagline,
                bio,
                showFavoritePlacesOnMap,
                notifyOnComments,
                provinceIds: areaIds,
                tags,
                influencer: isInfluencer ? { isOpenForBooking, bookingEmail, bookingPhone, showEngagementStats } : undefined,
                business: isBusiness ? { ...biz } : undefined,
                socialAccounts: Object.entries(socials)
                    .filter(([, v]) => v.profileUrl.trim())
                    .map(([socialPlatformId, v]) => ({
                        socialPlatformId,
                        profileUrl: v.profileUrl.trim(),
                        followersCount: v.followersCount ? Number(v.followersCount) : null,
                        isVerified: v.isVerified,
                    })),
            });
            if (res.succeeded) {
                await reloadProfile();
                setMessage({ type: "success", text: "Cập nhật hồ sơ thành công!" });
            } else {
                setMessage({ type: "error", text: res.message || "Cập nhật hồ sơ thất bại" });
            }
        } catch {
            setMessage({ type: "error", text: "Đã xảy ra lỗi, vui lòng thử lại" });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <main className="w-full pt-28 bg-surface min-h-[calc(100vh-28rem)] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </main>
        );
    }

    if (!profile) {
        return (
            <main className="w-full pt-28 bg-surface min-h-[calc(100vh-28rem)] text-center text-error">
                {message?.text}
            </main>
        );
    }

    const isInfluencer = !!profile.influencer;
    const isBusiness = !!profile.business;
    const isCreator = isInfluencer;
    const selectedProvinces = provinces.filter((x) => areaIds.includes(Number(x.value)));
    const availableProvinces = provinces.filter((x) => !areaIds.includes(Number(x.value)));
    const socialCount = Object.values(socials).filter((x) => x.profileUrl.trim()).length;
    const inputClass =
        "w-full px-space-md py-2.5 bg-surface-container-low rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest transition-colors shadow-inner";

    const navItems = [
        { href: "#section-public-profile", icon: "account_circle", label: "Hồ sơ công khai" },
        ...(isInfluencer ? [{ href: "#section-creator-id", icon: "explore", label: "Định danh & Lĩnh vực" }] : []),
        ...(isBusiness ? [{ href: "#section-business", icon: "storefront", label: "Thông tin doanh nghiệp" }] : []),
        { href: "#section-social-links", icon: "share", label: "Kênh mạng xã hội", badge: `${socialCount} kênh` },
        { href: "#section-notifications", icon: "notifications_active", label: "Quyền riêng tư & Thông báo" },
    ];

    const privacyOptions = [
        {
            checked: showFavoritePlacesOnMap,
            onChange: setShowFavoritePlacesOnMap,
            title: "Cho phép địa điểm yêu thích của tôi xuất hiện trên Bản đồ Thổ Địa cộng đồng",
            desc: "Các quán ăn, quán cà phê bạn lưu vào danh sách công khai sẽ được gợi ý cho khách du lịch.",
        },
        ...(isInfluencer ? [{
            checked: showEngagementStats,
            onChange: setShowEngagementStats,
            title: "Hiển thị số liệu tương tác (Tỉ lệ tương tác ER & Lượt xem trung bình) trên hồ sơ công khai",
            desc: "Giúp các thương hiệu F&B và du lịch uy tín dễ dàng gửi lời mời hợp tác trực tiếp.",
        }] : []),
        {
            checked: notifyOnComments,
            onChange: setNotifyOnComments,
            title: "Nhận thông báo khi có bình luận mới hoặc phản hồi review từ độc giả bản địa",
            desc: "Gửi thông báo qua ứng dụng và email tổng hợp vào mỗi buổi tối lúc 20:00.",
        },
    ];

    return (
        <main className="w-full pt-28 bg-surface min-h-[calc(100vh-28rem)]">
            <div className="flex flex-col w-full">
                <section className="w-full bg-surface-container-low py-space-lg shadow-sm">
                    <div className="max-w-7xl mx-auto px-gutter flex flex-col md:flex-row md:items-end justify-between gap-space-md">
                        <div className="flex flex-col gap-1 min-w-0">
                            <nav className="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant flex-wrap">
                                <Link className="hover:text-primary transition-colors" href="/">Trang chủ</Link>
                                <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
                                <Link className="hover:text-primary transition-colors" href="/user/profile">Tài khoản &amp; Ví</Link>
                                <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
                                <span className="text-primary font-semibold">Cài đặt &amp; Chỉnh sửa hồ sơ</span>
                            </nav>
                            <div className="flex items-center gap-space-sm pt-1">
                                <h1 className="font-headline-lg text-headline-lg text-secondary tracking-tight">Chỉnh sửa hồ sơ cá nhân</h1>
                                {isCreator && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm">
                                        <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                                        Thổ Địa
                                    </span>
                                )}
                            </div>
                            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                                Quản lý thông tin hiển thị, nhận diện Thổ Địa và các thiết lập tài khoản của bạn trên Đi Đâu Đây.
                            </p>
                        </div>
                        <div className="flex items-center gap-space-sm flex-shrink-0 self-start md:self-end">
                            <Link
                                className="inline-flex items-center gap-1.5 px-space-md py-2 rounded-full bg-surface-container text-secondary font-label-lg text-label-lg hover:bg-surface-container-highest transition-colors shadow-sm"
                                href={`/user/${profile.userName}`}
                            >
                                <span className="material-symbols-outlined text-[18px]">visibility</span>
                                <span>Xem hồ sơ công khai</span>
                            </Link>
                            <button
                                type="button"
                                disabled={saving}
                                onClick={handleSave}
                                className="inline-flex items-center gap-1.5 px-space-lg py-2 rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg hover:bg-primary shadow-[0_4px_14px_rgba(242,107,79,0.3)] transition-all hover:-translate-y-0.5 cursor-pointer disabled:opacity-60"
                            >
                                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                <span>{saving ? "Đang lưu..." : "Lưu thay đổi"}</span>
                            </button>
                        </div>
                    </div>
                </section>

                <section className="max-w-7xl mx-auto px-gutter py-space-xl w-full">
                    {message && (
                        <div className={`mb-space-lg p-space-md rounded-xl font-body-md ${message.type === "success" ? "bg-secondary-fixed text-on-secondary-fixed-variant" : "bg-error-container text-on-error-container"}`}>
                            {message.text}
                        </div>
                    )}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
                        <aside className="lg:col-span-4 xl:col-span-3 flex flex-col gap-space-lg lg:sticky lg:top-36">
                            <div className="bg-surface-container-lowest rounded-xl p-space-sm shadow-sm flex flex-col gap-1">
                                {navItems.map((item, index) => (
                                    <a
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center justify-between px-space-md py-2.5 rounded-lg font-label-lg text-label-lg transition-colors group ${index === 0 ? "bg-secondary-fixed text-on-secondary-fixed-variant" : "text-on-surface hover:bg-surface-container"}`}
                                    >
                                        <span className="flex items-center gap-space-sm">
                                            <span className={`material-symbols-outlined text-[20px] ${index === 0 ? "text-secondary" : "text-on-surface-variant group-hover:text-primary"}`}>{item.icon}</span>
                                            {item.label}
                                        </span>
                                        {item.badge && <span className="font-label-sm text-label-sm text-secondary">{item.badge}</span>}
                                    </a>
                                ))}
                            </div>

                            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-sm">
                                <div className="flex items-center justify-between">
                                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Độ hoàn thiện hồ sơ</span>
                                    <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold">{profile.completeness}%</span>
                                </div>
                                <div className="flex items-center gap-space-md pt-1">
                                    <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">
                                        <svg className="w-full h-full -rotate-90" viewBox="0 0 40 40">
                                            <circle className="text-surface-container" cx="20" cy="20" fill="none" r="15.9155" stroke="currentColor" strokeWidth="3" />
                                            <circle className="text-primary-container transition-all duration-700" cx="20" cy="20" fill="none" r="15.9155" stroke="currentColor" strokeDasharray={`${profile.completeness} 100`} strokeLinecap="round" strokeWidth="3.2" />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="font-headline-sm text-[15px] font-bold text-secondary">{profile.completeness}%</span>
                                        </div>
                                    </div>
                                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                                        Hoàn thiện ảnh bìa, giới thiệu, khu vực, thẻ chuyên môn và kênh mạng xã hội để tăng độ uy tín.
                                    </p>
                                </div>
                                {profile.completeness < 100 && isInfluencer && !profile.influencer?.mediaKitUrl && (
                                    <div className="mt-2 bg-surface-container-low rounded-lg p-2.5 flex flex-col gap-1.5">
                                        <span className="font-label-sm text-label-sm text-on-surface font-semibold flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[15px] text-tertiary">lightbulb</span>
                                            Để đạt 100% điểm uy tín:
                                        </span>
                                        <a className="text-body-sm font-body-sm text-primary hover:underline flex items-center justify-between" href="#section-creator-id">
                                            <span>• Bổ sung hồ sơ năng lực Media Kit</span>
                                            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                                        </a>
                                    </div>
                                )}
                            </div>
                        </aside>

                        <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-space-xl">
                            {/* Cover & avatar */}
                            <section className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden" id="section-public-profile">
                                <div
                                    className="relative w-full h-56 md:h-72 bg-surface-container bg-cover bg-center"
                                    style={profile.coverImage ? { backgroundImage: `url('${profile.coverImage}')` } : undefined}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
                                    <div className="absolute top-4 right-4 flex items-center gap-2">
                                        <button type="button" onClick={() => coverInput.current?.click()} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-on-surface font-label-sm text-label-sm shadow-sm hover:bg-surface-container-lowest transition-colors cursor-pointer">
                                            <span className="material-symbols-outlined text-[16px] text-primary">add_photo_alternate</span>
                                            <span>Đổi ảnh bìa</span>
                                        </button>
                                        {profile.coverImage && (
                                            <button type="button" aria-label="Gỡ ảnh bìa" onClick={removeCover} className="p-1.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-on-surface-variant hover:text-error transition-colors cursor-pointer shadow-sm">
                                                <span className="material-symbols-outlined text-[16px]">delete</span>
                                            </button>
                                        )}
                                    </div>
                                    <input ref={coverInput} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => { upload(e.target.files?.[0], apiUpdateProfileCover); e.target.value = ""; }} />
                                    <div className="absolute bottom-3 right-4 hidden sm:block">
                                        <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white font-label-sm text-label-sm">
                                            Kích thước gợi ý: 1920 x 640px • JPG, PNG
                                        </span>
                                    </div>
                                </div>
                                <div className="px-space-lg pb-space-lg pt-0 relative flex flex-col md:flex-row md:items-end justify-between gap-space-md">
                                    <div className="flex flex-col sm:flex-row sm:items-end gap-space-md -mt-16 md:-mt-20">
                                        <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full p-1.5 bg-surface-container-lowest shadow-md flex-shrink-0">
                                            {profile.avatar ? (
                                                <img className="w-full h-full object-cover rounded-full bg-surface-container" alt={profile.name || profile.userName} src={profile.avatar} />
                                            ) : (
                                                <div className="w-full h-full rounded-full bg-surface-container flex items-center justify-center font-headline-md text-secondary uppercase">
                                                    {(profile.name || profile.userName).charAt(0)}
                                                </div>
                                            )}
                                            <button type="button" aria-label="Đổi ảnh đại diện" onClick={() => avatarInput.current?.click()} className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-primary-container text-on-primary shadow-md flex items-center justify-center hover:bg-primary transition-all cursor-pointer">
                                                <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                                            </button>
                                            <input ref={avatarInput} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => { upload(e.target.files?.[0], apiChangeAvatar); e.target.value = ""; }} />
                                        </div>
                                        <div className="flex flex-col gap-1 pb-1">
                                            <h2 className="font-headline-md text-headline-md text-secondary">{profile.name || profile.userName}</h2>
                                            <div className="flex items-center gap-2 text-on-surface-variant font-label-md text-label-md">
                                                <span>@{profile.userName}</span>
                                                {profile.provinceName && (
                                                    <>
                                                        <span>•</span>
                                                        <span className="flex items-center gap-1 text-secondary">
                                                            <span className="material-symbols-outlined text-[16px]">location_on</span>
                                                            {profile.provinceName}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="font-body-sm text-body-sm text-outline text-right">
                                        Hỗ trợ định dạng JPG, PNG hoặc WEBP.<br />Dung lượng tối đa 5MB.
                                    </p>
                                </div>
                            </section>

                            {/* Basic info */}
                            <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-lg">
                                <div className="flex items-center justify-between pb-space-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-6 rounded-full bg-primary-container" />
                                        <h3 className="font-headline-sm text-headline-sm text-secondary">Thông tin cơ bản</h3>
                                    </div>
                                    <span className="font-label-sm text-label-sm text-outline">Mục bắt buộc đánh dấu (*)</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="fullname">Họ và tên <span className="text-primary">*</span></label>
                                        <input id="fullname" type="text" maxLength={256} className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
                                        <span className="font-body-sm text-body-sm text-outline">Tên thật hiển thị trong hợp đồng truyền thông và định danh.</span>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="username">Tên hiển thị / Username <span className="text-primary">*</span></label>
                                        <div className="relative flex items-center">
                                            <span className="absolute left-3 font-label-md text-label-md text-outline">didauday.vn/</span>
                                            <input id="username" type="text" maxLength={256} className={`${inputClass} pl-28 pr-10`} value={userName} onChange={(e) => setUserName(e.target.value.replace(/\s/g, ""))} />
                                            <button type="button" title="Sao chép liên kết" onClick={() => navigator.clipboard?.writeText(`${window.location.origin}/user/${userName}`)} className="absolute right-2.5 text-on-surface-variant hover:text-primary p-1 cursor-pointer">
                                                <span className="material-symbols-outlined text-[18px]">content_copy</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="tagline">Chức danh / Khẩu hiệu nổi bật (Tagline)</label>
                                    <input id="tagline" type="text" maxLength={256} className={inputClass} value={tagline} onChange={(e) => setTagline(e.target.value)} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-label-md text-label-md text-on-surface font-semibold">Khu vực hoạt động chính</label>
                                    <div className="flex items-center flex-wrap gap-2">
                                        {selectedProvinces.map((x) => (
                                            <span key={x.value} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-on-secondary font-label-md text-label-md">
                                                <span className="material-symbols-outlined text-[16px]">location_on</span>
                                                {x.label}
                                                <button type="button" className="ml-0.5 cursor-pointer" onClick={() => setAreaIds(areaIds.filter((id) => id !== Number(x.value)))}>
                                                    <span className="material-symbols-outlined text-[14px]">close</span>
                                                </button>
                                            </span>
                                        ))}
                                        <select
                                            className="px-3 py-1.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm hover:bg-surface-container-high transition-colors cursor-pointer"
                                            value=""
                                            onChange={(e) => e.target.value && setAreaIds([...areaIds, Number(e.target.value)])}
                                        >
                                            <option value="">+ Thêm khu vực khác</option>
                                            {availableProvinces.map((x) => (
                                                <option key={x.value} value={x.value}>{x.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center justify-between">
                                        <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="bio">Giới thiệu bản thân (Bio)</label>
                                        <span className="font-label-sm text-label-sm text-outline">{bio.length} / 1024 ký tự</span>
                                    </div>
                                    <textarea id="bio" rows={4} maxLength={1024} className={`${inputClass} leading-relaxed`} value={bio} onChange={(e) => setBio(e.target.value)} />
                                    <span className="font-body-sm text-body-sm text-outline">Chia sẻ phong cách khám phá, gu ẩm thực và giá trị bạn mang đến cho cộng đồng.</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-label-md text-label-md text-on-surface font-semibold">Chủ đề &amp; Thẻ chuyên môn quan tâm</label>
                                    <div className="flex flex-wrap gap-2">
                                        {tags.map((tag) => (
                                            <button key={tag} type="button" onClick={() => setTags(tags.filter((x) => x !== tag))} className="px-3 py-1.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-md text-label-md flex items-center gap-1 shadow-sm cursor-pointer">
                                                <span>#{tag}</span>
                                                <span className="material-symbols-outlined text-[14px]">close</span>
                                            </button>
                                        ))}
                                        <input
                                            type="text"
                                            value={tagInput}
                                            placeholder="+ Thêm thẻ hashtag"
                                            maxLength={64}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); } }}
                                            onBlur={addTag}
                                            className="px-3 py-1.5 rounded-full bg-surface-container text-on-surface-variant font-label-md text-label-md focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Creator & collaboration */}
                            {isInfluencer && (
                            <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-lg" id="section-creator-id">
                                <div className="flex items-center justify-between pb-space-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-6 rounded-full bg-tertiary" />
                                        <h3 className="font-headline-sm text-headline-sm text-secondary">Thiết lập định danh Thổ Địa &amp; Hợp tác</h3>
                                    </div>
                                </div>
                                <div className="p-space-md bg-surface-container-low rounded-xl flex items-center justify-between gap-space-md">
                                    <div className="flex items-start gap-space-sm">
                                        <span className="material-symbols-outlined text-primary-container text-[26px] mt-0.5">handshake</span>
                                        <div className="flex flex-col">
                                            <span className="font-label-lg text-label-lg text-on-surface font-semibold">Mở nhận booking trải nghiệm ẩm thực &amp; du lịch từ nhãn hàng / chủ quán</span>
                                            <p className="font-body-sm text-body-sm text-on-surface-variant">Khi bật, nút &quot;Liên hệ hợp tác&quot; sẽ xuất hiện trên trang cá nhân của bạn kèm theo thông tin liên hệ được kiểm duyệt.</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                                        <input type="checkbox" className="sr-only peer" checked={isOpenForBooking} onChange={(e) => setIsOpenForBooking(e.target.checked)} />
                                        <div className="w-14 h-8 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-container shadow-inner" />
                                    </label>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="work-email">Email nhận liên hệ công việc (Booking Email)</label>
                                        <div className="relative flex items-center">
                                            <span className="material-symbols-outlined absolute left-3 text-outline text-[18px]">mail</span>
                                            <input id="work-email" type="email" maxLength={256} className={`${inputClass} pl-10`} value={bookingEmail} onChange={(e) => setBookingEmail(e.target.value)} />
                                        </div>
                                        <span className="font-body-sm text-body-sm text-outline">Địa chỉ hộp thư nhận brief chiến dịch và lời mời trải nghiệm.</span>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center justify-between" htmlFor="work-phone">
                                            <span>Số điện thoại Quản lý / Zalo</span>
                                            <span className="font-label-sm text-label-sm text-secondary font-normal flex items-center gap-0.5">
                                                <span className="material-symbols-outlined text-[14px]">lock</span>
                                                Chỉ hiện với đối tác xác thực
                                            </span>
                                        </label>
                                        <div className="relative flex items-center">
                                            <span className="material-symbols-outlined absolute left-3 text-outline text-[18px]">phone_iphone</span>
                                            <input id="work-phone" type="text" maxLength={32} className={`${inputClass} pl-10`} value={bookingPhone} onChange={(e) => setBookingPhone(e.target.value)} />
                                        </div>
                                        <span className="font-body-sm text-body-sm text-outline">Bảo vệ số cá nhân khỏi spam quảng cáo rác.</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 pt-2">
                                    <span className="font-label-md text-label-md text-on-surface font-semibold">Báo giá &amp; Hồ sơ năng lực (Media Kit)</span>
                                    <div className="p-space-md bg-surface-container-low rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
                                        <div className="flex items-center gap-space-md min-w-0">
                                            <div className="w-12 h-12 rounded-lg bg-primary-fixed flex items-center justify-center text-primary flex-shrink-0">
                                                <span className="material-symbols-outlined text-[26px]">picture_as_pdf</span>
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="font-label-md text-label-md text-on-surface font-bold truncate">{profile.influencer?.mediaKitName || "Chưa có tệp Media Kit"}</span>
                                                {profile.influencer?.mediaKitUrl && (
                                                    <span className="font-body-sm text-body-sm text-outline">{formatSize(profile.influencer?.mediaKitSize)} • Cập nhật lần cuối: {formatDate(profile.influencer?.mediaKitUpdatedAt)}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            {profile.influencer?.mediaKitUrl && (
                                                <a href={profile.influencer?.mediaKitUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-surface-container text-secondary font-label-sm text-label-sm hover:bg-surface-container-high transition-colors">
                                                    <span className="material-symbols-outlined text-[16px]">visibility</span>
                                                    <span>Xem trước</span>
                                                </a>
                                            )}
                                            <button type="button" onClick={() => mediaKitInput.current?.click()} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm hover:bg-primary transition-colors cursor-pointer">
                                                <span className="material-symbols-outlined text-[16px]">upload_file</span>
                                                <span>Tải tệp mới</span>
                                            </button>
                                            <input ref={mediaKitInput} type="file" accept="application/pdf" hidden onChange={(e) => { upload(e.target.files?.[0], apiUploadMediaKit); e.target.value = ""; }} />
                                        </div>
                                    </div>
                                </div>
                            </section>
                            )}

                            {isBusiness && (
                            <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-lg" id="section-business">
                                <div className="flex items-center gap-2 pb-space-sm">
                                    <span className="w-2.5 h-6 rounded-full bg-tertiary" />
                                    <h3 className="font-headline-sm text-headline-sm text-secondary">Thông tin doanh nghiệp</h3>
                                    {profile.business?.isVerified && (
                                        <span className="inline-flex items-center gap-1 text-primary font-label-sm text-label-sm">
                                            <span className="material-symbols-outlined text-[16px]">verified</span>Đã xác thực
                                        </span>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
                                    {([
                                        ["companyName", "Tên doanh nghiệp / thương hiệu", 256],
                                        ["taxCode", "Mã số thuế", 32],
                                        ["businessType", "Loại hình kinh doanh", 128],
                                        ["representativeName", "Người đại diện", 128],
                                        ["website", "Website", 256],
                                        ["contactEmail", "Email liên hệ", 256],
                                        ["contactPhone", "Số điện thoại liên hệ", 32],
                                        ["businessAddress", "Địa chỉ", 512],
                                    ] as [keyof API.BusinessProfileDetail, string, number][]).map(([key, label, max]) => (
                                        <div key={key} className="flex flex-col gap-1.5">
                                            <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor={`biz-${key}`}>{label}</label>
                                            <input id={`biz-${key}`} type="text" maxLength={max} className={inputClass} value={(biz[key] as string) || ""} onChange={(e) => setBiz((p) => ({ ...p, [key]: e.target.value }))} />
                                        </div>
                                    ))}
                                    <div className="flex flex-col gap-1.5 md:col-span-2">
                                        <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="biz-description">Giới thiệu doanh nghiệp</label>
                                        <textarea id="biz-description" rows={4} maxLength={2000} className={inputClass} value={biz.description || ""} onChange={(e) => setBiz((p) => ({ ...p, description: e.target.value }))} />
                                    </div>
                                </div>
                            </section>
                            )}

                            {/* Social links */}
                            <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-lg" id="section-social-links">
                                <div className="flex items-center justify-between pb-space-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-6 rounded-full bg-secondary" />
                                        <h3 className="font-headline-sm text-headline-sm text-secondary">Liên kết Mạng xã hội</h3>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                                    {platforms.map((platform) => {
                                        const draft = socials[platform.id];
                                        const editing = editingPlatform === platform.id;
                                        const update = (patch: Partial<SocialDraft>) =>
                                            setSocials({ ...socials, [platform.id]: { ...(draft ?? { profileUrl: "", followersCount: "", isVerified: false }), ...patch } });
                                        return (
                                            <div key={platform.id} className="p-space-md bg-surface-container-low rounded-xl flex flex-col gap-space-sm">
                                                <div className="flex items-center justify-between gap-space-md">
                                                    <div className="flex flex-col min-w-0">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="font-label-md text-label-md text-on-surface font-bold">{platform.name}</span>
                                                            {draft?.isVerified && <span className="material-symbols-outlined text-[15px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>}
                                                        </div>
                                                        <span className="font-body-sm text-body-sm text-outline truncate">{draft?.profileUrl || "Chưa liên kết"}</span>
                                                        {draft?.followersCount && <span className="font-label-sm text-label-sm text-primary font-semibold">{Number(draft.followersCount).toLocaleString("vi-VN")} followers</span>}
                                                    </div>
                                                    <button type="button" onClick={() => setEditingPlatform(editing ? null : platform.id)} className="text-on-surface-variant hover:text-primary font-label-sm text-label-sm p-1 cursor-pointer">
                                                        {editing ? "Đóng" : draft?.profileUrl ? "Chỉnh sửa" : "Thêm"}
                                                    </button>
                                                </div>
                                                {editing && (
                                                    <div className="flex flex-col gap-2">
                                                        <input type="url" placeholder="https://..." maxLength={1000} className={inputClass} value={draft?.profileUrl || ""} onChange={(e) => update({ profileUrl: e.target.value })} />
                                                        <input type="number" min={0} placeholder="Số followers" className={inputClass} value={draft?.followersCount || ""} onChange={(e) => update({ followersCount: e.target.value })} />
                                                        {draft?.profileUrl && (
                                                            <button type="button" onClick={() => { const next = { ...socials }; delete next[platform.id]; setSocials(next); }} className="self-start text-error font-label-sm text-label-sm cursor-pointer">
                                                                Gỡ liên kết
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* Privacy */}
                            <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md" id="section-notifications">
                                <div className="flex items-center gap-2 pb-space-sm">
                                    <span className="w-2.5 h-6 rounded-full bg-outline" />
                                    <h3 className="font-headline-sm text-headline-sm text-secondary">Quyền riêng tư &amp; Hiển thị cộng đồng</h3>
                                </div>
                                <div className="flex flex-col gap-space-md">
                                    {privacyOptions.map((option) => (
                                        <label key={option.title} className="flex items-start gap-space-md cursor-pointer group">
                                            <div className="relative flex items-center mt-1">
                                                <input type="checkbox" className="w-5 h-5 rounded-md accent-secondary cursor-pointer" checked={option.checked} onChange={(e) => option.onChange(e.target.checked)} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-label-lg text-label-lg text-on-surface group-hover:text-primary transition-colors font-semibold">{option.title}</span>
                                                <p className="font-body-sm text-body-sm text-on-surface-variant">{option.desc}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </section>

                            <section className="sticky bottom-6 z-40 bg-surface-container-lowest/95 backdrop-blur-md rounded-xl p-space-md shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
                                <div className="flex items-center gap-space-sm text-on-surface-variant">
                                    <span className="material-symbols-outlined text-[20px] text-secondary">info</span>
                                    <span className="font-body-sm text-body-sm">Thay đổi sẽ được áp dụng ngay lập tức trên trang cá nhân công khai của bạn.</span>
                                </div>
                                <div className="flex items-center gap-space-sm self-end sm:self-center">
                                    <button type="button" onClick={() => applyProfile(profile)} className="px-space-lg py-2.5 rounded-full bg-surface-container text-on-surface font-label-lg text-label-lg hover:bg-surface-container-high transition-colors cursor-pointer">
                                        Hủy thay đổi
                                    </button>
                                    <button type="button" disabled={saving} onClick={handleSave} className="inline-flex items-center gap-2 px-space-xl py-2.5 rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg hover:bg-primary shadow-[0_4px_16px_rgba(242,107,79,0.35)] transition-all hover:-translate-y-0.5 cursor-pointer disabled:opacity-60">
                                        <span className="material-symbols-outlined text-[18px]">check</span>
                                        <span>{saving ? "Đang lưu..." : "Lưu cập nhật hồ sơ"}</span>
                                    </button>
                                </div>
                            </section>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default ProfileEditPage;
