"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { apiCurrentUser } from "@/services/user/user";
import { FooterSetting, HeaderSetting, SiteSetting } from "@/typings/setting";
import { apiGetSiteSetting } from "@/services/setting";
import { MenuNavItem } from "@/typings/menu";

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
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({
    children,
    initialSettings
}: {
    children: React.ReactNode;
    initialSettings?: SiteSetting;
    initialHeader?: HeaderSetting;
    initialFooter?: FooterSetting;
    initialMenu?: MenuNavItem[];
}) {

    const [user, setUser] = useState<API.User | null>(null);
    const [initializing, setInitializing] = useState(true);
    const [settings, setSettings] = useState<SiteSetting | undefined>(initialSettings);

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
        
        if (!initialSettings) {
            fetchSettings();
        }
    }, [fetchUser, fetchSettings, initialSettings]);

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
                settings
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
