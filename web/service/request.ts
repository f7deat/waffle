import axios, { AxiosRequestConfig } from "axios";

const client = axios.create();

client.interceptors.request.use((config) => {
    config.baseURL = "https://api.defzone.net/api/";

    // Thêm access token vào header
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

client.interceptors.response.use((response) => response);

async function get<T>(url: string, config?: AxiosRequestConfig) {
    const response = await client.get<T>(url, config);
    return response.data;
}

async function post<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    const response = await client.post<T>(url, data, config);
    return response.data;
}

async function put<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    const response = await client.put<T>(url, data, config);
    return response.data;
}

async function del<T>(url: string, config?: AxiosRequestConfig) {
    const response = await client.delete<T>(url, config);
    return response.data;
}

const request = { get, post, put, delete: del };

export default request;