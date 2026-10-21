"use client";

import { useAppContext } from "@/contexts/app-context";
import { apiInfluencerJobApply, apiInfluencerJobList } from "@/services/kol/kol";
import { useCallback, useEffect, useState } from "react";
import CreateJobModal from "./create-job-modal";

const CONTENT_TYPE_LABELS: Record<string, string> = {
    Photo: "Ảnh",
    Video: "Video",
    Story: "Story",
    Reel: "Reel",
    Mixed: "Hỗn hợp",
};

const CATEGORY_OPTIONS = [
    { value: "", label: "Tất cả lĩnh vực" },
    { value: "Ẩm thực", label: "Ẩm thực" },
    { value: "Du lịch", label: "Du lịch" },
    { value: "Làm đẹp", label: "Làm đẹp" },
    { value: "Thời trang", label: "Thời trang" },
    { value: "Phong cách sống", label: "Phong cách sống" },
    { value: "Công nghệ", label: "Công nghệ" },
    { value: "Thể thao", label: "Thể thao" },
    { value: "Sức khỏe", label: "Sức khỏe" },
    { value: "Gia đình", label: "Gia đình" },
    { value: "Giải trí", label: "Giải trí" },
];

const formatMoney = (n: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

const formatFollowers = (n?: number) => {
    if (!n) return null;
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
    return n.toString();
};

const JobCard: React.FC<{
    job: API.InfluencerJobListItem;
    isAuthenticated: boolean;
    onApply: (id: string) => void;
    applying: string | null;
}> = ({ job, isAuthenticated, onApply, applying }) => (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
                <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 mb-1.5">
                    {CONTENT_TYPE_LABELS[job.contentType] ?? job.contentType}
                </span>
                <h3 className="text-base font-semibold text-gray-900 line-clamp-2">{job.title}</h3>
                {job.brand && <p className="text-xs text-gray-500 mt-0.5">{job.brand}</p>}
            </div>
            <span className="shrink-0 text-xs bg-green-100 text-green-700 font-medium px-2 py-1 rounded-full">
                Đang tuyển
            </span>
        </div>

        {/* Description */}
        {job.description && (
            <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>
        )}

        {/* Details */}
        <div className="flex flex-wrap gap-2 text-xs text-gray-500">
            {job.category && (
                <span className="flex items-center gap-1 bg-gray-100 rounded-full px-2.5 py-1">
                    🏷 {job.category}
                </span>
            )}
            {job.requiredFollowers && (
                <span className="flex items-center gap-1 bg-gray-100 rounded-full px-2.5 py-1">
                    👥 {formatFollowers(job.requiredFollowers)}+ followers
                </span>
            )}
            {job.deadline && (
                <span className="flex items-center gap-1 bg-gray-100 rounded-full px-2.5 py-1">
                    📅 {new Date(job.deadline).toLocaleDateString("vi-VN")}
                </span>
            )}
        </div>

        {/* Budget & Applications */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
            <div>
                <p className="text-xs text-gray-400">Ngân sách</p>
                <p className="text-sm font-bold text-blue-600">
                    {formatMoney(job.budget)}
                    {job.budgetMax ? ` - ${formatMoney(job.budgetMax)}` : ""}
                </p>
            </div>
            <div className="text-right">
                <p className="text-xs text-gray-400">{job.applicationCount} đã ứng tuyển</p>
                <p className="text-xs text-gray-400">
                    {new Date(job.createdDate).toLocaleDateString("vi-VN")}
                </p>
            </div>
        </div>

        {/* Apply Button */}
        {isAuthenticated ? (
            <button
                onClick={() => onApply(job.id)}
                disabled={applying === job.id}
                className="w-full rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
            >
                {applying === job.id ? "Đang ứng tuyển..." : "Ứng tuyển ngay"}
            </button>
        ) : (
            <a
                href="/user/login"
                className="block w-full rounded-lg border border-blue-600 py-2 text-center text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
            >
                Đăng nhập để ứng tuyển
            </a>
        )}
    </div>
);

const InfluencerJobList: React.FC = () => {
    const { isAuthenticated, user } = useAppContext();
    const [jobs, setJobs] = useState<API.InfluencerJobListItem[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [applying, setApplying] = useState<string | null>(null);
    const [applyMsg, setApplyMsg] = useState<{ id: string; success: boolean; text: string } | null>(null);
    const [category, setCategory] = useState("");
    const [current, setCurrent] = useState(1);
    const pageSize = 12;

    const fetchJobs = useCallback(async () => {
        setLoading(true);
        try {
            const res = await apiInfluencerJobList({ current, pageSize, category: category || undefined });
            setJobs(res.data ?? []);
            setTotal(res.total ?? 0);
        } catch {
            setJobs([]);
        } finally {
            setLoading(false);
        }
    }, [current, pageSize, category]);

    useEffect(() => { fetchJobs(); }, [fetchJobs]);

    const handleApply = async (jobId: string) => {
        setApplying(jobId);
        setApplyMsg(null);
        try {
            const res = await apiInfluencerJobApply(jobId);
            setApplyMsg({ id: jobId, success: res.succeeded, text: res.succeeded ? "Ứng tuyển thành công!" : res.message });
        } catch {
            setApplyMsg({ id: jobId, success: false, text: "Đã xảy ra lỗi. Vui lòng thử lại." });
        } finally {
            setApplying(null);
        }
    };

    const handleCreateSuccess = () => {
        setShowCreate(false);
        setCurrent(1);
        fetchJobs();
    };

    const totalPages = Math.ceil(total / pageSize);

    return (
        <div>
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                    <select
                        value={category}
                        onChange={e => { setCategory(e.target.value); setCurrent(1); }}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {CATEGORY_OPTIONS.map(o => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                    </select>
                    <p className="text-sm text-gray-500">{total} công việc</p>
                </div>
                {isAuthenticated && (
                    <button
                        onClick={() => setShowCreate(true)}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        <span className="text-lg leading-none">+</span>
                        Đăng công việc
                    </button>
                )}
            </div>

            {/* Apply notification */}
            {applyMsg && (
                <div className={`mb-4 rounded-lg px-4 py-3 text-sm font-medium ${applyMsg.success ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                    {applyMsg.text}
                </div>
            )}

            {/* Job Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="rounded-xl border border-gray-200 bg-white p-5 animate-pulse h-64" />
                    ))}
                </div>
            ) : jobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
                    <div className="text-5xl mb-3">💼</div>
                    <p className="font-semibold text-gray-700">Chưa có công việc nào</p>
                    <p className="mt-1 text-sm text-gray-400">Hãy là người đầu tiên đăng công việc!</p>
                    {isAuthenticated && (
                        <button
                            onClick={() => setShowCreate(true)}
                            className="mt-4 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                        >
                            Đăng công việc đầu tiên
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {jobs.map(job => (
                        <JobCard
                            key={job.id}
                            job={job}
                            isAuthenticated={isAuthenticated}
                            onApply={handleApply}
                            applying={applying}
                        />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                    <button
                        onClick={() => setCurrent(p => Math.max(1, p - 1))}
                        disabled={current === 1}
                        className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-40"
                    >
                        ← Trước
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(p => p === 1 || p === totalPages || Math.abs(p - current) <= 1)
                        .reduce<(number | "...")[]>((acc, p, i, arr) => {
                            if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
                            acc.push(p);
                            return acc;
                        }, [])
                        .map((p, i) =>
                            p === "..." ? (
                                <span key={`e${i}`} className="px-2 py-1.5 text-sm text-gray-400">...</span>
                            ) : (
                                <button
                                    key={p}
                                    onClick={() => setCurrent(p as number)}
                                    className={`rounded-lg px-3 py-1.5 text-sm border ${current === p ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 hover:bg-gray-50"}`}
                                >
                                    {p}
                                </button>
                            )
                        )}
                    <button
                        onClick={() => setCurrent(p => Math.min(totalPages, p + 1))}
                        disabled={current === totalPages}
                        className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-40"
                    >
                        Sau →
                    </button>
                </div>
            )}

            {/* Create Modal */}
            {showCreate && (
                <CreateJobModal onSuccess={handleCreateSuccess} onClose={() => setShowCreate(false)} />
            )}
        </div>
    );
};

export default InfluencerJobList;
