export const THEME_NAME = {
    DEFAULT: 'DEFAULT',
    SHINEC: 'SHINEC',
} as const;

export const FALLBACK_THEME = THEME_NAME.DEFAULT;

export function getThemeKey(theme?: string): string {
    const raw = (theme ?? FALLBACK_THEME).trim();
    return raw.length ? raw.toUpperCase() : FALLBACK_THEME;
}

export function getThemeStylesheetHref(theme?: string): string {
    const slug = getThemeKey(theme)
        .toLowerCase()
        .replace(/[^a-z0-9_-]+/g, "-")
        .replace(/^-+|-+$/g, "");

    return `/themes/${slug || THEME_NAME.DEFAULT.toLowerCase()}.css`;
}