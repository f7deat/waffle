import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

const API_BASE_URL = "https://api.defzone.net/api/";

function createServerRequest(): AxiosInstance {
    const instance = axios.create();

    instance.interceptors.request.use((config) => {
        config.baseURL = API_BASE_URL;

         // Get locale from localStorage, default to vi-VN
        const locale = typeof window !== "undefined" ? getLocaleFromCookies(document.cookie) || "vi-VN" : "vi-VN";
        
        // Ensure locale param defaults to stored language unless explicitly provided
        config.params = { locale, ...(config.params || {}) };

        // Add access token to header on client only
        const token = typeof window !== "undefined" ? getAuthTokenFromCookies(document.cookie) : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    });

    instance.interceptors.response.use((response) => response);

    return instance;
}

const client = createServerRequest();

    async function get<T>(url: string, config?: AxiosRequestConfig & {
        cookie?: string;
    }) {
    if (config?.cookie) {
        const locale = getLocaleFromCookies(config.cookie);
        config.params = { ...config.params, locale };
        const token = getAuthTokenFromCookies(config.cookie);
        if (token) {
            config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
        }
    }
    const response = await client.get<T>(url, config);
    return response.data;
}

async function post<T>(url: string, data?: unknown, config?: AxiosRequestConfig & {
        cookie?: string;
    }) {
    if (config?.cookie) {
        const locale = getLocaleFromCookies(config.cookie);
        config.params = { ...config.params, locale };
        const token = getAuthTokenFromCookies(config.cookie);
        if (token) {
            config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
        }
    }
    const response = await client.post<T>(url, data, config);
    return response.data;
}

async function put<T>(url: string, data?: unknown, config?: AxiosRequestConfig & {
        cookie?: string;
    }) {
    if (config?.cookie) {
        const locale = getLocaleFromCookies(config.cookie);
        config.params = { ...config.params, locale };
        const token = getAuthTokenFromCookies(config.cookie);
        if (token) {
            config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
        }
    }
    const response = await client.put<T>(url, data, config);
    return response.data;
}

async function del<T>(url: string, config?: AxiosRequestConfig & {
        cookie?: string;
    }) {
    if (config?.cookie) {
        const locale = getLocaleFromCookies(config.cookie);
        config.params = { ...config.params, locale };
        const token = getAuthTokenFromCookies(config.cookie);
        if (token) {
            config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
        }
    }
    const response = await client.delete<T>(url, config);
    return response.data;
}

// Helper to get locale from cookies for server-side requests
export function getLocaleFromCookies(cookieString?: string): string {
    if (!cookieString) return "vi-VN";
    const match = cookieString.match(/language=([^;]+)/);
    return match ? match[1] : "vi-VN";
}

export function getAuthTokenFromCookies(cookieString?: string): string | null {
    if (!cookieString) return null;
    const match = cookieString.match(/access_token=([^;]+)/);
    return match ? match[1] : null;
}

const request = {
    get,
    post,
    put,
    delete: del,
    getLocaleFromCookies,
};

export default request;