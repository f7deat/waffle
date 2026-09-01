"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Dropdown } from "antd";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { faGlobe } from '@fortawesome/free-solid-svg-icons';

const LanguageSelector: React.FC = () => {
    const router = useRouter();
    const [currentLanguage, setCurrentLanguage] = useState<string>('vi-VN');

    useEffect(() => {
        // Load saved language from localStorage
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage) {
            setCurrentLanguage(savedLanguage);
        }
    }, []);

    const handleLanguageChange = (key: string) => {
        // Save to localStorage
        localStorage.setItem('language', key);
        
        // Save to cookie for server-side access
        document.cookie = `language=${key}; path=/; max-age=31536000`; // 1 year
        
        // Update state
        setCurrentLanguage(key);
        
        // Reload the page to apply language changes
        router.refresh();
    };

    const languageLabels: Record<string, string> = {
        'vi-VN': '🇻🇳 Tiếng việt',
        'en-US': '🇺🇸 English',
        'zh-CN': '🇨🇳 Chinese',
        'ja-JP': '🇯🇵 Japanese',
        'ko-KR': '🇰🇷 Korean'
    };

    return (
        <Dropdown menu={{
            items: [
                {
                    label: '🇻🇳 Tiếng việt',
                    key: 'vi-VN'
                },
                {
                    label: '🇺🇸 English',
                    key: 'en-US'
                },
                {
                    label: '🇨🇳 Chinese',
                    key: 'zh-CN'
                },
                {
                    label: '🇯🇵 Japanese',
                    key: 'ja-JP'
                },
                {
                    label: '🇰🇷 Korean',
                    key: 'ko-KR'
                }
            ],
            onClick: ({ key }) => handleLanguageChange(key),
            selectedKeys: [currentLanguage]
        }}>
            <button type="button" className="hover:text-white transition-colors">
                <FontAwesomeIcon icon={faGlobe} /> {languageLabels[currentLanguage]?.split(' ')[0] || '🇻🇳'}
            </button>
        </Dropdown>
    );
};

export default LanguageSelector;