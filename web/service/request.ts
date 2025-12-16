import axios from "axios";

const request = axios.create();

request.interceptors.request.use((config) => {
    config.baseURL = "https://api.defzone.net/api/";
    return config;
});

request.interceptors.response.use((response) => {
    return response;
});

export default request;