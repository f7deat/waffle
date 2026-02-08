import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

const API_BASE_URL = "https://api.defzone.net/api/";

function createClientRequest(): AxiosInstance {
    const instance = axios.create();

    instance.interceptors.request.use((config) => {
        config.baseURL = API_BASE_URL;

        // Ensure locale param defaults to vi-VN unless explicitly provided
        config.params = { locale: "vi-VN", ...(config.params || {}) };

        // Add access token to header on client only
        const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    });

    instance.interceptors.response.use((response) => response);

    return instance;
}

function createServerRequest(): AxiosInstance {
    const instance = axios.create();

    instance.interceptors.request.use((config) => {
        config.baseURL = API_BASE_URL;

        // Ensure locale param defaults to vi-VN unless explicitly provided
        config.params = { locale: "vi-VN", ...(config.params || {}) };

        return config;
    });

    instance.interceptors.response.use((response) => response);

    return instance;
}

const clientRequest = createClientRequest();
const serverRequest = createServerRequest();

async function get<T>(url: string, config?: AxiosRequestConfig) {
    const response = await clientRequest.get<T>(url, config);
    return response.data;
}

async function post<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    const response = await clientRequest.post<T>(url, data, config);
    return response.data;
}

async function put<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    const response = await clientRequest.put<T>(url, data, config);
    return response.data;
}

async function del<T>(url: string, config?: AxiosRequestConfig) {
    const response = await clientRequest.delete<T>(url, config);
    return response.data;
}

async function getServer<T>(url: string, config?: AxiosRequestConfig) {
    const response = await serverRequest.get<T>(url, config);
    return response.data;
}

async function postServer<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    const response = await serverRequest.post<T>(url, data, config);
    return response.data;
}

async function putServer<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    const response = await serverRequest.put<T>(url, data, config);
    return response.data;
}

async function delServer<T>(url: string, config?: AxiosRequestConfig) {
    const response = await serverRequest.delete<T>(url, config);
    return response.data;
}

const request = {
    get,
    post,
    put,
    delete: del,
    server: {
        get: getServer,
        post: postServer,
        put: putServer,
        delete: delServer,
    },
};

export default request;