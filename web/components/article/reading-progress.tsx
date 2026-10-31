"use client";

import { useEffect, useState } from "react";

const ReadingProgress = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const updateProgress = () => {
            const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
            setProgress(scrollableHeight > 0 ? Math.min(100, (window.scrollY / scrollableHeight) * 100) : 0);
        };

        updateProgress();
        window.addEventListener("scroll", updateProgress, { passive: true });
        window.addEventListener("resize", updateProgress);
        return () => {
            window.removeEventListener("scroll", updateProgress);
            window.removeEventListener("resize", updateProgress);
        };
    }, []);

    return (
        <div
            className="sticky top-0 z-30 h-1 w-full bg-slate-200"
            role="progressbar"
            aria-label="Tiến độ đọc"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
        >
            <div className="h-full bg-amber-500 transition-[width] duration-150" style={{ width: `${progress}%` }} />
        </div>
    );
};

export default ReadingProgress;
