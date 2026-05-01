import axios from "axios";

const request = axios.create({
  baseURL: "https://api.shinectgialai.vn/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

request.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default request;
