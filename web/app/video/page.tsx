"use client";

import { FormEvent, useEffect, useState } from "react";
import { apiVideoList, VideoItem } from "@/services/video";
import styles from "./video.module.css";

const PAGE_SIZE = 12;

const filters = [
    { label: "Tất cả", value: "all" },
    { label: "YouTube", value: "youtube" },
    { label: "TikTok", value: "tiktok" },
    { label: "Video tải lên", value: "upload" },
] as const;

type VideoFilter = (typeof filters)[number]["value"];

function getEmbedUrl(video: VideoItem): string | null {
    try {
        const url = new URL(video.url);
        const host = url.hostname.toLowerCase();
        const isYouTube = host === "youtu.be" || host === "youtube.com" || host.endsWith(".youtube.com");
        const isTikTok = host === "tiktok.com" || host.endsWith(".tiktok.com");

        if (isYouTube) {
            const videoId = host === "youtu.be"
                ? url.pathname.split("/").filter(Boolean)[0]
                : url.searchParams.get("v") || url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1];
            return videoId && /^[\w-]+$/.test(videoId)
                ? `https://www.youtube-nocookie.com/embed/${videoId}`
                : null;
        }

        if (isTikTok) {
            const videoId = url.pathname.match(/\/video\/(\d+)/)?.[1]
                || url.pathname.match(/\/embed\/v2\/(\d+)/)?.[1];
            return videoId ? `https://www.tiktok.com/embed/v2/${videoId}` : null;
        }
    } catch {
        return null;
    }

    return null;
}

