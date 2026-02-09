import axios from "axios";

// Base URL API
const axiosInstance = axios.create({
  baseURL: "https://edu-api.havirkesht.ir/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor برای token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
