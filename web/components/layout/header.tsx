"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const Header: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const stored = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
        const prefersDark = typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
        const nextDark = stored ? stored === "dark" : prefersDark;
        setIsDark(nextDark);
        if (nextDark) document.documentElement.classList.add("dark");
    }, []);

    const toggleTheme = () => {
        const next = !isDark;
        setIsDark(next);
        if (next) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    };

    const navItems = [
        { label: "Bai viet", href: "/article" },
        { label: "Dia diem", href: "/location" },
        { label: "Album anh", href: "/gallery" },
        { label: "Game", href: "/game" },
        { label: "Cua hang", href: "/shop" }
    ];

    return (
        <header className="bg-white dark:bg-slate-950">
            <div className="hidden border-b border-slate-200 bg-slate-50 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 md:block">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2">
                    <div className="flex items-center gap-4">
                        <a href="mailto:hello@defzone.net" className="hover:text-slate-900 dark:hover:text-white">hello@defzone.net</a>
                        <a href="/contact" className="hover:text-slate-900 dark:hover:text-white">Lien he</a>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500 dark:text-slate-300">
                        <a href="https://facebook.com" aria-label="Facebook" className="hover:text-blue-600">
                            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                                <path d="M13.5 9H15V6h-1.5C10.91 6 10 7.79 10 10v2H8v3h2v6h3v-6h2.07L15.5 12H13v-1.75c0-.69.18-1.25 1.25-1.25Z" />
                            </svg>
                        </a>
                        <a href="https://twitter.com" aria-label="Twitter" className="hover:text-sky-500">
                            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                                <path d="M22 5.92c-.77.35-1.6.58-2.46.69a4.17 4.17 0 0 0 1.83-2.3 8.19 8.19 0 0 1-2.6.99 4.12 4.12 0 0 0-7.1 3.75 11.67 11.67 0 0 1-8.47-4.3 4.12 4.12 0 0 0 1.28 5.5 4.05 4.05 0 0 1-1.86-.51v.05a4.12 4.12 0 0 0 3.3 4.04 4.1 4.1 0 0 1-1.85.07 4.13 4.13 0 0 0 3.85 2.86A8.26 8.26 0 0 1 2 19.54 11.65 11.65 0 0 0 8.29 21c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.36-.02-.54A8.35 8.35 0 0 0 22 5.92Z" />
                            </svg>
                        </a>
                        <a href="https://www.youtube.com" aria-label="YouTube" className="hover:text-red-500">
                            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                                <path d="M21.6 7.2s-.2-1.4-.8-2a2.8 2.8 0 0 0-2-.8C16.4 4 12 4 12 4s-4.4 0-6.8.4a2.8 2.8 0 0 0-2 .8c-.6.6-.8 2-.8 2S2 8.8 2 10.3v1.4C2 13.2 2.4 15 2.4 15s.2 1.4.8 2a2.8 2.8 0 0 0 2 .8C7.6 18 12 18 12 18s4.4 0 6.8-.4a2.8 2.8 0 0 0 2-.8c.6-.6.8-2 .8-2s.4-1.8.4-3.3v-1.4c0-1.5-.4-3.3-.4-3.3Zm-11 6.6V8.2l4.8 2.8-4.8 2.8Z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>

            <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
                <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
                <button
                    className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 md:hidden dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                    onClick={() => setIsMobileMenuOpen(true)}
                    aria-label="Open menu"
                >
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                        <path d="M4 7h16v2H4V7Zm0 5h16v2H4v-2Zm0 5h16v2H4v-2Z" />
                    </svg>
                </button>

                <Link href="/" className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-semibold">DZ</div>
                    <div>
                        <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">DefZone.Net</div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Kien thuc cong nghe & giai tri</p>
                    </div>
                </Link>

                <form className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 lg:flex dark:border-slate-800 dark:bg-slate-900">
                    <input
                        type="search"
                        placeholder="Tim kiem..."
                        className="w-48 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-100"
                    />
                    <button type="submit" aria-label="Search" className="text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-white">
                        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                            <path d="M10 4a6 6 0 1 1 0 12 6 6 0 0 1 0-12Zm0-2a8 8 0 1 0 4.9 14.2l4.4 4.4 1.4-1.4-4.4-4.4A8 8 0 0 0 10 2Z" />
                        </svg>
                    </button>
                </form>

                <nav className="hidden flex-1 items-center justify-center gap-2 md:flex">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="rounded-md px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center justify-end gap-3">
                    <button
                        className="hidden h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 md:flex dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                        aria-label="Cart"
                    >
                        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                            <path d="M7 20a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM5.2 4l.6 3H21l-1.8 8H7.4l-.3-1.5H4.2L5 17a2 2 0 0 0 2 1.6h11.5a2 2 0 0 0 2-1.6l2-9a1 1 0 0 0-1-1.2H7.3L6.7 4H2V2h3.2a1 1 0 0 1 1 .8Z" />
                        </svg>
                        Gio hang
                    </button>

                    <button
                        onClick={toggleTheme}
                        className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                        aria-label="Toggle theme"
                    >
                        {isDark ? (
                            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                                <path d="M21 12a9 9 0 0 1-9 9c-1.2 0-2.4-.24-3.5-.71A9 9 0 0 0 17.29 6.5 9 9 0 0 1 21 12Z" />
                            </svg>
                        ) : (
                            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                                <path d="M12 4a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0V5a1 1 0 0 1 1-1Zm0 12a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1Zm8-4a1 1 0 0 1-1 1h-2a1 1 0 1 1 0-2h2a1 1 0 0 1 1 1ZM7 13H5a1 1 0 0 1 0-2h2a1 1 0 1 1 0 2Zm9.78-5.78a1 1 0 0 1 1.42 0l1.42 1.42a1 1 0 1 1-1.42 1.42L16.78 8.64a1 1 0 0 1 0-1.42Zm-9.56 9.56a1 1 0 0 1 1.42 0l1.42 1.42a1 1 0 1 1-1.42 1.42l-1.42-1.42a1 1 0 0 1 0-1.42Zm12.4 1.42a1 1 0 0 1-1.42 0l-1.42-1.42a1 1 0 0 1 1.42-1.42l1.42 1.42a1 1 0 0 1 0 1.42ZM7.78 7.22a1 1 0 0 1 0 1.42L6.36 10.06a1 1 0 0 1-1.42-1.42L6.36 7.22a1 1 0 0 1 1.42 0Z" />
                            </svg>
                        )}
                    </button>
                </div>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 md:hidden" role="dialog" aria-modal="true">
                    <div className="absolute inset-y-0 left-0 w-72 max-w-[80vw] bg-white shadow-xl dark:bg-slate-950">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-semibold">DZ</div>
                                <span className="text-base font-semibold text-slate-900 dark:text-slate-100">DefZone.Net</span>
                            </div>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                aria-label="Close menu"
                                className="flex h-10 w-10 items-center justify-center rounded-md text-slate-700 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800"
                            >
                                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                                    <path d="M6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12 19 6.4 17.6 5 12 10.6 6.4 5Z" />
                                </svg>
                            </button>
                        </div>

                        <div className="px-4 py-4 space-y-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block rounded-md px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800"
                                >
                                    {item.label}
                                </Link>
                            ))}

                            <form className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-900">
                                <input
                                    type="search"
                                    placeholder="Tim kiem..."
                                    className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-100"
                                />
                                <button type="submit" aria-label="Search" className="text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-white">
                                    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                                        <path d="M10 4a6 6 0 1 1 0 12 6 6 0 0 1 0-12Zm0-2a8 8 0 1 0 4.9 14.2l4.4 4.4 1.4-1.4-4.4-4.4A8 8 0 0 0 10 2Z" />
                                    </svg>
                                </button>
                            </form>

                            <div className="flex items-center gap-3 pt-2 text-slate-600 dark:text-slate-200">
                                <a href="mailto:hello@defzone.net" className="text-sm">hello@defzone.net</a>
                                <div className="flex items-center gap-3">
                                    <a href="https://facebook.com" aria-label="Facebook" className="hover:text-blue-600">
                                        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                                            <path d="M13.5 9H15V6h-1.5C10.91 6 10 7.79 10 10v2H8v3h2v6h3v-6h2.07L15.5 12H13v-1.75c0-.69.18-1.25 1.25-1.25Z" />
                                        </svg>
                                    </a>
                                    <a href="https://twitter.com" aria-label="Twitter" className="hover:text-sky-500">
                                        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                                            <path d="M22 5.92c-.77.35-1.6.58-2.46.69a4.17 4.17 0 0 0 1.83-2.3 8.19 8.19 0 0 1-2.6.99 4.12 4.12 0 0 0-7.1 3.75 11.67 11.67 0 0 1-8.47-4.3 4.12 4.12 0 0 0 1.28 5.5 4.05 4.05 0 0 1-1.86-.51v.05a4.12 4.12 0 0 0 3.3 4.04 4.1 4.1 0 0 1-1.85.07 4.13 4.13 0 0 0 3.85 2.86A8.26 8.26 0 0 1 2 19.54 11.65 11.65 0 0 0 8.29 21c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.36-.02-.54A8.35 8.35 0 0 0 22 5.92Z" />
                                        </svg>
                                    </a>
                                    <a href="https://www.youtube.com" aria-label="YouTube" className="hover:text-red-500">
                                        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                                            <path d="M21.6 7.2s-.2-1.4-.8-2a2.8 2.8 0 0 0-2-.8C16.4 4 12 4 12 4s-4.4 0-6.8.4a2.8 2.8 0 0 0-2 .8c-.6.6-.8 2-.8 2S2 8.8 2 10.3v1.4C2 13.2 2.4 15 2.4 15s.2 1.4.8 2a2.8 2.8 0 0 0 2 .8C7.6 18 12 18 12 18s4.4 0 6.8-.4a2.8 2.8 0 0 0 2-.8c.6-.6.8-2 .8-2s.4-1.8.4-3.3v-1.4c0-1.5-.4-3.3-.4-3.3Zm-11 6.6V8.2l4.8 2.8-4.8 2.8Z" />
                                        </svg>
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-4">
                                <button
                                    onClick={toggleTheme}
                                    className="flex h-10 flex-1 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                                >
                                    {isDark ? "Sang" : "Toi"}
                                </button>
                                <button
                                    aria-label="Cart"
                                    className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                                >
                                    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                                        <path d="M7 20a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM5.2 4l.6 3H21l-1.8 8H7.4l-.3-1.5H4.2L5 17a2 2 0 0 0 2 1.6h11.5a2 2 0 0 0 2-1.6l2-9a1 1 0 0 0-1-1.2H7.3L6.7 4H2V2h3.2a1 1 0 0 1 1 .8Z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    <button
                        className="absolute inset-0 w-full cursor-default"
                        aria-label="Close menu overlay"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                </div>
            )}
        </header>
    );
};

export default Header;