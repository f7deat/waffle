"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Empty, message, Popconfirm } from "antd";
import { useAppContext } from "@/contexts/app-context";
import { apiAddComment, apiListComments, apiReportComment } from "@/services/comment";

interface ArticleCommentsProps {
  articleId: string;
  articleSlug: string;
}

interface LocalComment {
  id: string;
  content: string;
  userName: string;
  userAvatar?: string;
  createdDate: string;
}

const ArticleComments: React.FC<ArticleCommentsProps> = ({ articleId, articleSlug }) => {
  const [comments, setComments] = useState<LocalComment[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reportedIds, setReportedIds] = useState<Set<string>>(new Set());
  
  const { user, isAuthenticated } = useAppContext();

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiListComments({ catalogId: articleId, current: 1, pageSize: 100 });
      if (res?.data) {
        setComments(res.data as LocalComment[]);
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, [articleId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const addComment = async () => {
    if (!isAuthenticated || !text.trim()) return;
    setSubmitting(true);
    try {
      await apiAddComment({ catalogId: articleId, message: text.trim() });
      setText("");
      // Refresh comments after successful submission
      await fetchComments();
    } catch {
      // Error already handled
    } finally {
      setSubmitting(false);
    }
  };

  const reportComment = async (commentId: string) => {
    try {
      const result = await apiReportComment(commentId);
      if (!result.succeeded) {
        message.error(result.errors?.[0]?.description || "Không thể gửi báo cáo.");
        return;
      }
      setReportedIds((previous) => new Set(previous).add(commentId));
      message.success("Đã gửi báo cáo bình luận.");
    } catch {
      message.error("Không thể gửi báo cáo bình luận.");
    }
  };

  return (
    <div>

      <div className="mb-4 bg-white rounded-md p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold">Bình luận</h2>
          <span className="text-sm text-gray-500">{comments.length} bình luận</span>
        </div>
        {!isAuthenticated ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 mb-4">
            Vui lòng <Link href="/user/login" className="font-semibold underline">đăng nhập</Link> để bình luận.
          </div>
        ) : (
          <div className="mb-4">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Nhập bình luận của bạn..."
              className="w-full min-h-[96px] rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="mt-2 flex justify-end">
              <button
                onClick={addComment}
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
        <div className="space-y-3">
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
            <Empty description="Chưa có bình luận." />
          ) : (
            comments.map((c) => (
              <div key={c.id} className="rounded-lg border border-gray-200 p-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    {c.userAvatar ? (
                      <img
                        src={c.userAvatar}
                        alt={c.userName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold text-gray-600">
                        {c.userName?.[0]?.toUpperCase()}
                      </div>
                    )}
                    <span className="font-medium text-gray-700 text-sm">{c.userName}</span>
                    {c.isOfficialResponse && (
                      <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                        DefZone.Net
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">{new Date(c.createdDate).toLocaleString("vi-VN")}</span>
                </div>
                <p className="text-sm text-gray-800 whitespace-pre-wrap">{c.content}</p>
                {isAuthenticated && !reportedIds.has(c.id) && (
                  <div className="mt-2 text-right">
                    <Popconfirm
                      title="Báo cáo bình luận này với quản trị viên?"
                      onConfirm={() => reportComment(c.id)}
                      okText="Báo cáo"
                      cancelText="Hủy"
                    >
                      <button type="button" className="text-xs text-gray-500 hover:text-red-600">
                        Báo cáo
                      </button>
                    </Popconfirm>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleComments;
