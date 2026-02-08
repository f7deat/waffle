"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ShareAltOutlined, SoundOutlined, PauseOutlined, PlayCircleOutlined, StopOutlined, BookOutlined, HeartOutlined, CheckOutlined, FacebookFilled, TwitterOutlined, TagsOutlined } from "@ant-design/icons";
import { apiCatalogTags } from "@/services/catalog";

interface ArticleActionsProps {
  article: API.ArticleDetail;
}

const ArticleActions: React.FC<ArticleActionsProps> = ({ article }) => {
  const [tags, setTags] = useState<API.Tag[]>([]);
  const [loadingTags, setLoadingTags] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const storageBookmarkKey = "bookmarks:articles";
  const storageFavoriteKey = "favorites:articles";
  const bookmarkId = article.normalizedName ?? article.id;

  useEffect(() => {
    const fetchTags = async () => {
      if (!article?.id) return;
      try {
        setLoadingTags(true);
        const data = await apiCatalogTags(article.id);
        setTags(Array.isArray(data.data) ? data.data : []);
      } catch {
        setTags([]);
      } finally {
        setLoadingTags(false);
      }
    };
    fetchTags();
  }, [article?.id]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const bookmarks = JSON.parse(localStorage.getItem(storageBookmarkKey) || "[]");
    const favorites = JSON.parse(localStorage.getItem(storageFavoriteKey) || "[]");
    setBookmarked(bookmarks.includes(bookmarkId));
    setFavorited(favorites.includes(bookmarkId));
  }, [bookmarkId]);

  const toggleInStorage = (key: string, id: string, setter: (v: boolean) => void) => {
    if (typeof window === "undefined") return;
    const items: string[] = JSON.parse(localStorage.getItem(key) || "[]");
    const exists = items.includes(id);
    const next = exists ? items.filter(x => x !== id) : [...items, id];
    localStorage.setItem(key, JSON.stringify(next));
    setter(!exists);
  };

  const handleBookmark = () => toggleInStorage(storageBookmarkKey, bookmarkId, setBookmarked);
  const handleFavorite = () => toggleInStorage(storageFavoriteKey, bookmarkId, setFavorited);

  const shareFacebook = () => {
    if (typeof window === "undefined") return;
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}&quote=${encodeURIComponent(article.name)}`;
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=500");
  };

  const shareX = () => {
    if (typeof window === "undefined") return;
    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(article.name)}`;
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=500");
  };

  const textToRead = useMemo(() => {
    const blocks = article?.content?.blocks ?? [];
    const parts: string[] = [];
    blocks.forEach(b => {
      if (b.type === "header" && b.data?.text) parts.push(b.data.text);
      else if (b.type === "paragraph" && b.data?.text) parts.push(b.data.text);
      else if (b.type === "list" && Array.isArray(b.data?.items)) parts.push((b.data.items || []).join(". "));
      else if (b.type === "quote" && b.data?.text) parts.push(b.data.text);
    });
    return parts.join(". ");
  }, [article?.content?.blocks]);

  const speak = useCallback(() => {
    if (typeof window === "undefined") return;
    if (!textToRead.trim()) return;
    if (speechSynthesis.speaking) speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(textToRead);
    utter.lang = "vi-VN";
    utter.rate = 1;
    utter.onend = () => {
      setIsReading(false);
      setIsPaused(false);
    };
    utteranceRef.current = utter;
    speechSynthesis.speak(utter);
    setIsReading(true);
    setIsPaused(false);
  }, [textToRead]);

  const pause = () => {
    if (typeof window === "undefined") return;
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resume = () => {
    if (typeof window === "undefined") return;
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const stop = () => {
    if (typeof window === "undefined") return;
    speechSynthesis.cancel();
    setIsReading(false);
    setIsPaused(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={shareFacebook} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
          <FacebookFilled /> Chia sẻ
        </button>
        <button onClick={shareX} className="inline-flex items-center gap-2 rounded-lg bg-black px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:opacity-90">
          <TwitterOutlined /> Đăng lên X
        </button>
        <div className="mx-2 h-6 w-px bg-gray-200" />
        {!isReading ? (
          <button onClick={speak} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700">
            <SoundOutlined /> Đọc bài
          </button>
        ) : (
          <div className="inline-flex items-center gap-2">
            {isPaused ? (
              <button onClick={resume} className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 px-3 py-1.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-50">
                <PlayCircleOutlined /> Tiếp tục
              </button>
            ) : (
              <button onClick={pause} className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 px-3 py-1.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-50">
                <PauseOutlined /> Tạm dừng
              </button>
            )}
            <button onClick={stop} className="inline-flex items-center gap-2 rounded-lg border border-rose-200 px-3 py-1.5 text-sm font-semibold text-rose-700 hover:bg-rose-50">
              <StopOutlined /> Dừng
            </button>
          </div>
        )}
        <div className="mx-2 h-6 w-px bg-gray-200" />
        <button onClick={handleBookmark} className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 px-3 py-1.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-50">
          {bookmarked ? <CheckOutlined /> : <BookOutlined />} {bookmarked ? "Đã lưu" : "Lưu"}
        </button>
        <button onClick={handleFavorite} className="inline-flex items-center gap-2 rounded-lg border border-pink-200 px-3 py-1.5 text-sm font-semibold text-pink-700 hover:bg-pink-50">
          {favorited ? <CheckOutlined /> : <HeartOutlined />} {favorited ? "Đã thích" : "Yêu thích"}
        </button>
      </div>

      {(loadingTags || tags.length > 0) && (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700"><TagsOutlined /> Tags:</span>
          {loadingTags ? (
            <span className="text-sm text-gray-500">Đang tải...</span>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link key={tag.id} href={`/search?q=${encodeURIComponent(tag.name)}`}>
                  <span className="inline-block rounded-full bg-blue-50 text-blue-700 text-xs md:text-sm px-2.5 py-1 hover:bg-blue-100 transition-colors">#{tag.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ArticleActions;
