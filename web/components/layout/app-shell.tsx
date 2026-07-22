"use client";

import { ConfigProvider } from "antd";
import { useEffect, useMemo } from "react";
import { FALLBACK_THEME, getThemeKey, getThemeStylesheetHref } from "@/config/theme";
import { useAppContext } from "@/contexts/app-context";
import { CartProvider } from "@/contexts/cart-context";
import Footer from "./footer";
import Header from "./header";

export default function AppShell({ children }: { children: React.ReactNode }) {
    const { themeKey: appThemeKey } = useAppContext();
    const themeKey = useMemo(() => getThemeKey(appThemeKey), [appThemeKey]);
    const stylesheetHref = useMemo(() => getThemeStylesheetHref(themeKey), [themeKey]);
    const fallbackStylesheetHref = useMemo(() => getThemeStylesheetHref(FALLBACK_THEME), []);

    useEffect(() => {
        const linkId = "app-theme-css";
        const currentLink = document.getElementById(linkId) as HTMLLinkElement | null;
        const link = currentLink ?? document.createElement("link");

        link.id = linkId;
        link.rel = "stylesheet";
        link.setAttribute("data-theme-link", "true");

        const onLinkError = () => {
            if (link.href.endsWith(fallbackStylesheetHref)) {
                return;
            }

            link.href = fallbackStylesheetHref;
            document.documentElement.setAttribute("data-theme", FALLBACK_THEME.toLowerCase());
        };

        link.addEventListener("error", onLinkError);

        if (link.href !== stylesheetHref) {
            link.href = stylesheetHref;
        }

        if (!currentLink) {
            document.head.appendChild(link);
        }

        document.documentElement.setAttribute("data-theme", themeKey.toLowerCase());

        return () => {
            link.removeEventListener("error", onLinkError);
        };
    }, [fallbackStylesheetHref, stylesheetHref, themeKey]);

    return (
        <ConfigProvider theme={{
            token: {
                fontFamily: "quicksand, sans-serif",
            },
        }}>
            <CartProvider>
                <div className="min-h-screen bg-slate-100" data-theme={themeKey.toLowerCase()}>
                    <Header />
                    {children}
                    <Footer />
                </div>
            </CartProvider>
        </ConfigProvider>
    );
}