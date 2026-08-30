"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { apiCurrentUser } from "@/services/user/user";
import { FooterSetting, HeaderSetting, SiteSetting } from "@/typings/setting";
import { apiGetFooterSetting, apiGetHeaderSetting, apiGetSiteSetting } from "@/services/setting";
import { apiGetMenuList } from "@/services/menu";
import { MenuNavItem } from "@/typings/menu";
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
    /** Cấu hình header (brand, logo, top menu) từ admin */
    header?: HeaderSetting;
    /** Cấu hình footer (thông tin công ty, social, links) từ admin */
    footer?: FooterSetting;
    /** Menu điều hướng chính lấy từ API, quản lý trong admin */
    menu: MenuNavItem[];
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({
    children,
    initialSettings,
    initialHeader,
    initialFooter,
    initialMenu,
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
    const [header, setHeader] = useState<HeaderSetting | undefined>(initialHeader);
    const [footer, setFooter] = useState<FooterSetting | undefined>(initialFooter);
    const [menu, setMenu] = useState<MenuNavItem[]>(initialMenu ?? []);
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

    const fetchLayoutData = useCallback(async () => {
        try {
            const [headerRes, footerRes, menuRes] = await Promise.all([
                apiGetHeaderSetting(),
                apiGetFooterSetting(),
                apiGetMenuList(),
            ]);
            setHeader(headerRes);
            setFooter(footerRes);
            setMenu(menuRes);
        } catch (error) {
            console.error("Failed to fetch header/footer/menu settings:", error);
        }
    }, []);

    useEffect(() => {
        fetchUser().finally(() => setInitializing(false));
        // Skip refetching layout data on mount if it was already provided server-side
        if (!initialHeader && !initialFooter && !initialMenu) {
            fetchLayoutData();
        }
        if (!initialSettings) {
            fetchSettings();
        }
    }, [fetchUser, fetchSettings, fetchLayoutData, initialHeader, initialFooter, initialMenu, initialSettings]);

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
                header,
                footer,
                menu,
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