function formatDuration(duration?: number) {
    if (!duration || duration < 1) return null;
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export default function VideoPage() {
    const [videos, setVideos] = useState<VideoItem[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState<VideoFilter>("all");
    const [searchInput, setSearchInput] = useState("");
    const [keyword, setKeyword] = useState("");
    const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
    const [reloadKey, setReloadKey] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let active = true;
        setLoading(true);
        setError(false);

        const params = {
            current: page,
            pageSize: PAGE_SIZE,
            ...(keyword ? { keyword } : {}),
            ...(filter === "upload" ? { sourceType: 0 } : {}),
            ...(filter === "youtube" || filter === "tiktok" ? { provider: filter } : {}),
        };

        apiVideoList(params)
            .then((result) => {
                if (!active) return;
                setVideos(result.data ?? []);
                setTotal(result.total ?? 0);
            })
            .catch(() => {
                if (active) setError(true);
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [filter, keyword, page, reloadKey]);

    useEffect(() => {
        if (!selectedVideo) return;
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") setSelectedVideo(null);
        };
        window.addEventListener("keydown", closeOnEscape);
        return () => window.removeEventListener("keydown", closeOnEscape);
    }, [selectedVideo]);

    const submitSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setPage(1);
        setKeyword(searchInput.trim());
    };

    const chooseFilter = (nextFilter: VideoFilter) => {
        setFilter(nextFilter);
        setPage(1);
    };

    const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

    return (
        <main className={styles.page}>
            <section className={styles.intro}>
                <div className={styles.introContent}>
                    <p className={styles.eyebrow}>WAFFLE / VIDEO</p>
                    <h1>Chuyện hay, xem ngay.</h1>
                    <p className={styles.introText}>Khám phá video mới nhất từ YouTube, TikTok và thư viện của chúng tôi.</p>
                </div>
                <div className={styles.introMark} aria-hidden="true">
                    <span>PLAY</span>
                </div>
            </section>

            <section className={styles.library} aria-label="Thư viện video">
                <div className={styles.toolbar}>
                    <div className={styles.filters} role="group" aria-label="Lọc video">
                        {filters.map((item) => (
                            <button
                                className={`${styles.filterButton} ${filter === item.value ? styles.filterActive : ""}`}
                                key={item.value}
                                onClick={() => chooseFilter(item.value)}
                                type="button"
                                aria-pressed={filter === item.value}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                    <form className={styles.search} onSubmit={submitSearch} role="search">
                        <label className={styles.visuallyHidden} htmlFor="video-search">Tìm video</label>
                        <input
                            id="video-search"
                            onChange={(event) => setSearchInput(event.target.value)}
                            placeholder="Tìm video..."
                            value={searchInput}
                        />
                        <button type="submit">Tìm</button>
                    </form>
                </div>

                <div className={styles.resultsHeading}>
                    <h2>{keyword ? `Kết quả cho “${keyword}”` : "Video mới nhất"}</h2>
                    <span>{total} video</span>
                </div>

                {loading ? (
                    <div className={styles.status} role="status">Đang tải video...</div>
                ) : error ? (
                    <div className={styles.status} role="alert">
                        Không thể tải danh sách video. Vui lòng thử lại sau.
                        <button type="button" onClick={() => setReloadKey((current) => current + 1)}>Thử lại</button>
                    </div>
                ) : videos.length === 0 ? (
                    <div className={styles.status}>Chưa có video phù hợp.</div>
                ) : (
                    <div className={styles.grid}>
                        {videos.map((video) => (
                            <article className={styles.videoCard} key={video.id}>
                                <button className={styles.poster} onClick={() => setSelectedVideo(video)} type="button" aria-label={`Phát ${video.name}`}>
                                    {video.thumbnailUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={video.thumbnailUrl} alt="" loading="lazy" />
                                    ) : (
                                        <span className={styles.posterPlaceholder} aria-hidden="true">W.</span>
                                    )}
                                    <span className={styles.playButton} aria-hidden="true"><i /></span>
                                    {formatDuration(video.durationSeconds) && (
                                        <span className={styles.duration}>{formatDuration(video.durationSeconds)}</span>
                                    )}
                                </button>
                                <div className={styles.cardInfo}>
                                    <span className={styles.provider}>{video.sourceType === 0 ? "THƯ VIỆN" : (video.provider || "VIDEO").toUpperCase()}</span>
                                    <h3>{video.name}</h3>
                                    {video.description && <p>{video.description}</p>}
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {!loading && !error && pageCount > 1 && (
                    <nav className={styles.pagination} aria-label="Phân trang video">
                        <button type="button" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>Trước</button>
                        <span>{page} / {pageCount}</span>
                        <button type="button" disabled={page >= pageCount} onClick={() => setPage((current) => current + 1)}>Tiếp</button>
                    </nav>
                )}
            </section>

            {selectedVideo && (
                <div className={styles.modalBackdrop} onClick={(event) => {
                    if (event.target === event.currentTarget) setSelectedVideo(null);
                }}>
                    <section className={styles.playerDialog} role="dialog" aria-modal="true" aria-label={selectedVideo.name}>
                        <div className={styles.dialogHeader}>
                            <h2>{selectedVideo.name}</h2>
                            <button type="button" onClick={() => setSelectedVideo(null)} aria-label="Đóng video">Đóng</button>
                        </div>
                        <div className={`${styles.player} ${selectedVideo.provider === "tiktok" ? styles.tiktokPlayer : ""}`}>
                            {selectedVideo.sourceType === 0 ? (
                                <video controls autoPlay playsInline poster={selectedVideo.thumbnailUrl} src={selectedVideo.url} />
                            ) : getEmbedUrl(selectedVideo) ? (
                                <iframe
                                    src={getEmbedUrl(selectedVideo)!}
                                    title={selectedVideo.name}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    allowFullScreen
                                />
                            ) : (
                                <div className={styles.externalFallback}>
                                    <p>Video này được lưu dưới dạng liên kết bên ngoài.</p>
                                    <a href={selectedVideo.url} target="_blank" rel="noreferrer">Mở video ở nền tảng gốc</a>
                                </div>
                            )}
                        </div>
                        {selectedVideo.description && <p className={styles.dialogDescription}>{selectedVideo.description}</p>}
                    </section>
                </div>
            )}
        </main>
    );
}