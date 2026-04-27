"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import { apiAddComment, apiListComments } from "@/services/comment";
import { useAppContext } from "@/contexts/app-context";

interface PlaceCommentsProps {
    placeId: string;
}

const PAGE_SIZE = 10;

const PlaceComments: React.FC<PlaceCommentsProps> = ({ placeId }) => {
    const [comments, setComments] = useState<API.CommentListItem[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [text, setText] = useState("");
    const [error, setError] = useState<string | null>(null);

    const { user, isAuthenticated, hasRole, logout, refreshUser } = useAppContext();

    const fetchComments = useCallback(async (currentPage: number) => {
        setLoading(true);
        try {
            const res = await apiListComments({ catalogId: placeId, current: currentPage, pageSize: PAGE_SIZE });
            if (res?.data) {
                setComments(res.data ?? []);
                setTotal(res.total ?? 0);
            }
        } catch {
            // silently fail
        } finally {
            setLoading(false);
        }
    }, [placeId]);

    useEffect(() => {
        fetchComments(page);
    }, [fetchComments, page]);

    const handleSubmit = async () => {
        if (!isAuthenticated || !text.trim()) return;
        setSubmitting(true);
        setError(null);
        try {
            await apiAddComment({ catalogId: placeId, message: text.trim() });
            // The apiAddComment function doesn't return a response, so we can't check for success/failure
            // In a real application, you would want to handle the response from the API
            setText("");
            // Reload page 1 to show new comment
                if (page === 1) {
                    await fetchComments(1);
                } else {
                    setPage(1);
                }
        } catch {
            setError("Đã có lỗi xảy ra. Vui lòng thử lại.");
        } finally {
            setSubmitting(false);
        }
    };

    const totalPages = Math.ceil(total / PAGE_SIZE);

    return (
        <div>
            <div className="mb-4 bg-white rounded-md p-4">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-bold">Bình luận</h2>
                    <span className="text-sm text-gray-500">{total} bình luận</span>
                </div>

                {!isAuthenticated ? (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 mb-4">
                        Vui lòng{" "}
                        <Link href="/user/login" className="font-semibold underline">
                            đăng nhập
                        </Link>{" "}
                        để bình luận.
                    </div>
                ) : (
                    <div className="mb-4">
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Nhập bình luận của bạn..."
                            rows={3}
                            className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
                        <div className="mt-2 flex justify-end">
                            <button
                                onClick={handleSubmit}
                                disabled={!text.trim() || submitting}
                                className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
                            >
                                {submitting ? "Đang gửi..." : "Gửi bình luận"}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-md p-4">
                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse rounded-lg border border-gray-100 p-3">
                                <div className="h-3 bg-gray-200 rounded w-1/4 mb-2" />
                                <div className="h-3 bg-gray-200 rounded w-3/4" />
                            </div>
                        ))}
                    </div>
                ) : comments.length === 0 ? (
                    <p className="text-center text-sm text-gray-500 py-6">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
                ) : (
                    <div className="space-y-3">
                        {comments.map((c) => (
                            <div key={c.id} className="rounded-lg border border-gray-200 p-3">
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                        {c.userAvatar ? (
                                            <img
                                                src={c.userAvatar}
                                                alt={c.userName ?? "Ẩn danh"}
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold text-gray-600">
                                                {(c.userName ?? "A")?.[0]?.toUpperCase()}
                                            </div>
                                        )}
                                        <span className="font-medium text-gray-700 text-sm">{c.userName ?? "Ẩn danh"}</span>
                                    </div>
                                    <span className="text-xs text-gray-500">{dayjs(c.createdDate).format("DD/MM/YYYY HH:mm")}</span>
                                </div>
                                <p className="text-sm text-gray-800 whitespace-pre-wrap">{c.content}</p>
                            </div>
                        ))}
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-4">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-3 py-1 rounded border text-sm disabled:opacity-40"
                        >
                            Trước
                        </button>
                        <span className="px-3 py-1 text-sm text-gray-600">
                            {page} / {totalPages}
                        </span>
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-3 py-1 rounded border text-sm disabled:opacity-40"
                        >
                            Tiếp
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlaceComments;
