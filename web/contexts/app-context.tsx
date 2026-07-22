"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { apiCurrentUser } from "@/services/user/user";
import { SiteSetting } from "@/typings/setting";
import { apiGetSiteSetting } from "@/services/setting";
import { getThemeKey } from "@/config/theme";

export interface AppState {
    /** Thông tin user hiện tại, null nếu chưa đăng nhập */
    user: API.User | null;
    /** true trong lúc đang fetch thông tin user lần đầu */
    initializing: boolean;
    /** Đã xác thực chưa */
    isAuthenticated: boolean;
    /** Kiểm tra user có role cụ thể không */
    hasRole: (role: string) => boolean;
    /** Gọi lại để làm mới thông tin user (sau khi cập nhật profile, v.v.) */
    refreshUser: () => Promise<void>;
    /** Đăng xuất: xóa token và reset state */
    logout: () => void;
    settings?: SiteSetting;
    themeKey: string;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({
    children,
    initialSettings,
}: {
    children: React.ReactNode;
    initialSettings?: SiteSetting;
}) {

    const [user, setUser] = useState<API.User | null>(null);
    const [initializing, setInitializing] = useState(true);
    const [settings, setSettings] = useState<SiteSetting | undefined>(initialSettings);
    const themeKey = getThemeKey(settings?.theme);

    const fetchUser = useCallback(async () => {
        const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
        if (!token) {
            setUser(null);
            return;
        }
        try {
            const res = await apiCurrentUser();
            setUser(res ?? null);
        } catch {
            setUser(null);
        }
    }, []);

    const fetchSettings = useCallback(async () => {
        try {
            const res = await apiGetSiteSetting();
            setSettings(res);
        } catch (error) {
            console.error("Failed to fetch site settings:", error);
        }
    }, []);

    useEffect(() => {
        fetchUser().finally(() => setInitializing(false));
        fetchSettings();
    }, [fetchUser, fetchSettings]);

    const refreshUser = useCallback(async () => {
        await fetchUser();
    }, [fetchUser]);

    const logout = useCallback(() => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("access_token");
        }
        setUser(null);
    }, []);

    const hasRole = useCallback(
        (role: string) => !!user?.roles?.includes(role),
        [user]
    );

    return (
        <AppContext.Provider
            value={{
                user,
                initializing,
                isAuthenticated: !!user,
                hasRole,
                refreshUser,
                logout,
                settings,
                themeKey,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

/**
 * Hook để truy cập global app state từ bất kỳ client component nào.
 *
 * @example
 * const { user, isAuthenticated, hasRole, logout } = useAppContext();
 */
export function useAppContext(): AppState {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error("useAppContext must be used inside <AppProvider>");
    return ctx;
}
