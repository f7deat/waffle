"use client";

import { useState, useEffect } from "react";

export const useLanguage = () => {
    const [language, setLanguage] = useState<string>('vi-VN');

    useEffect(() => {
        // Load saved language from localStorage
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage) {
            setLanguage(savedLanguage);
        }

        // Listen for language changes
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'language' && e.newValue) {
                setLanguage(e.newValue);
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return language;
};

// Server-side helper to get language from cookies
export const getLanguageFromCookies = (cookieString: string): string => {
    const match = cookieString.match(/language=([^;]+)/);
    return match ? match[1] : 'vi-VN';
};
