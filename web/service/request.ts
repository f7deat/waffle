import axios from "axios";

const request = axios.create();

request.interceptors.request.use((config) => {
    config.baseURL = "https://api.defzone.net/api/";
    
    // Thêm access token vào header
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
});

request.interceptors.response.use((response) => {
    return response;
});

export default request;