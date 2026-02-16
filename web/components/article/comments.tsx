"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Empty } from "antd";

interface ArticleCommentsProps {
  articleId: string;
  articleSlug: string;
}

interface LocalComment {
  id: string;
  content: string;
  author: string; // from token or placeholder
  createdAt: string;
}

const ArticleComments: React.FC<ArticleCommentsProps> = ({ articleId, articleSlug }) => {
  const storageKey = useMemo(() => `comments:article:${articleSlug || articleId}`, [articleId, articleSlug]);
  const [comments, setComments] = useState<LocalComment[]>([]);
  const [text, setText] = useState("");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setToken(localStorage.getItem("access_token"));
    const raw = localStorage.getItem(storageKey);
    setComments(raw ? JSON.parse(raw) : []);
  }, [storageKey]);

  const addComment = () => {
    if (!token || !text.trim()) return;
    const newComment: LocalComment = {
      id: Math.random().toString(36).slice(2),
      content: text.trim(),
      author: "Bạn", // In real impl, resolve from profile
      createdAt: new Date().toISOString(),
    };
    const next = [newComment, ...comments];
    setComments(next);
    setText("");
    if (typeof window !== "undefined") localStorage.setItem(storageKey, JSON.stringify(next));
  };

  return (
    <div>

      <div className="mb-4 bg-white rounded-md p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold">Bình luận</h2>
          <span className="text-sm text-gray-500">{comments.length} bình luận</span>
        </div>
        {!token ? (
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
                disabled={!text.trim()}
                className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
              >
                Gửi bình luận
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-md p-4">
        <div className="space-y-3">
          {comments.map((c) => (
            <div key={c.id} className="rounded-lg border border-gray-200 p-3">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{c.author}</span>
                <span>{new Date(c.createdAt).toLocaleString("vi-VN")}</span>
              </div>
              <p className="mt-1 text-sm text-gray-800 whitespace-pre-wrap">{c.content}</p>
            </div>
          ))}
          {comments.length === 0 && (
            <Empty description="Chưa có bình luận." />
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleComments;
